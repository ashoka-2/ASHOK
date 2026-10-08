import React, { useRef, useEffect } from 'react';
import { profile } from '../../data/profile';
import { initHeroAnimations } from './heroAnimations';

/**
 * HeroAvatar
 * New 3D Avatar Hero with a 300vh scroll runway and sticky viewport stage.
 * Three invisible scroll beats guide the cinematic camera pull-back:
 * - 0vh: Face Close-up
 * - 100vh: Bust Shot
 * - 200vh: Full Body Reveal with Present Pose
 */
export function HeroAvatar() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const metaRef = useRef(null);
  const scrollCueRef = useRef(null);

  useEffect(() => {
    const cleanup = initHeroAnimations({
      heroRef,
      titleRef,
      metaRef,
      scrollCueRef,
    });
    return cleanup;
  }, []);

  const [firstName, lastName] = profile.name.split(' ');

  return (
    <section id="hero" ref={heroRef} className="relative h-[300vh] w-full select-none">
      {/* 1. Sticky 100vh Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between px-4 sm:px-8 pt-20 sm:pt-24 pb-8 pointer-events-none">
        
        {/* Top Meta Header: Location & Status (z-[30]) */}
        <div className="relative w-full max-w-[1440px] mx-auto flex items-center justify-between z-[30] pointer-events-auto">
          <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest text-fg-muted uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>{profile.contact?.locationDisplay || 'KERALA, IN'}</span>
            <span className="text-fg-dim">•</span>
            <span className="text-fg-muted font-medium">3D INTERACTIVE AVATAR</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-widest text-fg-dim uppercase">
            <span>SCROLL TO EXPLORE</span>
            <span>↓</span>
          </div>
        </div>

        {/* 2. Giant Outlined Name Behind 3D Avatar (z-[5]) */}
        <div
          ref={titleRef}
          className="absolute top-[48%] left-0 right-0 -translate-y-1/2 w-full text-center pointer-events-auto z-[5] will-change-transform"
        >
          <h1 className="font-display font-black text-[13.5vw] sm:text-[14.2vw] leading-[0.82] tracking-[-0.04em] whitespace-nowrap select-none flex justify-center items-center gap-[0.22em] text-outline hover:text-fg transition-colors duration-300">
            {/* First Name */}
            <span className="inline-flex">
              {firstName.split('').map((char, i) => (
                <span key={`first-${i}`} className="hero-letter inline-block">
                  {char}
                </span>
              ))}
            </span>

            {/* Last Name */}
            <span className="inline-flex">
              {lastName.split('').map((char, i) => (
                <span key={`last-${i}`} className="hero-letter inline-block">
                  {char}
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle / Role Tagline from central data */}
          <div ref={metaRef} className="mt-4 sm:mt-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-bg-surface/30 backdrop-blur-md border border-line/40 text-xs sm:text-sm font-mono tracking-wider text-fg-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>{profile.roles}</span>
            </div>
          </div>
        </div>

        {/* Fallback 2D portrait visible only before 3D avatar loads or on weak devices */}
        <div className="port absolute left-1/2 bottom-0 -translate-x-1/2 w-full max-w-[520px] pointer-events-none z-[10] flex justify-center items-end">
          <img
            src="/assets/portrait/hero-portrait-main.png"
            alt={profile.name}
            className="w-auto max-h-[72vh] object-contain select-none"
          />
        </div>

        {/* 3. Bottom Minimal Scroll Cue & Availability (z-[30]) */}
        <div
          ref={scrollCueRef}
          className="relative w-full max-w-[1440px] mx-auto flex items-center justify-between z-[30] pointer-events-auto font-mono text-xs text-fg-muted tracking-wider"
        >
          {/* Availability Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="text-fg font-medium">AVAILABLE FOR SELECT OPPORTUNITIES</span>
            <span className="text-fg-dim hidden sm:inline">// 2026</span>
          </div>

          {/* Minimal Vertical Scroll Cue */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest text-fg-dim uppercase hidden sm:inline">
              PULL-BACK CAMERA
            </span>
            <div className="w-[1px] h-6 bg-line relative overflow-hidden">
              <div className="w-full h-1/2 bg-accent animate-[bounce_1.5s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroAvatar;
