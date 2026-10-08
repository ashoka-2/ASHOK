import React, { useRef, useState, useEffect } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * HeroPortrait
 * High-definition cutout portrait of Ashok Kumar with:
 * - Animated cybernetic SVG orbit rings & holographic halo behind head
 * - Animated SVG laser scanline sweeping vertically
 * - 3D perspective mouse parallax tilt
 * - Localized cursor developer-morph mask on hover
 * - Interactive corner tech brackets
 */
export function HeroPortrait() {
  const containerRef = useRef(null);
  const portraitRef = useRef(null);
  const hoverLayerRef = useRef(null);
  const laserRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // GSAP quickTo setters for 3D parallax tilt
    const quickTiltX = gsap.quickTo(portraitRef.current, 'rotateX', { duration: 0.8, ease: 'power2.out' });
    const quickTiltY = gsap.quickTo(portraitRef.current, 'rotateY', { duration: 0.8, ease: 'power2.out' });
    const quickTranslateX = gsap.quickTo(portraitRef.current, 'x', { duration: 0.8, ease: 'power2.out' });

    const handlePointerMove = (e) => {
      // 1. Global 3D tilt across screen
      const globalX = (e.clientX / window.innerWidth - 0.5) * 2;
      const globalY = (e.clientY / window.innerHeight - 0.5) * 2;
      quickTiltY(globalX * 9);
      quickTiltX(-globalY * 7);
      quickTranslateX(globalX * 12);

      // 2. Localized cursor mask coordinates for developer-morph overlay
      if (hoverLayerRef.current) {
        const rect = container.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        hoverLayerRef.current.style.setProperty('--mx', `${localX}px`);
        hoverLayerRef.current.style.setProperty('--my', `${localY}px`);
      }
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
        {/* Layer A: High-Definition Primary Cutout Portrait */}
        <img
          src="/assets/portrait/hero-portrait-main.png"
          alt="Ashok Kumar"
          className="w-full h-full object-contain object-bottom pointer-events-none select-none transition-transform duration-300"
          style={{
            filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35))',
          }}
          draggable="false"
        />

        {/* Layer B: Digital Developer Morph Reveal (Centered at cursor coordinates on hover) */}
        <div
          ref={hoverLayerRef}
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            maskImage: 'radial-gradient(circle 160px at var(--mx, 50%) var(--my, 50%), #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle 160px at var(--mx, 50%) var(--my, 50%), #000 40%, transparent 100%)',
          }}
        >
          <img
            src="/assets/portrait/hero-portrait-hover.png"
            alt="Ashok Kumar Digital Morph"
            className="w-full h-full object-contain object-bottom pointer-events-none select-none"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(0, 230, 127, 0.45)) contrast(1.08) saturate(1.15)',
            }}
            draggable="false"
          />
        </div>

        {/* 3. Futuristic Animated SVG Laser Scanline */}
        <div
          ref={laserRef}
          className={`absolute left-0 right-0 pointer-events-none z-20 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-60'
          }`}
          style={{
            top: '25%',
            animation: 'heroLaserScan 3.6s ease-in-out infinite alternate',
          }}
        >
          <svg className="w-full h-4 overflow-visible" viewBox="0 0 400 16" preserveAspectRatio="none">
            <defs>
              <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
                <stop offset="20%" stopColor="var(--accent)" stopOpacity="0.4" />
                <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
                <stop offset="80%" stopColor="var(--accent-blue)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
              </linearGradient>
              <filter id="laserGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* The laser beam line */}
            <line x1="0" y1="8" x2="400" y2="8" stroke="url(#laserGrad)" strokeWidth="2" filter="url(#laserGlow)" />
            {/* Center target laser dot */}
            <circle cx="200" cy="8" r="3" fill="var(--accent)" filter="url(#laserGlow)" />
          </svg>
        </div>

        {/* 4. Sci-Fi Hologram Corner Target Brackets framing Ashok */}
        <div className={`absolute inset-4 pointer-events-none transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
        }`}>
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

      {/* Global CSS keyframes for the laser scanline */}
      <style>{`
        @keyframes heroLaserScan {
          0% { top: 18%; }
          100% { top: 78%; }
        }
      `}</style>
    </div>
  );
}

export default HeroPortrait;
