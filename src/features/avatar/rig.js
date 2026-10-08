import * as THREE from 'three';
import { TUNING } from './avatarConfig';

// Reusable scratch vectors and quaternions to eliminate garbage collection in 60fps loop
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _g = new THREE.Quaternion();
const _gi = new THREE.Quaternion();
const _p = new THREE.Quaternion();
const _q = new THREE.Quaternion();
const _l = new THREE.Quaternion();
const _w = new THREE.Quaternion();
const _d = new THREE.Vector3();

const AX = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

/**
 * buildRig
 * Traverses the avatar hierarchy to build an indexed map of all bone nodes.
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
 * aimBone
 * Aims `bone` so vector from bone to child points along direction `dir` (in holder space).
 * Mathematical quaternion premultiplication ensures independence from arbitrary bone roll axes.
 */
export function aimBone(bone, child, dir, holder) {
  if (!bone || !child || !bone.parent) return;
  bone.updateWorldMatrix(true, true);
  bone.getWorldPosition(_a);
  child.getWorldPosition(_b);
  holder.getWorldQuaternion(_g);

  _d.copy(dir).normalize().applyQuaternion(_g);
  _q.setFromUnitVectors(_b.sub(_a).normalize(), _d);
  bone.parent.getWorldQuaternion(_p);
  _l.copy(_p).invert().multiply(_q).multiply(_p);
  bone.quaternion.premultiply(_l);
  bone.updateWorldMatrix(true, true);
}

/**
 * rotBone
 * Rotates `bone` around an axis specified in avatar holder space.
 */
export function rotBone(bone, axis, ang, holder) {
  if (!bone || !bone.parent || Math.abs(ang) < 1e-5) return;
  holder.getWorldQuaternion(_g);
  bone.parent.getWorldQuaternion(_p);
  _q.setFromAxisAngle(AX[axis], ang);
  _gi.copy(_g).invert();
  _w.copy(_g).multiply(_q).multiply(_gi);
  _l.copy(_p).invert().multiply(_w).multiply(_p);
  bone.quaternion.premultiply(_l);
}

/**
 * toAPose
 * Relaxes standard ReadyPlayerMe T-pose arms down into a natural, professional A-pose.
 * Caches rest quaternions to allow procedural layers to safely reset each frame.
 */
export function toAPose(b, holder) {
  const rest = new Map();
  const side = {};

  ['Left', 'Right'].forEach((s) => {
    const arm = b[s + 'Arm'];
    const foreArm = b[s + 'ForeArm'];
    const hand = b[s + 'Hand'];
    if (!arm || !foreArm) return;

    arm.getWorldPosition(_a);
    holder.worldToLocal(_a);
    side[s] = Math.sign(_a.x) || 1;
    const k = side[s];

    aimBone(arm, foreArm, new THREE.Vector3(k * TUNING.armDown[0], TUNING.armDown[1], TUNING.armDown[2]), holder);
    if (hand) {
      aimBone(foreArm, hand, new THREE.Vector3(k * TUNING.foreDown[0], TUNING.foreDown[1], TUNING.foreDown[2]), holder);
    }
  });

  b.sideSign = side;

  // Record rest rotations
  Object.values(b).forEach((o) => {
    if (o && o.isBone) {
      rest.set(o, o.quaternion.clone());
    }
  });

  return rest;
}

/**
 * poseArm
 * Blends custom procedural arm gestures (e.g., presenting or waving) on top of the relaxed A-pose.
 */
export function poseArm(b, side, upper, lower, weight, holder) {
  if (weight < 0.002) return;
  const arm = b[side + 'Arm'];
  const fa = b[side + 'ForeArm'];
  const hand = b[side + 'Hand'];
  if (!arm || !fa || !hand) return;

  const qa = arm.quaternion.clone();
  const qf = fa.quaternion.clone();

  aimBone(arm, fa, upper, holder);
  aimBone(fa, hand, lower, holder);

  arm.quaternion.slerp(qa, 1 - weight);
  fa.quaternion.slerp(qf, 1 - weight);
}

/**
 * updateRig
 * Master procedural animation tick:
 * - Resets driven bones to cached A-pose rest transforms
 * - Evaluates natural breathing & spine sway
 * - Applies scroll lean
 * - Distributes look-at gaze tracking across spine, neck, head, and eyes
 * - Evaluates arm presentation and wave gestures
 * - Evaluates angry reaction body language (head shake and forward spine lean)
 */
