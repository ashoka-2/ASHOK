import { gsap, ScrollTrigger } from '../../lib/gsap';
import { SHOTS, SIDES } from './avatarConfig';

/**
 * buildDirector
 * Orchestrates ONE scrubbed GSAP timeline mapping document scroll to
 * the 3D avatar's camera shot, side position, facing rotation, and procedural poses.
 */
export function buildDirector(avatar) {
  if (!avatar) return () => {};

  let tl;

  const build = () => {
    if (tl) {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    }

    const vh = window.innerHeight;
    const total = Math.max(1, document.documentElement.scrollHeight - vh);
    const isMobile = window.innerWidth < 768;

    tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: () => `+=${total}`,
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    const stops = Array.from(document.querySelectorAll('[data-avatar-shot]'))
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          y: rect.top + window.scrollY,
          dataset: el.dataset,
        };
      })
      .sort((a, b) => a.y - b.y);

    if (stops.length === 0) return;

    stops.forEach(({ y, dataset }, i) => {
      const shotKey = dataset.avatarShot || 'full';
      const shot = SHOTS[shotKey] || SHOTS.full;
      const sideKey = dataset.avatarSide || 'center';
      const side = isMobile ? 0 : (SIDES[sideKey] ?? 0);
      const poseKey = dataset.avatarPose || 'idle';

      const pose = {
        idle: 0,
        present: 0,
        think: 0,
        wave: 0,
        [poseKey]: 1,
      };

      const endProgress = THREE_clamp(y / total, 0, 1);
      const startProgress = Math.max(0, endProgress - (0.85 * vh) / total);
      const duration = Math.max(0.01, endProgress - startProgress);

      if (i === 0) {
        // Initial state at top of page (hero close-up)
        gsap.set(avatar.rig, {
          ...shot,
          shiftX: side,
          rotY: 0,
        });
        gsap.set(avatar.rig.pose, pose);
      } else {
        tl.to(avatar.rig, {
          camY: shot.camY,
          camZ: shot.camZ,
          lookY: shot.lookY,
          fov: shot.fov,
          shiftX: side,
          rotY: side * -0.32,   // 3/4 turn towards the content side
          duration,
        }, startProgress);

        tl.to(avatar.rig.pose, {
          ...pose,
          duration,
        }, startProgress);
      }
    });

    // Ensure total duration matches 1
    tl.set({}, {}, 1);
  };

  build();

  // Rebuild on layout refresh and resize
  ScrollTrigger.addEventListener('refreshInit', build);

  // Initial refresh after microtask so DOM is ready
  const timer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  return () => {
    clearTimeout(timer);
    ScrollTrigger.removeEventListener('refreshInit', build);
    if (tl) {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    }
  };
}

function THREE_clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
