import React, { useRef } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * HeroOrbitBadge
 * Iconic rotating circular SVG text stamp from reference design:
 * "ASHOK KUMAR • DEVELOPER • CREATOR • "
 * Rotating on a dashed orbital circle with a glowing holographic core
 */
export function HeroOrbitBadge({ size = 110, className = '' }) {
  const badgeRef = useRef(null);

  const handleMouseEnter = () => {
    if (!badgeRef.current) return;
    gsap.to(badgeRef.current, { scale: 1.12, duration: 0.35, ease: 'back.out(2)' });
  };

  const handleMouseLeave = () => {
    if (!badgeRef.current) return;
    gsap.to(badgeRef.current, { scale: 1, duration: 0.5, ease: 'power2.out' });
  };

  const pathId = `orbit-path-${size}`;

  return (
    <div
      ref={badgeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block select-none cursor-pointer group ${className}`}
      style={{ width: size, height: size }}
      aria-label="Ashok Kumar • Developer • Creator"
    >
      {/* Rotating SVG Curved Text & Dashed Orbit Ring */}
      <svg
        className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite] group-hover:[animation-duration:8s] overflow-visible"
        viewBox="0 0 100 100"
      >
        <defs>
          <path
            id={pathId}
            d="M 50, 50 m -39, 0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0"
          />
        </defs>

        {/* Dashed outer orbit ring */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="2 3"
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        />

        {/* Curved circular rotating text */}
        <text
          className="font-mono text-[8px] uppercase tracking-[2.2px] fill-fg transition-colors group-hover:fill-accent"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            ASHOK KUMAR • DEVELOPER • CREATOR •
          </textPath>
        </text>
      </svg>

      {/* Holographic Glowing Center Core with Micro Avatar / Insignia */}
      <div className="absolute inset-[22%] rounded-full overflow-hidden border border-accent/40 bg-radial from-accent/20 via-bg-surface/80 to-bg-surface shadow-[0_0_18px_rgba(0,230,127,0.25)] flex items-center justify-center transition-transform group-hover:scale-105">
        <span className="font-display font-black text-xs text-accent tracking-tighter">
          AK
        </span>
      </div>
    </div>
  );
}

export default HeroOrbitBadge;