export function updateRig(avatar, dt, elapsed) {
  const { bones: B, rest, holder, rig: cur, look, scrollVel, isReducedMotion } = avatar;
  if (!B || !rest || !holder) return;

  const t = elapsed;
  const k = isReducedMotion ? 0 : 1;
  const v = isReducedMotion ? 0 : THREE.MathUtils.clamp(scrollVel / 2500, -1, 1);

  // 1. Reset driven bones to rest quaternions
  const driven = [
    'Spine', 'Spine1', 'Spine2', 'Neck', 'Neck1', 'Neck2', 'Head',
    'LeftEye', 'RightEye', 'LeftArm', 'LeftForeArm', 'RightArm', 'RightForeArm',
  ];

  driven.forEach((name) => {
    const bone = B[name];
    if (bone && rest.has(bone)) {
      bone.quaternion.copy(rest.get(bone));
    }
  });

  // 2. Arm Posing (Present gesture and Wave)
  const pSign = (cur.side ?? 1) > 0 ? -1 : 1;
  const pSide = (B.sideSign?.Left ?? 1) === pSign ? 'Left' : 'Right';
  if ((cur.present || 0) > 0.002) {
    poseArm(
      B,
      pSide,
      new THREE.Vector3(pSign * 0.75, -0.55, 0.35),
      new THREE.Vector3(pSign * 0.55, -0.05, 0.85),
      cur.present,
      holder
    );
  }

  const ww = Math.max(cur.wave || 0, avatar.ovWave || 0);
  if (ww > 0.002) {
    const o = B.sideSign?.Right ?? -1;
    const sw = Math.sin(t * 9);
    poseArm(
      B,
      'Right',
      new THREE.Vector3(o * 0.85, 0.45, 0.1),
      new THREE.Vector3(o * (0.12 + 0.5 * sw), 1, 0.1),
      ww,
      holder
    );
  }

  // 3. Idle Breathing & Spine Sway
  rotBone(B.Spine, 'x', Math.sin(t * 1.5) * 0.008 * k, holder);
  rotBone(B.Spine1, 'x', Math.sin(t * 1.5 + 0.4) * 0.010 * k, holder);
  rotBone(B.Spine2, 'x', Math.sin(t * 1.5 + 0.8) * 0.012 * k, holder);
  rotBone(B.Spine, 'z', Math.sin(t * 0.6) * 0.012 * k, holder);
  rotBone(B.Spine2, 'z', -Math.sin(t * 0.6 + 0.5) * 0.010 * k, holder);

  // 4. Lean into Scroll
  rotBone(B.Spine, 'x', v * 0.05, holder);
  rotBone(B.Spine2, 'x', v * 0.04, holder);
  rotBone(B.Head, 'x', -v * 0.07, holder);

  // 5. Look-at tracking (distributed across spine, neck, head, eyes)
  const yaw = (look?.x || 0) * TUNING.lookYaw;
  const pit = -(look?.y || 0) * TUNING.lookPitch;

  rotBone(B.Spine2, 'y', yaw * 0.15, holder);
  rotBone(B.Spine2, 'x', pit * 0.10, holder);
  rotBone(B.Neck, 'y', yaw * 0.25, holder);
  rotBone(B.Neck, 'x', pit * 0.25, holder);
  if (B.Neck1) {
    rotBone(B.Neck1, 'y', yaw * 0.10, holder);
    rotBone(B.Neck1, 'x', pit * 0.10, holder);
  }
  rotBone(B.Head, 'y', yaw * 0.50, holder);
  rotBone(B.Head, 'x', pit * 0.55, holder);
  rotBone(B.Head, 'z', Math.sin(t * 0.45 + 1) * 0.02 * k + (look?.x || 0) * -0.04, holder);

  if (B.LeftEye && B.RightEye) {
    rotBone(B.LeftEye, 'y', (look?.x || 0) * 0.28, holder);
    rotBone(B.RightEye, 'y', (look?.x || 0) * 0.28, holder);
    rotBone(B.LeftEye, 'x', -(look?.y || 0) * 0.22, holder);
    rotBone(B.RightEye, 'x', -(look?.y || 0) * 0.22, holder);
  }

  // 6. Angry Reaction Body Language: Head Shake & Forward Spine Lean
  if ((avatar.angryAmount || 0) > 0.001) {
    const angry = avatar.angryAmount;
    if (!isReducedMotion) {
      // Head shake around Y (±0.06 rad at ~7 Hz, fading smoothly with angryAmount)
      const shake = Math.sin(t * Math.PI * 2 * 7) * 0.06 * angry;
      rotBone(B.Head, 'y', shake, holder);
      // Slight forward aggressive lean of spine
      rotBone(B.Spine1, 'x', 0.04 * angry, holder);
      rotBone(B.Spine2, 'x', 0.06 * angry, holder);
    }
  }
}
