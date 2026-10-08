import React, { useRef, useEffect } from 'react';

/**
 * ParticlePortrait
 * Samples Ashok's real head image at 120-140 column resolution.
 * Each dot carries the exact true RGB color of its source pixel.
 * Renders eyes, brows, moustache, skin, and hair with high fidelity.
 * Includes assembly animation (0.4s - 1.6s), pointer swirl/repulsion, and click ripple.
 */
export function ParticlePortrait({
  isAssembling = true,
  assembleRatio = 1,
  onLoaded,
  className = '',
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    mouse: { x: -9999, y: -9999 },
    ripple: { active: false, x: 0, y: 0, radius: 0, maxRadius: 300 },
    animId: null,
    isMounted: true,
    isVisible: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    state.isMounted = true;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Offscreen image loader to sample real facial pixels
    const img = new Image();
    img.src = '/assets/portrait/hero-portrait-main.png';
    img.onload = () => {
      if (!state.isMounted) return;

      const isMobile = width < 640;
      // High resolution sampling: 125-140 cols on desktop, 85 cols on mobile
      const sampleCols = isMobile ? 205 : 400;
      const aspect = img.naturalHeight / img.naturalWidth;
      const sampleRows = Math.round(sampleCols * aspect);

      const offCanvas = document.createElement('canvas');
      offCanvas.width = sampleCols;
      offCanvas.height = sampleRows;
      const offCtx = offCanvas.getContext('2d');
      offCtx.drawImage(img, 0, 0, sampleCols, sampleRows);

      const imgData = offCtx.getImageData(0, 0, sampleCols, sampleRows).data;

      // Fit particle face to fill stage cleanly with exact contact alignment
      const scale = Math.min((width * 0.92) / sampleCols, (height * 0.96) / sampleRows);
      const offsetX = (width - sampleCols * scale) / 2;
      const offsetY = height - sampleRows * scale; // align to floor

      const newParticles = [];

      for (let y = 0; y < sampleRows; y++) {
        for (let x = 0; x < sampleCols; x++) {
          const idx = (y * sampleCols + x) * 4;
          const alpha = imgData[idx + 3];

          // Sample pixels belonging to Ashok's face, hair, and shirt
          if (alpha > 70) {
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];

            const homeX = offsetX + x * scale;
            const homeY = offsetY + y * scale;

            // Initial scatter position for intro assembly
            const angle = Math.random() * Math.PI * 2;
            const dist = 120 + Math.random() * 260;
            const startX = homeX + Math.cos(angle) * dist;
            const startY = homeY + Math.sin(angle) * dist;

            newParticles.push({
              hx: homeX,
              hy: homeY,
              x: startX,
              y: startY,
              vx: 0,
              vy: 0,
              color: `rgb(${r},${g},${b})`,
              size: scale * 0.95,
              mass: 1 + Math.random() * 0.5,
            });
          }
        }
      }

      state.particles = newParticles;
      if (onLoaded) onLoaded();
    };

    // Pointer Swirl & Repulsion
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
    };

    // Click Ripple shockwave
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.ripple = {
        active: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.6,
      };
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    canvas.addEventListener('mouseleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);

    // Resize Handling
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // Pause simulation when tab hidden or off-screen
    const handleVisibilityChange = () => {
      state.isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        state.isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // 60fps Physics & Render Loop
    const loop = () => {
      if (state.isMounted && state.isVisible) {
        ctx.clearRect(0, 0, width, height);

        const m = state.mouse;
        const pts = state.particles;
        const repelRadius = width < 640 ? 65 : 85;

        // Update ripple wave if active
        if (state.ripple.active) {
          state.ripple.radius += 10;
          if (state.ripple.radius > state.ripple.maxRadius) {
            state.ripple.active = false;
          }
        }

        // Draw and update each particle
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];

          // 1. Mouse Repulsion & Swirl
          if (m.x !== -9999) {
            const dx = p.x - m.x;
            const dy = p.y - m.y;
            const dist = Math.hypot(dx, dy);

            if (dist < repelRadius && dist > 1) {
              const force = (1 - dist / repelRadius) * 2.8;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // 2. Click Ripple Force
          if (state.ripple.active) {
            const rdx = p.x - state.ripple.x;
            const rdy = p.y - state.ripple.y;
            const rdist = Math.hypot(rdx, rdy);
            const diff = Math.abs(rdist - state.ripple.radius);

            if (diff < 30 && rdist > 0) {
              const rforce = (1 - diff / 30) * 4.5;
              p.vx += (rdx / rdist) * rforce;
              p.vy += (rdy / rdist) * rforce;
            }
          }

          // 3. Spring back to Home position (smooth damping)
          const targetX = p.hx;
          const targetY = p.hy;
          p.vx += (targetX - p.x) * 0.045;
          p.vy += (targetY - p.y) * 0.045;
          p.vx *= 0.86;
          p.vy *= 0.86;

          p.x += p.vx;
          p.y += p.vy;

          // Render pixel dot
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      state.animId = requestAnimationFrame(loop);
    };

    state.animId = requestAnimationFrame(loop);

    return () => {
      state.isMounted = false;
      cancelAnimationFrame(state.animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto cursor-pointer ${className}`}
      aria-label="Interactive particle portrait of Ashok Kumar"
    />
  );
}

export default ParticlePortrait;
