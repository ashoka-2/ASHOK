import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPreloaderDone } from '../../store/uiSlice';
import { gsap } from '../../lib/gsap';
import { stopLenis, startLenis } from '../../lib/lenis';

export function Preloader() {
  const dispatch = useDispatch();
  const preloaderDone = useSelector((state) => state.ui.preloaderDone);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    // If already completed in this session, skip
    if (preloaderDone) return;

    // Pause smooth scrolling during intro
    stopLenis();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

      const exitTl = gsap.timeline({
        onComplete: () => {
          dispatch(setPreloaderDone(true));
          startLenis();
        },
      });

      exitTl
        .to(progressObj, {
          value: 100,
          duration: 0.35,
          ease: 'power2.out',
          onUpdate: () => setProgress(Math.floor(progressObj.value)),
        })
        .to(textRef.current, {
          scale: 1.08,
          letterSpacing: '0.12em',
          duration: 0.35,
          ease: 'power3.out',
        })
        .to(containerRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 0.85,
          ease: 'power4.inOut',
        });
    };

    const handleAvatarProgress = (e) => {
      const ratio = typeof e.detail === 'number' ? e.detail : 1;
      const target = Math.min(100, Math.floor(ratio * 100));
      gsap.to(progressObj, {
        value: target,
        duration: 0.4,
        ease: 'power1.out',
        onUpdate: () => setProgress(Math.floor(progressObj.value)),
        onComplete: () => {
          if (target >= 100) {
            playExit();
          }
        },
      });
    };

    window.addEventListener('avatar:progress', handleAvatarProgress);

    // Fallback timer: ensure preloader finishes after at most 2.4s even if assets load instantly or offline
    const fallbackTimer = setTimeout(() => {
      playExit();
    }, 2400);

    return () => {
      window.removeEventListener('avatar:progress', handleAvatarProgress);
      clearTimeout(fallbackTimer);
    };
  }, [dispatch, preloaderDone]);

  if (preloaderDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99998] bg-bg flex flex-col items-center justify-center select-none"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Draw outline / glow name */}
        <div
          ref={textRef}
          className="text-4xl sm:text-6xl md:text-7xl font-bold font-display tracking-tight text-fg transition-all"
        >
          <span className="text-accent">A</span>SHOK
        </div>

        {/* 000 -> 100 Monospace counter */}
        <div
          ref={counterRef}
          className="flex items-center gap-3 font-mono text-xs sm:text-sm tracking-widest text-fg-muted"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>INITIALIZING</span>
          <span className="text-fg font-semibold">
            {progress.toString().padStart(3, '0')}%
          </span>
        </div>

        {/* Minimal progress line */}
        <div className="w-32 sm:w-48 h-[1px] bg-line overflow-hidden mt-2">
          <div
            className="h-full bg-accent transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
