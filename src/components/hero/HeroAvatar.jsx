import React, { useRef, useEffect } from "react";
import { profile } from "../../data/profile";
import { initHeroAnimations } from "./heroAnimations";
import { MorphText } from "../ui/morph-text";

const HERO_WORDS = [
  "ASHOK KUMAR",
  "FRONTEND DEVELOPER",
  "CREATIVE DEVELOPER",
  "BACKEND DEVELOPER",
  "FULL STACK DEVELOPER",
  "MERN STACK DEVELOPER",
  "SOFTWARE ENGINEER",
  "SOFTWARE DEVELOPER",
];

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

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-[300vh] w-full select-none"
    >
      {/* 1. Sticky 100vh Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between px-4 sm:px-8 pt-20 sm:pt-24 pb-8 pointer-events-none">
        {/* Top Meta Header: Location & Status (z-[30]) */}
        <div className="relative w-full max-w-[1440px] mx-auto flex items-center justify-between z-[30] pointer-events-auto">
          <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest text-fg-muted uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>{profile.contact?.locationDisplay || "KERALA, IN"}</span>
            <span className="text-fg-dim">•</span>
            <span className="text-fg-muted font-medium">
              3D INTERACTIVE AVATAR
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-widest text-fg-dim uppercase">
            <span>SCROLL TO EXPLORE</span>
            <span>↓</span>
          </div>
        </div>

        {/* 2. Giant Morphing Name & Roles Behind 3D Avatar (z-[5]) */}
        <div
          ref={titleRef}
          className="absolute top-[48%] left-0 right-0 -translate-y-1/2 w-full text-center pointer-events-auto z-[5] will-change-transform px-4"
        >
          <MorphText
            words={HERO_WORDS}
            interval={2600}
            subtext={profile.roles}
            fontSize="clamp(2.5rem, 8.8vw, 9rem)"
            textClassName="font-display font-black tracking-[-0.035em] text-fg uppercase"
            subtextClassName="font-mono text-xs sm:text-sm text-fg-muted tracking-widest"
          />
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
            <span className="text-fg font-medium">
              AVAILABLE FOR SELECT OPPORTUNITIES
            </span>
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
