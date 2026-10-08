/**
 * avatarConfig.js
 * Single source of truth for shots, camera presets, sides, poses, and tuning constants.
 */

export const SHOTS = {
  face:  { camY: 1.68, camZ: 0.85, lookY: 1.66, fov: 26 },  // Face fills ~60% of viewport height
  bust:  { camY: 1.55, camZ: 1.70, lookY: 1.50, fov: 28 },  // Chest & shoulders
  waist: { camY: 1.25, camZ: 2.60, lookY: 1.20, fov: 30 },  // Torso & arms
  full:  { camY: 0.95, camZ: 4.20, lookY: 0.92, fov: 30 },  // Full body head-to-toe with breathing room
  far:   { camY: 0.95, camZ: 5.60, lookY: 0.92, fov: 30 },  // Distant, compact framing for dense content
};

// Horizontal side offsets (applied via camera.setViewOffset, keeping perspective natural)
export const SIDES = {
  center: 0,
  left: -1,
  right: 1,
};

export const POSES = {
  idle: {
    // Relaxed A-pose directions
    leftUpper: { x: 0.22, y: -1, z: 0.04 },
    leftFore:  { x: 0.10, y: -1, z: 0.20 },
    rightUpper: { x: -0.22, y: -1, z: 0.04 },
    rightFore:  { x: -0.10, y: -1, z: 0.20 },
  },
  present: {
    // Open palm gesturing toward the content
    upper: { x: 0.70, y: -0.50, z: 0.35 },
    fore:  { x: 0.55, y: 0.10, z: 0.80 },
  },
  think: {
    // Hand raised near chin, contemplative stance
    upper: { x: 0.35, y: 0.65, z: 0.45 },
    fore:  { x: 0.15, y: 0.85, z: 0.50 },
  },
  wave: {
    // Friendly wave gesture
    upper: { x: 0.85, y: 0.55, z: 0.05 },
    fore:  { x: 0.20, y: 1.00, z: 0.12 },
  },
};

export const EMOTES = {
  smile: {
    mouthSmileLeft: 0.6,
    mouthSmileRight: 0.6,
    cheekSquintLeft: 0.3,
    cheekSquintRight: 0.3,
    eyeSquintLeft: 0.15,
    eyeSquintRight: 0.15,
    browInnerUp: 0.15,
  },
  surprise: {
    browInnerUp: 0.8,
    browOuterUpLeft: 0.6,
    browOuterUpRight: 0.6,
    eyeWideLeft: 0.6,
    eyeWideRight: 0.6,
    jawOpen: 0.2,
  },
  think: {
    browDownLeft: 0.3,
    browOuterUpRight: 0.5,
    mouthLeft: 0.25,
  },
  focus: {
    browDownLeft: 0.35,
    browDownRight: 0.35,
    eyeSquintLeft: 0.2,
    eyeSquintRight: 0.2,
  },
};

export const TUNING = {
  modelHeight: 1.82,
  pointerDamping: 6.0,
  lookDistribute: {
    spine2: 0.20,
    neck: 0.30,
    head: 0.50,
  },
  eyeMaxRad: 0.35,
  maxNeckYaw: 0.65,
  maxNeckPitch: 0.38,
  blinkIntervalMin: 2.5,
  blinkIntervalMax: 5.5,
  blinkDuration: 0.12,
  breathFreq: 0.24,
  scrollLeanFactor: 0.00035,
  scrollFovKick: 2.0,
};
