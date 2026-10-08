import React, { useEffect, useRef } from 'react';

/**
 * HeroAtmosphere
 * Ethereal floating cyber-motes & interactive particle field with soft constellation linkages
 * Reactive to cursor movement with fluid physics and theme-aware colors
 */
export function HeroAtmosphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };
    const numParticles = width < 640 ? 24 : 45;

    // Create particles with natural organic movement
    const particles = Array.from({ length: numParticles }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45 - 0.15, // slight natural upward drift
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.2,
      baseAlpha: Math.random() * 0.4 + 0.2,
      colorType: i % 3 === 0 ? 'accent' : (i % 3 === 1 ? 'blue' : 'dim'),
      pulse: Math.random() * Math.PI * 2,
    }));

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (mouse.prevX !== -9999) {
        mouse.speed = Math.hypot(currentX - mouse.prevX, currentY - mouse.prevY);
      }
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = currentX;
      mouse.y = currentY;
    };

    const handlePointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.speed = 0;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    let time = 0;

    const render = () => {
      if (isVisible) {
        time += 0.02;
        ctx.clearRect(0, 0, width, height);

        // Fetch live computed CSS accent colors
        const style = getComputedStyle(document.documentElement);
        const accentColor = style.getPropertyValue('--accent').trim() || '#00e67f';
        const accentBlue = style.getPropertyValue('--accent-blue').trim() || '#2D6BFF';
        const fgColor = style.getPropertyValue('--fg').trim() || '#F2F1EE';

        // Connect nearby particles with subtle ethereal micro-links
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 85) {
              const linkAlpha = (1 - dist / 85) * 0.18 * Math.min(p1.alpha, p2.alpha);
              ctx.strokeStyle = p1.colorType === 'accent' ? accentColor : accentBlue;
              ctx.globalAlpha = linkAlpha;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // Draw and update each particle
        particles.forEach((p) => {
          // Floating oscillation
          p.x += p.vx + Math.sin(time + p.pulse) * 0.2;
          p.y += p.vy;

          // Wrap edges smoothly
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          // Mouse proximity repulsion and excitation
          if (mouse.x !== -9999) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mDist = Math.hypot(mdx, mdy);
            const repelRadius = 120;

            if (mDist < repelRadius && mDist > 0) {
              const force = (1 - mDist / repelRadius) * 2.2;
              p.x += (mdx / mDist) * force;
              p.y += (mdy / mDist) * force;
              p.alpha = Math.min(0.9, p.baseAlpha + 0.4);
            } else {
              p.alpha += (p.baseAlpha - p.alpha) * 0.04;
            }
          }

          // Gentle breathing opacity
          const currentAlpha = p.alpha + Math.sin(time * 2 + p.pulse) * 0.1;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

          let fillCol = accentColor;
          if (p.colorType === 'blue') fillCol = accentBlue;
          else if (p.colorType === 'dim') fillCol = fgColor;

          ctx.fillStyle = fillCol;
          ctx.globalAlpha = Math.max(0.05, Math.min(0.9, currentAlpha));

          // Soft aura glow around particles
          ctx.shadowBlur = p.radius * 4;
          ctx.shadowColor = fillCol;
          ctx.fill();
          ctx.restore();
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-1"
      aria-hidden="true"
    />
  );
}

export default HeroAtmosphere;
