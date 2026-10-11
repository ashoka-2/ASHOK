/**
 * Tactical Web Audio API SFX Engine
 * Zero external audio assets, zero loading latency, synthesized in real-time.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const getSoundEnabled = () => {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('sound_enabled');
  return saved !== null ? saved === 'true' : true;
};

export const setSoundEnabled = (enabled) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sound_enabled', String(enabled));
  window.dispatchEvent(new CustomEvent('sfx:state-change', { detail: enabled }));
};

export const toggleSound = () => {
  const next = !getSoundEnabled();
  setSoundEnabled(next);
  if (next) playClick();
  return next;
};

/**
 * Subtle Screen Click (Anywhere on screen)
 * Soft, elegant micro-tap for general canvas/screen interactions.
 */
export function playScreenClick() {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.03);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch (e) {}
}

/**
 * Tactile Button & Link Click
 * Crisper, brighter interactive feedback tone.
 */
export function playButtonClick() {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  } catch (e) {}
}

export const playClick = playButtonClick;

/**
 * Kinetic Swish / Whoosh for 3D Ring and Slides
 */
export function playWhoosh() {
  if (!getSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {}
}

/**
 * Attach global click sound listener (NO scroll sound)
 */
export function initGlobalSoundListeners() {
  if (typeof window === 'undefined') return () => {};

  const handleGlobalClick = (e) => {
    const target = e.target;
    const isInteractive =
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea') ||
      target.closest('[role="button"]') ||
      target.closest('[role="tab"]') ||
      target.closest('.cursor-pointer');

    if (isInteractive) {
      playButtonClick();
    } else {
      playScreenClick();
    }
  };

  window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });

  return () => {
    window.removeEventListener('click', handleGlobalClick, { capture: true });
  };
}
