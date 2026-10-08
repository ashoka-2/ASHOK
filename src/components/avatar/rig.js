import * as THREE from 'three';
import { POSES, TUNING } from './avatarConfig';

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _pq = new THREE.Quaternion();
const _targetV = new THREE.Vector3();
const _tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
const _rotQ = new THREE.Quaternion();

/**
 * Build bone index mapping from scene root
 */
export function buildRig(root) {
  const b = {};
  root.traverse((o) => {
    if (o.isBone) {
      b[o.name] = o;
    }
  });
  return b;
}

/**
 * Rotate `bone` so that the direction bone -> child points along `dirWorld`
 * Axis-agnostic in world space, preventing Euler angle flipping or gimbal issues.
 */
export function aimBone(bone, child, dirWorld) {
  if (!bone || !child || !bone.parent) return;
  bone.updateWorldMatrix(true, true);
  bone.getWorldPosition(_a);
  child.getWorldPosition(_b);
  _targetV.copy(dirWorld).normalize();

  const currentDir = _b.sub(_a).normalize();
  if (currentDir.lengthSq() < 0.0001) return;

  _q.setFromUnitVectors(currentDir, _targetV);
  bone.parent.getWorldQuaternion(_pq);
  bone.quaternion.premultiply(_pq.clone().invert().multiply(_q).multiply(_pq));
  bone.updateWorldMatrix(true, true);
}

/**
 * Lowers T-pose arms into relaxed natural A-pose and caches all bone rest quaternions.
 */
export function toAPose(b) {
  const rest = {};
  b.sign = {};

  for (const side of ['Left', 'Right']) {
    const arm = b[`${side}Arm`];
    const foreArm = b[`${side}ForeArm`];
    const hand = b[`${side}Hand`];

    if (!arm || !foreArm) continue;

    // Detect actual world X sign without assuming axis conventions
    const armPos = arm.getWorldPosition(new THREE.Vector3());
    const s = Math.sign(armPos.x) || (side === 'Left' ? 1 : -1);
    b.sign[side] = s;

    // Relax upper arm down and slightly forward
    aimBone(arm, foreArm, new THREE.Vector3(s * 0.22, -1, 0.04));

    // Slight natural elbow bend and hand forward position
    if (hand) {
      aimBone(foreArm, hand, new THREE.Vector3(s * 0.10, -1, 0.20));
    }
  }

  // Record rest rotations for every bone in the skeleton
  Object.values(b).forEach((o) => {
    if (o.isBone) {
      rest[o.name] = o.quaternion.clone();
    }
  });

  return rest;
}

/**
 * Pose blending for one arm
 */
export function poseArm(b, rest, side, { upper, fore }, weight) {
  const arm = b[`${side}Arm`];
  const fa = b[`${side}ForeArm`];
  const hand = b[`${side}Hand`];

  if (!arm || !fa || !hand) return;

  const restArmQ = rest[arm.name];
  const restFaQ = rest[fa.name];

  if (weight < 0.001) {
    arm.quaternion.copy(restArmQ);
    fa.quaternion.copy(restFaQ);
    return;
  }

  // Start from rest
  arm.quaternion.copy(restArmQ);
  fa.quaternion.copy(restFaQ);

  const s = b.sign[side] || (side === 'Left' ? 1 : -1);

  // Aim towards desired pose targets
  const targetUpper = new THREE.Vector3(s * upper.x, upper.y, upper.z);
  const targetFore = new THREE.Vector3(s * fore.x, fore.y, fore.z);

  const aimedArmQ = arm.quaternion.clone();
  const aimedFaQ = fa.quaternion.clone();

  aimBone(arm, fa, targetUpper);
  aimBone(fa, hand, targetFore);

  aimedArmQ.copy(arm.quaternion);
  aimedFaQ.copy(fa.quaternion);

  // Slerp from rest to aimed pose by weight
  arm.quaternion.slerpQuaternions(restArmQ, aimedArmQ, Math.min(1, Math.max(0, weight)));
  fa.quaternion.slerpQuaternions(restFaQ, aimedFaQ, Math.min(1, Math.max(0, weight)));
}

/**
 * Main procedural animation tick
 * Runs every frame to breathe, track cursor, blink, gesture, and lean into scroll
 */
