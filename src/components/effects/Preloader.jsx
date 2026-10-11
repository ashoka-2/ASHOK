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
  const zoomWrapperRef = useRef(null);
  const letterHRef = useRef(null);
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

    const playExit = () => {
      if (isExiting) return;
      isExiting = true;

      // Calculate exact center of letter H relative to the zoom wrapper
      const hEl = letterHRef.current;
      const wrapEl = zoomWrapperRef.current;
      if (hEl && wrapEl) {
        const hRect = hEl.getBoundingClientRect();
        const wrapRect = wrapEl.getBoundingClientRect();
        const originX = ((hRect.left + hRect.width / 2 - wrapRect.left) / wrapRect.width) * 100;
        const originY = ((hRect.top + hRect.height / 2 - wrapRect.top) / wrapRect.height) * 100;

        gsap.set(wrapEl, {
          transformOrigin: `${originX.toFixed(2)}% ${originY.toFixed(2)}%`,
        });
      }

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
        // Ensure progress hits 100%
        .to(progressObj, {
          value: 100,
          duration: 0.25,
          ease: "power2.out",
          onUpdate: () => setProgress(Math.floor(progressObj.value)),
        })
        // Fade out numerical counter
        .to(counterRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.3,
          ease: "power2.in",
        })
        // Zoom in name massive through letter H
        .to(zoomWrapperRef.current, {
          scale: 52,
          duration: 1.15,
          ease: "power3.inOut",
        })
        // Smooth fade out of preloader container revealing home hero section behind the H
        .to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
            onComplete: () => {
              if (containerRef.current) {
                containerRef.current.style.display = "none";
                containerRef.current.style.pointerEvents = "none";
              }
            },
          },
          "-=0.6"
        );
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

    // Fallback timer: ensure preloader finishes after at most 2.4s even if assets load instantly or offline
    const fallbackTimer = setTimeout(() => {
      playExit();
    }, 2400);

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
      className="fixed inset-0 z-[99998] bg-bg flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <div
        ref={zoomWrapperRef}
        className="relative flex flex-col items-center justify-center will-change-transform"
      >
        {/* ASHOK Name with Real-Time Percentage Color Fill */}
        <div className="relative text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-black font-display tracking-tight leading-none flex items-center justify-center select-none">
          {/* Base Layer: Outlined Letters */}
          <div
            className="flex items-center text-transparent"
            style={{ WebkitTextStroke: "1.5px var(--fg-dim)" }}
          >
            <span>A</span>
            <span>S</span>
            <span ref={letterHRef} className="relative inline-block">
              H
            </span>
            <span>O</span>
            <span>K</span>
          </div>

          {/* Fill Layer: Colored with Accent that fills as Progress increases */}
          <div
            className="absolute inset-0 flex items-center text-accent pointer-events-none transition-all duration-75 ease-out"
            style={{
              clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
            }}
          >
            <span>A</span>
            <span>S</span>
            <span className="relative inline-block">H</span>
            <span>O</span>
            <span>K</span>
          </div>
        </div>

        {/* Counter and Telemetry Status Bar below the name */}
        <div
          ref={counterRef}
          className="mt-6 flex flex-col items-center gap-2 font-mono text-xs sm:text-sm tracking-widest text-fg-muted"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="text-fg-dim font-medium uppercase">INITIALIZING SYSTEM</span>
            <span className="text-accent font-bold">
              {progress.toString().padStart(3, "0")}%
            </span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-36 sm:w-52 h-[1.5px] rounded-full bg-line overflow-hidden">
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
