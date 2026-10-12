"use client";

import React, { useId, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// ─── Component ──────────────────────────────────────────────────────────────

export function MorphText({
  words = ["CREATE", "DESIGN", "DEVELOP"],
  interval = 3000,
  subtext,
  fontSize = "clamp(3rem, 15vw, 10rem)",
  fontFamily = '"Space Grotesk", sans-serif',
  className,
  textClassName,
  subtextClassName,
}) {
  // Unique ID so multiple instances don't share filter IDs
  const uid = useId().replace(/:/g, "");
  const filterId = `morph-threshold-${uid}`;

  const [index, setIndex] = useState(0);
  const [isMorphing, setIsMorphing] = useState(false);

  const safeWords = Array.isArray(words) && words.length > 0 ? words : ["CREATE"];
  const currentWord = safeWords[index % safeWords.length];
  const nextWord = safeWords[(index + 1) % safeWords.length];

  useEffect(() => {
    if (safeWords.length <= 1) return;

    const timer = setTimeout(() => {
      setIsMorphing(true);

      const morphTimer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % safeWords.length);
        setIsMorphing(false);
      }, 700); // 700ms smooth cross-melt transition

      return () => clearTimeout(morphTimer);
    }, interval);

    return () => clearTimeout(timer);
  }, [index, interval, safeWords.length]);

  return (
    <div className={cn("morph-text-root relative flex flex-col items-center justify-center w-full", className)}>
      {/* ── Threshold SVG filter (hidden) ─────────────────────────── */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* ── Morphing word container ────────────────────────────────── */}
      <div
        className={cn("morph-text-container relative select-none w-full text-center flex items-center justify-center", textClassName)}
        style={{
          fontSize,
          fontWeight: 700,
          filter: `url(#${filterId})`,
          fontFamily,
          lineHeight: 1,
        }}
      >
        {/* Word morphing stage (only 2 slots: current and incoming) */}
        <div
          className="morph-word-rotator relative flex items-center justify-center w-full"
          style={{ height: "1.25em" }}
        >
          {/* Current Word (melts out during morph) */}
          <span
            key={`current-${currentWord}`}
            className="morph-word absolute tracking-tight"
            style={{
              top: "50%",
              left: "50%",
              transform: isMorphing
                ? "translate(-50%, -50%) scale(1.08)"
                : "translate(-50%, -50%) scale(1)",
              opacity: isMorphing ? 0 : 1,
              filter: isMorphing ? "blur(18px)" : "blur(0px)",
              transition: isMorphing
                ? "opacity 700ms ease-in-out, filter 700ms ease-in-out, transform 700ms ease-in-out"
                : "none",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {currentWord}
          </span>

          {/* Incoming Word (melts in during morph) */}
          <span
            key={`next-${nextWord}`}
            className="morph-word absolute tracking-tight"
            style={{
              top: "50%",
              left: "50%",
              transform: isMorphing
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.92)",
              opacity: isMorphing ? 1 : 0,
              filter: isMorphing ? "blur(0px)" : "blur(18px)",
              transition: isMorphing
                ? "opacity 700ms ease-in-out, filter 700ms ease-in-out, transform 700ms ease-in-out"
                : "none",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {nextWord}
          </span>
        </div>
      </div>

      {/* ── Optional subtext ──────────────────────────────────────── */}
      {subtext && (
        <p
          className={cn(
            "morph-subtext mt-6 uppercase tracking-[0.2em] text-[#888]",
            subtextClassName
          )}
          style={{
            fontSize: "1.1rem",
            opacity: 0,
            animation: "morph-fade-up 1s ease-out 0.5s forwards",
            fontFamily,
          }}
        >
          {subtext}
        </p>
      )}

      {/* ── Scoped keyframes ──────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap');

        @keyframes morph-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default MorphText;
