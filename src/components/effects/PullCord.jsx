import React, { useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { gsap } from '../../lib/gsap';

export function PullCord() {
  const { theme, toggleTheme } = useTheme();
  const [isPulling, setIsPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const ropeLength = 90; // base height in px
  const maxPull = 50;
  const startYRef = useRef(0);
  const currentPullRef = useRef(0);
  const cordRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const triggerThemeToggle = (originX, originY) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (navigator.vibrate) navigator.vibrate(20);

    const targetTheme = theme === 'dark' ? 'light' : 'dark';
    const targetBg = targetTheme === 'light' ? '#F2F1EE' : '#0A0A0B';
    const accentColor = targetTheme === 'light' ? 'rgba(30,158,0,0.4)' : 'rgba(57,230,0,0.6)';

    // Coordinate origin from the cord handle
    const rect = cordRef.current ? cordRef.current.getBoundingClientRect() : null;
    const x = originX || (rect ? rect.left + rect.width / 2 : window.innerWidth - 48);
    const y = originY || (rect ? rect.bottom : 110);

    // Create rock-solid blurred wave overlay
    const wipe = document.createElement('div');
    wipe.style.position = 'fixed';
    wipe.style.inset = '0';
    wipe.style.zIndex = '99998';
    wipe.style.pointerEvents = 'none';
    wipe.style.willChange = 'clip-path, opacity';
    wipe.style.background = `radial-gradient(circle at ${x}px ${y}px, ${accentColor} 0%, ${targetBg} 35%, ${targetBg} 100%)`;
    wipe.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    document.body.appendChild(wipe);

    // GSAP smoothly expands wave to cover 100% of the screen
    gsap.to(wipe, {
      clipPath: `circle(${Math.hypot(window.innerWidth, window.innerHeight) * 1.2}px at ${x}px ${y}px)`,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => {
        // Toggle theme while the entire viewport is 100% covered (ZERO BLINK, ZERO LAG)
        toggleTheme();

        // Fade out overlay cleanly to reveal new theme
        gsap.to(wipe, {
          opacity: 0,
          duration: 0.35,
          ease: 'power1.out',
          onComplete: () => {
            if (wipe.parentNode) wipe.parentNode.removeChild(wipe);
            isTransitioningRef.current = false;
          },
        });
      },
    });
  };

  const handlePointerDown = (e) => {
    setIsPulling(true);
    startYRef.current = e.clientY;
    currentPullRef.current = 0;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    const deltaY = Math.max(0, e.clientY - startYRef.current);
    const damped = Math.min(maxPull, deltaY * 0.7);
    currentPullRef.current = damped;
    setPullY(damped);
  };

  const handlePointerUp = (e) => {
    setIsPulling(false);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);

    const finalPull = currentPullRef.current;

    // Trigger ONLY ON RELEASE if user pulled past threshold
    if (finalPull >= 20) {
      triggerThemeToggle(e ? e.clientX : null, e ? e.clientY : null);
    }

    // Spring oscillation release
    gsap.to({ y: finalPull }, {
      y: 0,
      duration: 1.1,
      ease: 'elastic.out(1.2, 0.3)',
      onUpdate: function () {
        setPullY(this.targets()[0].y);
      },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Animate cord pull & release on keyboard action
      gsap.to({ y: 0 }, {
        y: maxPull,
        duration: 0.22,
        ease: 'power2.in',
        onUpdate: function () {
          setPullY(this.targets()[0].y);
        },
        onComplete: () => {
          triggerThemeToggle();
          gsap.to({ y: maxPull }, {
            y: 0,
            duration: 1.0,
            ease: 'elastic.out(1.2, 0.3)',
            onUpdate: function () {
              setPullY(this.targets()[0].y);
            },
          });
        },
      });
    }
  };

  const totalHeight = ropeLength + pullY;

  return (
    <div
      ref={cordRef}
      className="fixed top-0 right-8 sm:right-16 z-50 flex flex-col items-center select-none"
      style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
    >
      {/* Ceiling mount fixture */}
      <div className="w-3.5 h-2 bg-line-strong rounded-b-sm border-x border-b border-line" />

      {/* Rope (SVG curve) */}
      <svg
        width="20"
        height={totalHeight}
        className="overflow-visible pointer-events-none"
      >
        <line
          x1="10"
          y1="0"
          x2="10"
          y2={totalHeight}
          stroke="var(--fg-muted)"
          strokeWidth="1.5"
          strokeDasharray={isPulling ? 'none' : '3,2'}
        />
      </svg>

      {/* Pull Handle & Button */}
      <button
        aria-label="Toggle theme with pull cord"
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className="relative -mt-1 group cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full p-1"
        style={{ transform: `translateY(${pullY * 0.2}px)` }}
      >
        {/* Acorn / Pill handle */}
        <div className="w-4 h-7 rounded-full bg-bg-surface border border-line-strong shadow-md group-hover:border-accent group-hover:shadow-[0_0_12px_rgba(57,230,0,0.5)] transition-all flex items-center justify-center">
          <div className="w-1.5 h-3 rounded-full bg-accent/80 transition-colors group-hover:bg-accent" />
        </div>

        {/* Small tooltip hint */}
        <span className="absolute top-1/2 right-full mr-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-[10px] font-mono whitespace-nowrap text-fg-muted bg-bg-elev/90 border border-line px-2 py-0.5 rounded-full shadow-sm">
          PULL TO SWITCH
        </span>
      </button>
    </div>
  );
}

export default PullCord;
