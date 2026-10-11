import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPreloaderDone } from "../../store/uiSlice";
import { gsap } from "../../lib/gsap";
import { stopLenis, startLenis } from "../../lib/lenis";

export function Preloader() {
  const dispatch = useDispatch();
  const preloaderDone = useSelector((state) => state.ui.preloaderDone);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    // If already completed in this session, skip
    if (preloaderDone) return;

    // Pause smooth scrolling during intro
    stopLenis();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      dispatch(setPreloaderDone(true));
      startLenis();
      return;
    }

    let isExiting = false;
    const progressObj = { value: 0 };

    // Continuous rotation of the outer ring
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotation: 360,
        repeat: -1,
        ease: "none",
        duration: 8,
      });
    }

    const playExit = () => {
      if (isExiting) return;
      isExiting = true;

      const exitTl = gsap.timeline({
        onComplete: () => {
          dispatch(setPreloaderDone(true));
          startLenis();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("preloader:complete"));
          }
        },
      });

      exitTl
        .to(progressObj, {
          value: 100,
          duration: 0.35,
          ease: "power2.out",
          onUpdate: () => setProgress(Math.floor(progressObj.value)),
        })
        .to([textRef.current, ringRef.current], {
          scale: 1.1,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        })
        .to(containerRef.current, {
          opacity: 0,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 0.65,
          ease: "power3.inOut",
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
              containerRef.current.style.pointerEvents = "none";
            }
          },
        }, "-=0.2");
    };

    const handleAvatarProgress = (e) => {
      const ratio = typeof e.detail === "number" ? e.detail : 1;
      const target = Math.min(100, Math.floor(ratio * 100));
      gsap.to(progressObj, {
        value: target,
        duration: 0.35,
        ease: "power1.out",
        onUpdate: () => setProgress(Math.floor(progressObj.value)),
        onComplete: () => {
          if (target >= 100) {
            playExit();
          }
        },
      });
    };

    window.addEventListener("avatar:progress", handleAvatarProgress);

    // Fallback timer: ensure preloader finishes after at most 2.2s even if offline or instant
    const fallbackTimer = setTimeout(() => {
      playExit();
    }, 2200);

    return () => {
      window.removeEventListener("avatar:progress", handleAvatarProgress);
      clearTimeout(fallbackTimer);
    };
  }, [dispatch, preloaderDone]);

  if (preloaderDone) return null;

  return (
    <div
      id="preloader"
      ref={containerRef}
      className="fixed inset-0 z-[99998] bg-bg flex flex-col items-center justify-center select-none"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="relative flex flex-col items-center justify-center gap-6">
        {/* Kinetic Rotating Brand Ring */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          <svg
            ref={ringRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
          >
            <path
              id="preloaderRingPath"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              fill="none"
            />
            <text className="font-mono text-[9px] tracking-[0.25em] fill-fg-muted uppercase">
              <textPath href="#preloaderRingPath" startOffset="0%">
                ASHOK KUMAR • CREATIVE TECH • AI AGENTS •
              </textPath>
            </text>
          </svg>

          {/* Central Logo & Numerical Telemetry */}
          <div ref={textRef} className="flex flex-col items-center justify-center text-center">
            <span className="font-display font-black text-2xl sm:text-3xl text-fg tracking-tight">
              A<span className="text-accent">.</span>
            </span>
            <span className="font-mono text-xs font-semibold text-accent mt-0.5">
              {progress.toString().padStart(3, "0")}%
            </span>
          </div>
        </div>

        {/* Minimalist Status Bar */}
        <div ref={counterRef} className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-fg-dim">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>CALIBRATING ENVIRONMENT</span>
          </div>

          <div className="w-40 sm:w-52 h-[1.5px] rounded-full bg-line overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-100 ease-out shadow-[0_0_8px_var(--accent)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