export function updateRig(avatar, dt, elapsed) {
  const b = avatar.bones;
  const rest = avatar.rest;
  if (!b || !rest) return;

  // Frame-rate independent exponential damping helper
  const damp = (speed) => 1 - Math.exp(-speed * dt);

  // 1. Reset all animated bones to rest quaternions
  const animatedBones = [
    'Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Neck1', 'Neck2', 'Head',
    'LeftEye', 'RightEye',
    'LeftArm', 'LeftForeArm', 'LeftHand',
    'RightArm', 'RightForeArm', 'RightHand',
  ];

  for (let i = 0; i < animatedBones.length; i++) {
    const name = animatedBones[i];
    const bone = b[name];
    if (bone && rest[name]) {
      bone.quaternion.copy(rest[name]);
    }
  }

  // 2. Pose Layer: Blend right/left arms according to rig.pose weights
  const pose = avatar.rig.pose || { idle: 1, present: 0, think: 0, wave: 0 };

  // Present pose (Right arm gestures open toward content)
  if (pose.present > 0.001) {
    poseArm(b, rest, 'Right', POSES.present, pose.present);
  }

  // Think pose (Right hand near chin)
  if (pose.think > 0.001) {
    poseArm(b, rest, 'Right', POSES.think, pose.think);
    // Subtle head tilt
    if (b.Head) {
      _tempEuler.set(0.08 * pose.think, 0, -0.12 * pose.think);
      _rotQ.setFromEuler(_tempEuler);
      b.Head.quaternion.multiply(_rotQ);
    }
  }

  // Wave pose (Right arm raises and waves)
  if (pose.wave > 0.001) {
    const waveWave = Math.sin(elapsed * 9.5) * 0.45;
    const waveTarget = {
      upper: POSES.wave.upper,
      fore: {
        x: POSES.wave.fore.x + waveWave,
        y: POSES.wave.fore.y,
        z: POSES.wave.fore.z,
      },
    };
    poseArm(b, rest, 'Right', waveTarget, pose.wave);
  }

  // 3. Additive Layer A: Natural Breathing & Micro Idle Drifts
  const breath = Math.sin(elapsed * Math.PI * 2 * TUNING.breathFreq);
  const breathPitch = breath * 0.015;

  if (b.Spine) {
    _tempEuler.set(breathPitch * 0.4, 0, 0);
    _rotQ.setFromEuler(_tempEuler);
    b.Spine.quaternion.multiply(_rotQ);
  }
  if (b.Spine1) {
    _tempEuler.set(breathPitch * 0.6, 0, 0);
    _rotQ.setFromEuler(_tempEuler);
    b.Spine1.quaternion.multiply(_rotQ);
  }
  if (b.Spine2) {
    _tempEuler.set(breathPitch * 0.8, 0, 0);
    _rotQ.setFromEuler(_tempEuler);
    b.Spine2.quaternion.multiply(_rotQ);
  }

  // Micro weight-shift sway on Hips
  if (b.Hips) {
    const hipSway = Math.sin(elapsed * 0.8) * 0.012;
    _tempEuler.set(0, 0, hipSway);
    _rotQ.setFromEuler(_tempEuler);
    b.Hips.quaternion.multiply(_rotQ);
  }

  // Micro head drift (two decoupled sine waves)
  const headDriftYaw = Math.sin(elapsed * 0.73) * 0.018 + Math.cos(elapsed * 0.41) * 0.012;
  const headDriftPitch = Math.sin(elapsed * 0.95) * 0.014;

  // 4. Additive Layer B: Cursor Look-At & Gaze Tracking
  // Smoothly damp pointer coordinates
  avatar.smoothPointer = avatar.smoothPointer || new THREE.Vector2();
  avatar.smoothPointer.lerp(avatar.pointer, damp(TUNING.pointerDamping));

  // Gaze auto-centering if pointer has been idle for > 4s
  const now = performance.now();
  const timeSinceMove = (now - (avatar.lastPointerTime || now)) / 1000;
  let targetYaw = avatar.smoothPointer.x * 0.55;
  let targetPitch = -avatar.smoothPointer.y * 0.32;

  if (timeSinceMove > 4.0) {
    const idleReturn = Math.min(1, (timeSinceMove - 4.0) / 2.0);
    targetYaw *= (1 - idleReturn);
    targetPitch *= (1 - idleReturn);
  }

  // Clamp limits to prevent awkward neck rotation
  targetYaw = THREE.MathUtils.clamp(targetYaw + headDriftYaw, -TUNING.maxNeckYaw, TUNING.maxNeckYaw);
  targetPitch = THREE.MathUtils.clamp(targetPitch + headDriftPitch, -TUNING.maxNeckPitch, TUNING.maxNeckPitch);

  // Distribute look rotation: Spine2 20%, Neck 30%, Head 50%
  const spine2Weight = TUNING.lookDistribute.spine2;
  const neckWeight = TUNING.lookDistribute.neck;
  const headWeight = TUNING.lookDistribute.head;

  if (b.Spine2) {
    _tempEuler.set(targetPitch * spine2Weight, targetYaw * spine2Weight, 0);
    _rotQ.setFromEuler(_tempEuler);
    b.Spine2.quaternion.multiply(_rotQ);
  }

  const neckBone = b.Neck2 || b.Neck1 || b.Neck;
  if (neckBone) {
    _tempEuler.set(targetPitch * neckWeight, targetYaw * neckWeight, 0);
    _rotQ.setFromEuler(_tempEuler);
    neckBone.quaternion.multiply(_rotQ);
  }

  if (b.Head) {
    _tempEuler.set(targetPitch * headWeight, targetYaw * headWeight, 0);
    _rotQ.setFromEuler(_tempEuler);
    b.Head.quaternion.multiply(_rotQ);
  }

  // Eye bones lead gaze with faster damping
  const eyeYaw = THREE.MathUtils.clamp(avatar.pointer.x * 0.35, -TUNING.eyeMaxRad, TUNING.eyeMaxRad);
  const eyePitch = THREE.MathUtils.clamp(-avatar.pointer.y * 0.25, -TUNING.eyeMaxRad, TUNING.eyeMaxRad);

  for (const eyeName of ['LeftEye', 'RightEye']) {
    const eye = b[eyeName];
    if (eye) {
      _tempEuler.set(eyePitch, eyeYaw, 0);
      _rotQ.setFromEuler(_tempEuler);
      eye.quaternion.multiply(_rotQ);
    }
  }

  // 5. Additive Layer C: Scroll Velocity Leaning & Secondary Motion
  const scrollLean = THREE.MathUtils.clamp(avatar.scrollVel * TUNING.scrollLeanFactor, -0.22, 0.22);
  if (Math.abs(scrollLean) > 0.001) {
    if (b.Spine) {
      _tempEuler.set(scrollLean * 0.45, 0, 0);
      _rotQ.setFromEuler(_tempEuler);
      b.Spine.quaternion.multiply(_rotQ);
    }
    if (b.Head) {
      // Secondary reaction: head lags slightly behind body pitch
      _tempEuler.set(-scrollLean * 0.25, 0, 0);
      _rotQ.setFromEuler(_tempEuler);
      b.Head.quaternion.multiply(_rotQ);
    }
  }

  // 6. Blink System: Natural procedural blinking (2.5 - 5.5s interval)
  avatar.blinkTimer = (avatar.blinkTimer || 0) + dt;
  if (!avatar.nextBlink) {
    avatar.nextBlink = THREE.MathUtils.randFloat(TUNING.blinkIntervalMin, TUNING.blinkIntervalMax);
  }

  let blinkVal = 0;
  if (avatar.blinkTimer >= avatar.nextBlink) {
    const blinkProgress = (avatar.blinkTimer - avatar.nextBlink) / TUNING.blinkDuration;
    if (blinkProgress <= 1.0) {
      // Bell-shaped curve for natural lid drop and lift
      blinkVal = Math.sin(blinkProgress * Math.PI);
    } else {
      // Blink finished, schedule next
      avatar.blinkTimer = 0;
      // 15% chance of quick double-blink
      const isDouble = Math.random() < 0.15;
      avatar.nextBlink = isDouble ? 0.25 : THREE.MathUtils.randFloat(TUNING.blinkIntervalMin, TUNING.blinkIntervalMax);
    }
  }

  // 7. Morph Targets: Smoothly interpolate current morphs toward morphGoal
  avatar.morphGoal = avatar.morphGoal || {};
  avatar.morph = avatar.morph || {};

  // Apply blink influence
  const effectiveBlink = Math.max(blinkVal, avatar.morphGoal.eyeBlinkLeft || 0);
  avatar.setMorph('eyeBlinkLeft', effectiveBlink);
  avatar.setMorph('eyeBlinkRight', effectiveBlink);

  // Apply other active morph targets
  for (const name in avatar.morphGoal) {
    if (name === 'eyeBlinkLeft' || name === 'eyeBlinkRight') continue;
    const goal = avatar.morphGoal[name] || 0;
    const current = avatar.morph[name] || 0;
    const nextVal = THREE.MathUtils.lerp(current, goal, damp(8.0));
    avatar.morph[name] = nextVal;
    avatar.setMorph(name, nextVal);
  }
}
