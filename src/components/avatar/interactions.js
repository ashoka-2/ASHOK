import * as THREE from 'three';
import { getLenis } from '../../lib/lenis';

/**
 * initInteractions
 * Binds cursor tracking, click-to-wave raycasting, hover emotes,
 * scroll velocity tracking, and theme switching to the AvatarScene.
 */
export function initInteractions(avatar) {
  if (!avatar || !avatar.canvas) return () => {};

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  // 1. Pointer Tracking (NDC Coordinates)
  const handlePointerMove = (e) => {
    avatar.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    avatar.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    avatar.lastPointerTime = performance.now();
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });

  // 2. Click-to-Wave (Raycast through canvas onto avatar mesh)
  const handlePointerDown = (e) => {
    // Never hijack clicks on UI buttons, links, or form controls
    if (e.target.closest('a, button, input, textarea, select, [data-no-avatar]')) {
      return;
    }

    if (!avatar.root || !avatar.camera) return;

    ndc.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(ndc, avatar.camera);
    const intersects = raycaster.intersectObject(avatar.root, true);

    if (intersects.length > 0) {
      avatar.wave();
    }
  };

  window.addEventListener('pointerdown', handlePointerDown);

  // 3. Global Custom Emote Event Listener
  const handleCustomEmote = (e) => {
    if (e.detail && e.detail.name) {
      avatar.emote(e.detail.name, e.detail.duration || 1.8);
    }
  };
  window.addEventListener('avatar:emote', handleCustomEmote);

  // 4. Hover Listeners for Interactive Content
  const handleDelegatedPointerOver = (e) => {
    // Primary CTAs trigger a warm smile
    if (e.target.closest('button, a[href^="mailto"], .cta-button')) {
      avatar.emote('smile', 1.8);
    }
    // Project cards / Lab items trigger focus or curiosity
    else if (e.target.closest('.project-card, [data-project-card], .lab-tile')) {
      avatar.emote('focus', 1.6);
    }
  };

  document.addEventListener('pointerover', handleDelegatedPointerOver, { passive: true });

  // 5. Scroll Velocity Monitoring via Lenis
  let velVelocityRafId;
  const updateScrollVelocity = () => {
    const lenis = getLenis();
    if (lenis && typeof lenis.velocity === 'number') {
      // Smooth scroll velocity tracking
      avatar.scrollVel += (lenis.velocity - avatar.scrollVel) * 0.15;
    } else {
      avatar.scrollVel *= 0.85;
    }
    velVelocityRafId = requestAnimationFrame(updateScrollVelocity);
  };
  velVelocityRafId = requestAnimationFrame(updateScrollVelocity);

  // 6. Theme Observer (Dark vs Light theme syncing)
  const observer = new MutationObserver(() => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    avatar.setTheme(isDark);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  });

  // 7. Device Orientation (Gyro tilt for mobile)
  const handleOrientation = (e) => {
    if (e.gamma !== null && e.beta !== null) {
      // Clamp tilt to gentle range
      avatar.pointer.x = THREE.MathUtils.clamp(e.gamma / 35, -1, 1);
      avatar.pointer.y = THREE.MathUtils.clamp((e.beta - 45) / 35, -1, 1);
      avatar.lastPointerTime = performance.now();
    }
  };

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
  }

  // Cleanup
  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('avatar:emote', handleCustomEmote);
    document.removeEventListener('pointerover', handleDelegatedPointerOver);
    cancelAnimationFrame(velVelocityRafId);
    observer.disconnect();
    if (window.DeviceOrientationEvent) {
      window.removeEventListener('deviceorientation', handleOrientation);
    }
  };
}
