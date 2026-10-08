/**
 * avatarConfig.js
 * Single source of truth for the 3D avatar system:
 * - Single model asset URL
 * - Shot framing presets (face, bust, waist, full, far)
 * - Poses and tuning constants
 * - Facial morph emotes (including angry, sad, laugh, smile, surprise, focus, think, wink)
 * - Section stops mapping home page sections to camera shots and positions
 */

// 1. Single model path (the ONLY copy in the project)
export const MODEL_URL = '/models/ashok.glb';

// 2. Camera shots derived mathematically from visible vertical height (hv in meters)
export function getShots(asp = 1.6, eyeY = 1.68, H = 1.82) {
  return {
    face: {
      hv: Math.max(0.48, 0.38 / asp),
      lhv: Math.log(Math.max(0.48, 0.38 / asp)),
      cy: eyeY - 0.035,
      fov: 26,
    },
    bust: {
      hv: Math.max(0.95, 0.80 / asp),
      lhv: Math.log(Math.max(0.95, 0.80 / asp)),
      cy: eyeY - 0.28,
      fov: 28,
    },
    waist: {
      hv: Math.max(1.50, 1.00 / asp),
      lhv: Math.log(Math.max(1.50, 1.00 / asp)),
      cy: H * 0.58,
      fov: 30,
    },
    full: {
      hv: Math.max(H * 1.28, 1.15 / asp),
      lhv: Math.log(Math.max(H * 1.28, 1.15 / asp)),
      cy: H * 0.495,
      fov: 30,
    },
    far: {
      hv: Math.max(H * 1.90, 1.30 / asp),
      lhv: Math.log(Math.max(H * 1.90, 1.30 / asp)),
      cy: H * 0.48,
      fov: 30,
    },
  };
}

// 3. Fallback initial shots before runtime calibration
export const SHOTS = getShots(1.6, 1.68, 1.82);

// 4. Arm Posing presets (A-pose and gestures)
export const POSES = {
  idle: {
    armDown: [0.22, -1, 0.04],     // Relaxed A-pose upper arm direction
    foreDown: [0.10, -1, 0.20],    // Forearm direction
  },
  present: {
    upper: { x: 0.75, y: -0.55, z: 0.35 },
    fore:  { x: 0.55, y: -0.05, z: 0.85 },
  },
  wave: {
    upper: { x: 0.85, y: 0.45, z: 0.10 },
    fore:  { x: 0.20, y: 1.00, z: 0.10 },
  },
};

// 5. Morph target expressions (all verified against ReadyPlayerMe model targets)
export const EMOTES = {
  // Angry reaction (triggered when clicking Ashok's face)
  angry: {
    browDownLeft: 1.0,
    browDownRight: 1.0,
    eyeSquintLeft: 0.55,
    eyeSquintRight: 0.55,
    noseSneerLeft: 0.6,
    noseSneerRight: 0.6,
    mouthFrownLeft: 0.7,
    mouthFrownRight: 0.7,
    cheekSquintLeft: 0.2,
    cheekSquintRight: 0.2,
  },
  sad: {
    browInnerUp: 0.8,
    mouthFrownLeft: 0.5,
    mouthFrownRight: 0.5,
    eyeSquintLeft: 0.1,
    eyeSquintRight: 0.1,
  },
  laugh: {
    mouthSmileLeft: 0.9,
    mouthSmileRight: 0.9,
    cheekSquintLeft: 0.5,
    cheekSquintRight: 0.5,
    jawOpen: 0.35,
    eyeSquintLeft: 0.3,
    eyeSquintRight: 0.3,
  },
  smile: {
    mouthSmileLeft: 0.55,
    mouthSmileRight: 0.55,
    cheekSquintLeft: 0.3,
    cheekSquintRight: 0.3,
    eyeSquintLeft: 0.12,
    eyeSquintRight: 0.12,
    browInnerUp: 0.1,
  },
  surprise: {
    browInnerUp: 0.75,
    browOuterUpLeft: 0.55,
    browOuterUpRight: 0.55,
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.16,
  },
  focus: {
    browDownLeft: 0.35,
    browDownRight: 0.35,
    eyeSquintLeft: 0.18,
    eyeSquintRight: 0.18,
    mouthClose: 0.1,
  },
  think: {
    browDownLeft: 0.25,
    browOuterUpRight: 0.5,
    mouthLeft: 0.3,
    eyeSquintLeft: 0.1,
  },
  wink: {
    eyeBlinkRight: 1.0,
    mouthSmileLeft: 0.5,
    mouthSmileRight: 0.6,
    cheekSquintRight: 0.5,
  },
};

// 6. Section Stops Mapping for the Home page
export const SECTION_STOPS = [
  { sel: 'section[data-avatar-shot="waist"], #intro', shot: 'waist', side: 1.25, pose: 'present', ry: -0.38 },
  { sel: 'section[data-avatar-shot="far"], #projects, #work', shot: 'far', side: -1.35, pose: 'idle', ry: 0.42 },
  { sel: 'section:has([id="particle-portrait"]), section:has(.lab-tile), #lab', shot: 'waist', side: 1.30, pose: 'idle', ry: -0.35 },
  { sel: 'section:has([id^="tech-chip-"]), #tech', shot: 'far', side: -1.40, pose: 'idle', ry: 0.38 },
  { sel: 'section:has(.text-outline:not(.hero-letter)), #big-name, #bn', shot: 'full', side: 0, pose: 'idle', ry: 0 },
  { sel: 'footer', shot: 'bust', side: 1.15, pose: 'wave', ry: -0.30 },
];

// 7. General tuning parameters
export const TUNING = {
  heroPinScreens: 1.5,
  lookYaw: 0.60,
  lookPitch: 0.32,
  viewShift: 0.28,
  armDown: [0.22, -1, 0.04],
  foreDown: [0.10, -1, 0.20],
};
