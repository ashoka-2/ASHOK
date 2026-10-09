import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { gsap } from "../../lib/gsap";
import { useIsTouch } from "../../hooks/useMediaQuery";

export function Cursor() {
  const isTouch = useIsTouch();
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorTextRef = useRef(null);

  const { cursorMode, cursorText } = useSelector((state) => state.ui);

  useEffect(() => {
    if (isTouch || typeof window === "undefined") return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    // Fast quickTo position setters
    const setDotX = gsap.quickTo(dot, "x", {
      duration: 0.1,
      ease: "power2.out",
    });
    const setDotY = gsap.quickTo(dot, "y", {
      duration: 0.1,
      ease: "power2.out",
    });
    const setRingX = gsap.quickTo(ring, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    const setRingY = gsap.quickTo(ring, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    const handleMouseMove = (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouch]);

  // Handle cursor mode animations
  useEffect(() => {
    if (isTouch || !cursorRingRef.current) return;
    const ring = cursorRingRef.current;

    switch (cursorMode) {
      case "view":
        gsap.to(ring, {
          scale: 3.2,
          backgroundColor: "rgba(57, 230, 0, 0.95)",
          borderColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
        break;
      case "drag":
        gsap.to(ring, {
          scale: 2.8,
          backgroundColor: "rgba(45, 107, 255, 0.9)",
          borderColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
        break;
      case "pointer":
        gsap.to(ring, {
          scale: 1.6,
          backgroundColor: "transparent",
          borderColor: "var(--accent)",
          duration: 0.25,
          ease: "power2.out",
        });
        break;
      case "text":
        gsap.to(ring, {
          scale: 0.5,
          opacity: 0.4,
          duration: 0.2,
        });
        break;
      default:
        gsap.to(ring, {
          scale: 1,
          opacity: 1,
          backgroundColor: "transparent",
          borderColor: "var(--line-strong)",
          duration: 0.3,
          ease: "power2.out",
        });
    }
  }, [cursorMode, isTouch]);

  if (isTouch) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Center pinpoint dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-accent pointer-events-none transition-opacity"
      />

      {/* Trailing interactive ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border border-line-strong flex items-center justify-center pointer-events-none transition-colors"
      >
        {cursorText && (
          <span
            ref={cursorTextRef}
            className="text-[9px] font-mono font-bold tracking-widest text-black uppercase"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
