import React, { useEffect, useRef } from 'react';

export function InteractiveTile({ id, title, subtitle, color = '#39E600' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = container.clientWidth;
    let height = container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -999, y: -999 };
    const state = {};

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // Initializer for specific canvas experiment
    let img;
    if (id === 'particle-portrait') {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/assets/portrait/hero-portrait-main.png';
      state.img = img;
      state.offscreen = document.createElement('canvas');
      state.offscreen.width = 110;
      state.offscreen.height = 90;
    }

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      if (id === 'particle-portrait') {
        // Particle portrait: samples Ashok's transparent portrait into particles
        if (!state.particles && state.img && state.img.complete && state.img.naturalWidth) {
          const offCtx = state.offscreen.getContext('2d');
          offCtx.drawImage(state.img, 0, 0, 110, 90);
          const imgData = offCtx.getImageData(0, 0, 110, 90).data;
          state.particles = [];

          const scale = Math.min(width / 110, height / 90) * 0.85;
          const offsetX = (width - 110 * scale) / 2;
          const offsetY = height * 0.08;

          for (let y = 0; y < 90; y += 2) {
            for (let x = 0; x < 110; x += 2) {
              const idx = (y * 110 + x) * 4;
              const alpha = imgData[idx + 3];
              if (alpha > 130) {
                state.particles.push({
                  homeX: offsetX + x * scale,
                  homeY: offsetY + y * scale,
                  x: Math.random() * width,
                  y: Math.random() * height,
                  vx: 0,
                  vy: 0,
                  color: `rgb(${imgData[idx]}, ${imgData[idx + 1]}, ${imgData[idx + 2]})`,
                });
              }
            }
          }
        }

        if (state.particles) {
          state.particles.forEach((p) => {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            // Proximity scatter
            if (dist < 75 && dist > 0) {
              p.vx += (dx / dist) * 2.8;
              p.vy += (dy / dist) * 2.8;
            }

            // Spring return to home position
            p.vx += (p.homeX - p.x) * 0.035;
            p.vy += (p.homeY - p.y) * 0.035;
            p.vx *= 0.86;
            p.vy *= 0.86;

            p.x += p.vx;
            p.y += p.vy;

            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 2.4, 2.4);
          });
        }
      } else if (id === 'node-field') {
        // Node Network: floating connected nodes attracted to cursor
        if (!state.nodes) {
          state.nodes = Array.from({ length: 36 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
          }));
        }

        state.nodes.forEach((a) => {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;

          const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dist < 130) {
            a.x += (mouse.x - a.x) * 0.025;
            a.y += (mouse.y - a.y) * 0.025;
          }
        });

        state.nodes.forEach((a, i) => {
          for (let j = i + 1; j < state.nodes.length; j++) {
            const b = state.nodes[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 95) {
              ctx.strokeStyle = color;
              ctx.globalAlpha = 1 - dist / 95;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(a.x, a.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (id === 'kinetic-type') {
        // Kinetic Interactive Typography
        const word = 'BUILD';
        const fontSize = Math.max(36, width / 3.8);
        ctx.font = `800 ${fontSize}px "Bricolage Grotesque", sans-serif`;
        ctx.textBaseline = 'middle';
        const totalW = ctx.measureText(word).width;
        let curX = (width - totalW) / 2;

        [...word].forEach((char, idx) => {
          const charW = ctx.measureText(char).width;
          const charCenterX = curX + charW / 2;
          const charCenterY = height * 0.45;
          const dist = Math.hypot(charCenterX - mouse.x, charCenterY - mouse.y);
          const k = Math.max(0, 1 - dist / 150);

          ctx.save();
          ctx.translate(charCenterX, charCenterY + Math.sin(time * 3 + idx) * 6 - k * 28);
          ctx.rotate(Math.sin(time * 2 + idx) * 0.05 + k * 0.35 * (mouse.x > charCenterX ? -1 : 1));
          ctx.scale(1 + k * 0.3, 1 + k * 0.3);
          ctx.textAlign = 'center';
          ctx.fillStyle = k > 0.05 ? color : 'var(--fg)';
          ctx.fillText(char, 0, 0);
          ctx.restore();

          curX += charW;
        });
      } else if (id === 'cursor-trail') {
        // Cursor Light Trails
        state.trail = state.trail || [];
        if (mouse.x > 0) {
          state.trail.push({ x: mouse.x, y: mouse.y, life: 1, hue: (time * 90) % 360 });
        }
        state.trail = state.trail.filter((p) => (p.life -= 0.02) > 0);

        state.trail.forEach((p) => {
          ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, ${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.life * 18, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (id === 'audio-waveform') {
        // Audio reactive dancing frequency peaks
        const bars = 24;
        const barW = (width - 60) / bars;
        ctx.fillStyle = color;
        for (let i = 0; i < bars; i++) {
          const x = 30 + i * barW;
          const distToMouse = Math.abs(x + barW / 2 - mouse.x);
          const boost = distToMouse < 90 ? (1 - distToMouse / 90) * 80 : 0;
          const h = 20 + Math.sin(time * 4 + i * 0.4) * 25 + Math.cos(time * 2 + i * 0.8) * 15 + boost;
          ctx.beginPath();
          ctx.roundRect(x, height * 0.5 - h / 2, barW - 4, h, 6);
          ctx.fill();
        }
      } else {
        // Matrix Cyber Stream
        state.drops = state.drops || Array.from({ length: 18 }, () => Math.random() * -100);
        ctx.fillStyle = color;
        ctx.font = '12px "JetBrains Mono", monospace';
        state.drops.forEach((y, i) => {
          const x = 20 + i * (width / 18);
          ctx.fillText(String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96)), x, y);
          state.drops[i] = y > height ? 0 : y + 3.5;
        });
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [id, color]);

  return (
    <div
      ref={containerRef}
      className="group relative h-[320px] rounded-[28px] overflow-hidden border border-line bg-bg-elev p-6 flex flex-col justify-between transition-all duration-500 hover:border-accent hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] cursor-crosshair select-none"
    >
      {/* Background canvas for live interaction */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Top info badge */}
      <div className="flex items-center justify-between text-xs font-mono text-fg-muted z-10 pointer-events-none">
        <span className="font-semibold" style={{ color }}>● LIVE PLAYGROUND</span>
        <span className="px-2.5 py-0.5 rounded-full bg-bg/80 border border-line backdrop-blur-sm">
          HOVER TO INTERACT
        </span>
      </div>

      {/* Bottom title & details */}
      <div className="z-10 pointer-events-none">
        <h3 className="font-display text-xl font-bold text-fg group-hover:text-accent transition-colors flex items-center justify-between">
          <span>{title}</span>
        </h3>
        <p className="text-xs text-fg-muted mt-1 font-mono tracking-wide">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default InteractiveTile;
