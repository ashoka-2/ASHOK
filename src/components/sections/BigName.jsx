import React, { useRef, useState } from "react";
import { profile } from "../../data/profile";
import { gsap } from "../../lib/gsap";

export function BigName() {
  const containerRef = useRef(null);
  const textDesktopRef = useRef(null);
  const textMobileRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Subtle letter wiggle
    const target = textDesktopRef.current;
    if (target) {
      gsap.to(target, {
        letterSpacing: "0.02em",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const target = textDesktopRef.current;
    if (target) {
      gsap.to(target, {
        letterSpacing: "-0.03em",
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      data-avatar-shot="full"
      data-avatar-side="center"
      data-avatar-pose="wave"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-8 sm:py-12 overflow-hidden select-none flex items-center justify-center border-t border-line/40 z-20"
    >
      <div className="w-full max-w-[1440px] px-4 text-center cursor-default">
        {/* Desktop Version: Full Name */}
        <div
          ref={textDesktopRef}
          className="hidden sm:block font-display font-black text-[13.5vw] leading-[0.8] tracking-[-0.03em] whitespace-nowrap text-outline uppercase transition-all duration-300"
          style={{
            backgroundImage: isHovered
              ? `radial-gradient(circle 240px at ${mousePos.x}% ${mousePos.y}%, var(--accent) 0%, transparent 85%)`
              : "none",
            WebkitBackgroundClip: isHovered ? "text" : "unset",
            WebkitTextFillColor: isHovered ? "transparent" : "transparent",
          }}
        >
          {profile.name}
        </div>

        {/* Mobile Version: Short Name */}
        <div
          ref={textMobileRef}
          className="block sm:hidden font-display font-black text-[25vw] leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-outline uppercase transition-all duration-300"
          style={{
            backgroundImage: `radial-gradient(circle 180px at 50% 50%, var(--accent) 0%, transparent 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {profile.shortName}
        </div>
      </div>
    </section>
  );
}
