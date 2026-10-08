import * as THREE from 'three';

/**
 * hitFace
 * Projects eye midpoint and lateral head radius into screen space to detect face clicks.
 */
function hitFace(avatar, x, y) {
  const B = avatar.bones;
  if (!B?.LeftEye || !B?.RightEye || !avatar.camera) return false;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  B.LeftEye.getWorldPosition(a);
  B.RightEye.getWorldPosition(b);
  c.addVectors(a, b).multiplyScalar(0.5);

  const right = new THREE.Vector3().setFromMatrixColumn(avatar.camera.matrixWorld, 0).multiplyScalar(0.11);
  const p = c.clone().project(avatar.camera);
  const q = c.clone().add(right).project(avatar.camera);
  const W = window.innerWidth;
  const H = window.innerHeight;
  const cx = (p.x * 0.5 + 0.5) * W;
  const cy = (-p.y * 0.5 + 0.5) * H;
  const r = Math.abs((q.x - p.x) * 0.5 * W) * 1.25;

  return Math.hypot(x - cx, y - cy) < r;
}

/**
 * hitAvatar
 * Projects key skeleton extremities to construct a 2D bounding box for body interactions.
 */
function hitAvatar(avatar, clientX, clientY) {
  if (!avatar.bones || !avatar.camera) return false;
  const B = avatar.bones;
  const pts = ['HeadTop_End', 'LeftHand', 'RightHand', 'LeftFoot', 'RightFoot', 'Hips']
    .map((name) => {
      if (!B[name]) return null;
      const v = new THREE.Vector3();
      B[name].getWorldPosition(v);
      v.project(avatar.camera);
      return [
        (v.x * 0.5 + 0.5) * window.innerWidth,
        (-v.y * 0.5 + 0.5) * window.innerHeight,
      ];
    })
    .filter(Boolean);

  if (pts.length < 3) return false;
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const px = (x1 - x0) * 0.08;
  const py = (y1 - y0) * 0.06;

  return clientX > x0 - px && clientX < x1 + px && clientY > y0 - py && clientY < y1 + py;
}

/**
 * initInteractions
 * Binds pointer tracking, face-click anger reaction, body-click wave gesture,
 * double-click wink, delegated content hover reactions, and theme changes.
 */
export function initInteractions(avatar) {
  if (!avatar || !avatar.canvas) return () => {};

  // 1. Pointer Tracking (NDC Coordinates)
  const handlePointerMove = (e) => {
    avatar.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    avatar.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    avatar.lastMoveTime = avatar.tNow;
  };
  window.addEventListener('pointermove', handlePointerMove, { passive: true });

  // 2. Click Handling: Face -> Angry, Body -> Wave, Double-Click -> Wink
  let lastClickTime = 0;

  const handlePointerDown = (e) => {
    if (e.target?.closest?.('a, button, input, textarea, select, [data-no-avatar]')) {
      return;
    }

    const now = performance.now();
    if (now - lastClickTime < 350) return; // Prevent double-triggering on rapid double click
    lastClickTime = now;

    if (hitFace(avatar, e.clientX, e.clientY)) {
      avatar.emote('angry', 2.2);
    } else if (hitAvatar(avatar, e.clientX, e.clientY)) {
      avatar.wave();
    }
  };

  const handleDblClick = (e) => {
    if (e.target.closest('a, button, input, textarea, select, [data-no-avatar]')) {
      return;
    }
    if (hitAvatar(avatar, e.clientX, e.clientY)) {
      avatar.emote('wink', 1.4);
    }
  };

  window.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('dblclick', handleDblClick);

  // 3. Global Custom Emote Event Listener
  const handleCustomEmote = (e) => {
    if (e.detail && e.detail.name) {
      avatar.emote(e.detail.name, e.detail.duration || 1.8);
    }
  };
  window.addEventListener('avatar:emote', handleCustomEmote);

  // 4. Delegated Hover Listeners for Interactive Content
  let lastHoverTime = 0;
  const handleDelegatedPointerOver = (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    const now = avatar.tNow;
    if (now - lastHoverTime < 0.6) return;

    const card = t.closest('.card, .project-card, [data-project-card]');
    const btn = t.closest('a.btn, .btn, button, a[href^="mailto"], .cta-button');
    const tile = t.closest('.tile, .lab-tile, [data-tile]');
    const chip = t.closest('.chip, [id^="tech-chip-"]');

    if (card) {
      lastHoverTime = now;
      avatar.emote('surprise', 1.3);
      avatar.lookAtElement(card, 1.6);
    } else if (btn) {
      lastHoverTime = now;
      avatar.emote('smile', 1.6);
      avatar.lookAtElement(btn, 1.2);
    } else if (tile) {
      lastHoverTime = now;
      avatar.emote('focus', 1.6);
      avatar.lookAtElement(tile, 1.4);
    } else if (chip) {
      lastHoverTime = now;
      avatar.emote('think', 1.2);
    }
  };

  document.addEventListener('mouseover', handleDelegatedPointerOver, { passive: true });

  // 5. Theme Observer
  const observer = new MutationObserver(() => {
    if (avatar.updateTheme) avatar.updateTheme(0.5);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  });

  // Cleanup
  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('dblclick', handleDblClick);
    window.removeEventListener('avatar:emote', handleCustomEmote);
    document.removeEventListener('mouseover', handleDelegatedPointerOver);
    observer.disconnect();
  };
}
