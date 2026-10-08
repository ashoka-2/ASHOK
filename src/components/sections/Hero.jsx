import React, { useRef, useState, useEffect } from "react";
import { HeroPortrait } from "../hero/HeroPortrait";
import { HeroOrbitBadge } from "../hero/HeroOrbitBadge";
import { HeroAtmosphere } from "../effects/HeroAtmosphere";
import { gsap } from "../../lib/gsap";

export function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const auraRef = useRef(null);

  // Subtitle cyber-decode scramble state
  const originalRole =
    "SOFTWARE DEVELOPER · AI ENGINEER · CREATIVE TECHNOLOGIST";
  const [scrambleRole, setScrambleRole] = useState(originalRole);
  const scrambleIntervalRef = useRef(null);

  const triggerScramble = () => {
    const chars = "!<>-_/[]{}=+*^?#01~ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let iteration = 0;
    clearInterval(scrambleIntervalRef.current);

    scrambleIntervalRef.current = setInterval(() => {
      setScrambleRole(
        originalRole
          .split("")
          .map((char, index) => {
            if (char === " " || char === "·") return char;
            if (index < iteration) return originalRole[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );

      if (iteration >= originalRole.length) {
        clearInterval(scrambleIntervalRef.current);
      }
      iteration += 2;
    }, 28);
  };

  // Parallax mouse movement across the hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const quickTitleX = gsap.quickTo(titleRef.current, "x", {
      duration: 0.9,
      ease: "power2.out",
    });
    const quickTitleY = gsap.quickTo(titleRef.current, "y", {
      duration: 0.9,
      ease: "power2.out",
    });
    const quickAuraX = gsap.quickTo(auraRef.current, "x", {
      duration: 1.2,
      ease: "power2.out",
    });
    const quickAuraY = gsap.quickTo(auraRef.current, "y", {
      duration: 1.2,
      ease: "power2.out",
    });

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // 3D parallax shifts
      quickTitleX(x * -24);
      quickTitleY(y * -16);
      quickAuraX(x * 50);
      quickAuraY(y * 40);
    };

    hero.addEventListener("mousemove", handleMouseMove);
    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      clearInterval(scrambleIntervalRef.current);
    };
  }, []);

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[660px] max-h-[1080px] w-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 pt-20 sm:pt-24 pb-6 select-none"
    >
      {/* 1. Ambient Dynamic Cyber-Mote Particle Canvas */}
      <HeroAtmosphere />

      {/* 2. Soft Atmospheric Reactive Plasma Glow */}
      <div
        ref={auraRef}
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(80vw,740px)] aspect-square rounded-full bg-radial from-accent/20 via-accent-blue/10 to-transparent blur-[85px] pointer-events-none z-0 will-change-transform"
      />

      {/* 3. Minimalist Architectural Solvana Crosshairs in 4 Corners (Clean, unobtrusive) */}
      <div className="absolute inset-4 sm:inset-6 pointer-events-none z-5">
        <span className="absolute top-2 left-2 font-mono text-[11px] text-fg-dim font-light select-none">
          +
        </span>
        <span className="absolute top-2 right-2 font-mono text-[11px] text-fg-dim font-light select-none">
          +
        </span>
        <span className="absolute bottom-2 left-2 font-mono text-[11px] text-fg-dim font-light select-none">
          +
        </span>
        <span className="absolute bottom-2 right-2 font-mono text-[11px] text-fg-dim font-light select-none">
          +
        </span>
      </div>

      {/* 4. Top Row: Rotating Circular SVG Orbit Badge (Signature element, unobtrusive) */}
      <div className="relative w-full max-w-[1440px] mx-auto flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-fg-muted uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>KERALA, INDIA</span>
          <span className="text-fg-dim">•</span>
          <span className="text-fg-muted">11.87° N, 75.37° E</span>
        </div>

        {/* The Cool Rotating Circular SVG Badge */}
        <HeroOrbitBadge size={105} className="hidden sm:inline-block" />
      </div>

      {/* 5. Giant Display Name "ASHOK KUMAR" — 100% PROMINENT, BOLD, AND ALWAYS VISIBLE */}
      <div
        ref={titleRef}
        className="absolute top-[47%] left-0 right-0 -translate-y-1/2 w-full text-center pointer-events-auto z-10 will-change-transform"
      >
        <h1 className="font-display font-black text-[13.5vw] sm:text-[14.2vw] leading-[0.82] tracking-[-0.04em] text-fg whitespace-nowrap select-none flex justify-center items-center gap-[0.22em] drop-shadow-sm">
          {/* ASHOK letters with individual elastic bounce */}
          <span className="inline-flex">
            {["A", "S", "H", "O", "K"].map((ch, idx) => (
              <span
                key={`first-${idx}`}
                className="inline-block transition-colors duration-200 hover:text-accent cursor-pointer select-none"
                onMouseEnter={(e) => {
                  gsap.fromTo(
                    e.currentTarget,
                    { rotate: idx % 2 === 0 ? -12 : 12, y: -18, scale: 1.14 },
                    {
                      rotate: 0,
                      y: 0,
                      scale: 1,
                      duration: 0.9,
                      ease: "elastic.out(1.2, 0.3)",
                    },
                  );
                }}
              >
                {ch}
              </span>
            ))}
          </span>

          {/* KUMAR letters with individual elastic bounce */}
          <span className="inline-flex">
            {["K", "U", "M", "A", "R"].map((ch, idx) => (
              <span
                key={`last-${idx}`}
                className="inline-block transition-colors duration-200 hover:text-accent cursor-pointer select-none"
                onMouseEnter={(e) => {
                  gsap.fromTo(
                    e.currentTarget,
                    { rotate: idx % 2 === 0 ? 12 : -12, y: -18, scale: 1.14 },
                    {
                      rotate: 0,
                      y: 0,
                      scale: 1,
                      duration: 0.9,
                      ease: "elastic.out(1.2, 0.3)",
                    },
                  );
                }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle with Cyber-Decode Scramble & Live SVG Equalizer Wave */}
        <div className="mt-3 sm:mt-5 flex items-center justify-center gap-3">
          <div
            onMouseEnter={triggerScramble}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-surface/40 backdrop-blur-md border border-line/50 text-xs sm:text-sm font-mono tracking-wider text-fg-muted hover:text-fg hover:border-accent/60 cursor-pointer transition-all duration-300 shadow-sm"
          >
            {/* Animated SVG Audio Waveform Bars */}
            <div className="flex items-end gap-[3px] h-3">
              <span className="w-[2px] bg-accent rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
              <span className="w-[2px] bg-accent rounded-full animate-[pulse_1.1s_ease-in-out_infinite] h-3" />
              <span className="w-[2px] bg-accent rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-1.5" />
              <span className="w-[2px] bg-accent rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2.5" />
            </div>

            <span>{scrambleRole}</span>
          </div>
        </div>
      </div>

      {/* 6. Cutout Portrait with Animated SVG Orbit Rings, Laser Scanline & 3D Tilt */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-end justify-center">
        <HeroPortrait />
      </div>

      {/* 7. Bottom Navigation & Action Bar */}
      <div className="relative w-full max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-fg-muted tracking-wider z-30 pointer-events-auto">
        {/* Left Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-fg font-medium">
            AVAILABLE FOR SELECT OPPORTUNITIES
          </span>
          <span className="text-fg-dim hidden sm:inline">// 2026</span>
        </div>

        {/* Right Action Pills */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollToProjects}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bg-surface/60 hover:bg-accent hover:text-accent-on border border-line hover:border-accent text-fg transition-all duration-300 font-mono text-[11px] shadow-sm cursor-pointer"
          >
            <span>SELECTED WORK</span>
            <span className="animate-bounce">↓</span>
          </button>

          <a
            href="mailto:choudharyashok1230@gmail.com"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-fg text-bg hover:bg-accent hover:text-accent-on transition-all duration-300 font-mono text-[11px] font-semibold shadow-sm cursor-pointer"
          >
            <span>GET IN TOUCH</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
