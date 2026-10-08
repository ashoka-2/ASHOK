import React, { useRef, useState, useEffect } from 'react';
import { ParticlePortrait } from './ParticlePortrait';
import { gsap } from '../../lib/gsap';

/**
 * HeroPortrait
 * High-definition interactive particle portrait of Ashok Kumar with:
 * - Real RGB pixel sampling of Ashok's true head & facial features
 * - Interactive pointer swirl, repulsion, and click shockwave ripple
 * - Cybernetic SVG orbit rings & holographic halo behind head
 * - Sci-fi corner framing brackets
 * - Subtle 3D perspective mouse parallax tilt
 */
export function HeroPortrait() {
  const containerRef = useRef(null);
  const portraitRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // GSAP quickTo setters for subtle 3D parallax tilt
    const quickTiltX = gsap.quickTo(portraitRef.current, 'rotateX', { duration: 0.8, ease: 'power2.out' });
    const quickTiltY = gsap.quickTo(portraitRef.current, 'rotateY', { duration: 0.8, ease: 'power2.out' });
    const quickTranslateX = gsap.quickTo(portraitRef.current, 'x', { duration: 0.8, ease: 'power2.out' });

    const handlePointerMove = (e) => {
      const globalX = (e.clientX / window.innerWidth - 0.5) * 2;
      const globalY = (e.clientY / window.innerHeight - 0.5) * 2;
      quickTiltY(globalX * 6);
      quickTiltX(-globalY * 4);
      quickTranslateX(globalX * 8);
    };

    const handlePointerLeave = () => {
      quickTiltY(0);
      quickTiltX(0);
      quickTranslateX(0);
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-[min(94vw,720px)] h-[74vh] max-h-[820px] flex items-end justify-center select-none cursor-pointer"
      style={{ perspective: '1100px' }}
    >
      {/* 1. Animated Cybernetic SVG Orbit Rings & Hologram Halo (Behind Ashok's Head) */}
      <div className="absolute top-[16%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[440px] aspect-square pointer-events-none z-0">
        <svg
          className="w-full h-full animate-[spin_32s_linear_infinite] overflow-visible opacity-75"
          viewBox="0 0 300 300"
        >
          {/* Concentric dashed orbit circles */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
            className="opacity-40"
          />
          <circle
            cx="150"
            cy="150"
            r="115"
            fill="none"
            stroke="var(--accent-blue)"
            strokeWidth="0.8"
            strokeDasharray="3 6"
            className="opacity-50"
          />
          <circle
            cx="150"
            cy="150"
            r="85"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="1 5"
            className="opacity-60"
          />

          {/* Compass / Azimuth crosshair ticks */}
          <line x1="150" y1="2" x2="150" y2="16" stroke="var(--accent)" strokeWidth="2" />
          <line x1="150" y1="284" x2="150" y2="298" stroke="var(--accent)" strokeWidth="2" />
          <line x1="2" y1="150" x2="16" y2="150" stroke="var(--accent)" strokeWidth="2" />
          <line x1="284" y1="150" x2="298" y2="150" stroke="var(--accent)" strokeWidth="2" />

          {/* Orbital Satellite Nodes */}
          <circle cx="150" cy="10" r="3.5" fill="var(--accent)" />
          <circle cx="280" cy="150" r="2.5" fill="var(--accent-blue)" />
          <circle cx="65" cy="235" r="3" fill="var(--accent)" />
        </svg>

        {/* Counter-rotating inner reticle */}
        <svg
          className="absolute inset-[15%] w-[70%] h-[70%] animate-[spin_20s_linear_infinite_reverse] overflow-visible opacity-60"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="18 10"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="var(--fg)"
            strokeWidth="0.5"
            className="opacity-30"
          />
        </svg>

        {/* Central Luminous Aura Blur */}
        <div className="absolute inset-[20%] rounded-full bg-radial from-accent/30 via-accent-blue/15 to-transparent blur-[45px]" />
      </div>

      {/* 2. Portrait Container with 3D Parallax Tilt */}
      <div
        ref={portraitRef}
        className="relative w-full h-full flex items-end justify-center pointer-events-auto will-change-transform z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Layer A: Initial Main Portrait Fallback (fades out as particle engine takes over) */}
        {!isLoaded && (
          <img
            src="/assets/portrait/hero-portrait-main.png"
            alt="Ashok Kumar"
            className="w-full h-full object-contain object-bottom pointer-events-none select-none transition-opacity duration-500 opacity-100"
            style={{
              filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35))',
            }}
            draggable="false"
          />
        )}

        {/* Layer B: Interactive Particle Portrait Canvas */}
        <ParticlePortrait
          onLoaded={() => setIsLoaded(true)}
          className={`z-20 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* 3. Sci-Fi Hologram Corner Target Brackets framing Ashok */}
        <div
          className={`absolute inset-4 pointer-events-none transition-all duration-300 z-30 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
          }`}
        >
          {/* Top-Left Bracket */}
          <svg className="absolute top-2 left-2 w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 10V2h8" />
          </svg>
          {/* Top-Right Bracket */}
          <svg className="absolute top-2 right-2 w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10V2h-8" />
          </svg>
          {/* Bottom-Left Bracket */}
          <svg className="absolute bottom-6 left-2 w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 14v8h8" />
          </svg>
          {/* Bottom-Right Bracket */}
          <svg className="absolute bottom-6 right-2 w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 14v8h-8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default HeroPortrait;
