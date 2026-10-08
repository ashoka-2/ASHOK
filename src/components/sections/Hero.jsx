import React, { useRef, useState, useEffect } from 'react';
import { HeroDepthScene } from '../three/HeroDepthScene';
import { profile } from '../../data/profile';
import { formatTimeIST } from '../../lib/utils';
import { gsap } from '../../lib/gsap';

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [timeStr, setTimeStr] = useState(formatTimeIST());
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const labelsRef = useRef(null);
  const portraitWrapRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(formatTimeIST());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance reveal
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.2 }
      );

      gsap.fromTo(
        portraitWrapRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.3 }
      );

      if (labelsRef.current) {
        gsap.fromTo(
          labelsRef.current.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.7, ease: 'power2.out' }
        );
      }

      // Parallax scroll scrubbing
      gsap.to(titleRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(portraitWrapRef.current, {
        y: 40,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[92vh] min-h-[640px] max-h-[1080px] w-full flex flex-col justify-end overflow-hidden px-6 select-none"
    >
      {/* Soft Aura Glow Behind Subject */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(75vw,680px)] aspect-square rounded-full bg-radial from-accent/25 via-accent-blue/15 to-transparent blur-[70px] pointer-events-none z-0" />

      {/* Thin Solvana-Style Crosshair Lines & Corner Brackets */}
      <div className="absolute inset-6 sm:inset-12 pointer-events-none border border-line/30 flex flex-col justify-between p-4 z-5">
        <div className="flex justify-between items-start text-fg-dim font-mono text-[9px] uppercase tracking-wider">
          <span>[ 001 // SEC_HERO ]</span>
          <span>LAT: 11.8745° N, LON: 75.3704° E</span>
        </div>
        <div className="flex justify-between items-end text-fg-dim font-mono text-[9px] uppercase tracking-wider">
          <span>IDENTITY: AK_CREATIVE_TECH</span>
          <span>SYS_STATUS: OPTIMAL</span>
        </div>
      </div>

      {/* Layer 1: Giant Display Name BEHIND Cutout Portrait */}
      <div
        ref={titleRef}
        className="absolute top-[46%] left-0 right-0 -translate-y-1/2 w-full text-center pointer-events-none z-10"
      >
        <h1 className="font-display font-black text-[13.5vw] sm:text-[14vw] leading-[0.82] tracking-[-0.04em] text-fg whitespace-nowrap opacity-90 select-none">
          ASHOK KUMAR
        </h1>
      </div>

      {/* Layer 2: Anchored Bottom Cutout Portrait (Strictly at bottom of hero) */}
      <div
        ref={portraitWrapRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-[min(94vw,760px)] h-[74vh] max-h-[820px] pointer-events-auto flex items-end justify-center cursor-pointer"
      >
        <HeroDepthScene isHovered={isHovered} />
      </div>

      {/* Layer 3: Minimal Edge Meta Labels */}
      <div
        ref={labelsRef}
        className="relative mb-6 w-full max-w-[1440px] mx-auto px-4 sm:px-12 flex items-center justify-between text-xs font-mono text-fg-muted tracking-wider z-30 pointer-events-none"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="hidden sm:inline">ROLE:</span>
          <span className="text-fg font-medium">SOFTWARE DEVELOPER & AI</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-fg-dim">
            <span>IST:</span>
            <span className="text-fg font-medium">{timeStr}</span>
          </div>
          <div className="flex items-center gap-2 text-fg-dim animate-bounce">
            <span>SCROLL</span>
            <span>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
