import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "../../lib/gsap";
import { scrollTo } from "../../lib/lenis";

export function PageTransition({ children }) {
  const location = useLocation();
  const progressBarRef = useRef(null);
  const pathRef = useRef(null);
  const badgeRef = useRef(null);
  const contentRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on first load (Preloader handles entry)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const path = pathRef.current;
    const badge = badgeRef.current;
    const bar = progressBarRef.current;
    const content = contentRef.current;
    if (!path || !content) return;

    // Fluid morph coordinates
    const p1 = "M 0 100 V 100 Q 50 100 100 100 V 100 z";
    const p2 = "M 0 0 V 100 Q 50 -35 100 100 V 0 z";
    const p3 = "M 0 0 V 100 Q 50 100 100 100 V 0 z";
    const p4 = "M 0 0 V 0 Q 50 -35 100 0 V 0 z";
    const p5 = "M 0 0 V 0 Q 50 0 100 0 V 0 z";

    const tl = gsap.timeline();

    // Reset paths & pointer events
    path.parentElement.style.pointerEvents = "auto";
    gsap.set(bar, { scaleX: 0, opacity: 1 });
    gsap.set(badge, { opacity: 0, scale: 0.9, y: 24 });
    gsap.set(path, { attr: { d: p1 } });

    // Step 1: Laser progress line
    tl.to(bar, { scaleX: 0.75, duration: 0.25, ease: "power2.out" }, 0)

      // Step 2: Liquid Wave Morph Upwards
      .to(path, { attr: { d: p2 }, duration: 0.35, ease: "power2.in" }, 0)
      .to(path, { attr: { d: p3 }, duration: 0.22, ease: "power2.out" })
      .to(
        badge,
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(1.5)" },
        "-=0.15",
      )

      // Step 3: Peak coverage -> Reset scroll position
      .call(() => {
        scrollTo(0, { immediate: true });
      })

      // Step 4: Wave exit & morph out to ceiling
      .to(bar, { scaleX: 1, duration: 0.2, ease: "power2.in" })
      .to(bar, { opacity: 0, duration: 0.15 })
      .to(
        badge,
        { opacity: 0, scale: 1.1, y: -20, duration: 0.25, ease: "power2.in" },
        "-=0.1",
      )
      .to(path, { attr: { d: p4 }, duration: 0.3, ease: "power2.in" }, "-=0.15")
      .to(path, { attr: { d: p5 }, duration: 0.25, ease: "power2.out" })

      // Step 5: Content reveal with 3D scale and blur-to-sharp morph
      .fromTo(
        content,
        { opacity: 0, y: 24, scale: 0.985, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            if (path.parentElement)
              path.parentElement.style.pointerEvents = "none";
          },
        },
        "-=0.35",
      );

    return () => {
      tl.kill();
    };
  }, [location.pathname]);

  return (
    <>
      {/* Top Laser Progress Line */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[99999] pointer-events-none origin-left shadow-[0_0_12px_var(--accent)]"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Liquid Morph Wave SVG Curtain */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-[99990]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          fill="var(--bg-elev)"
          d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
        />
      </svg>

      {/* Morph Center Identity Badge */}
      <div
        ref={badgeRef}
        aria-hidden="true"
        className="fixed inset-0 z-[99995] pointer-events-none flex flex-col items-center justify-center gap-3 opacity-0"
      >
        <div className="w-12 h-12 rounded-full border border-accent/60 bg-bg/85 backdrop-blur-md flex items-center justify-center shadow-[0_0_24px_var(--accent-soft)]">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
        </div>
        <span className="font-display font-black text-xl tracking-tight text-fg uppercase">
          ASHOK KUMAR
        </span>
        <span className="font-mono text-[10px] tracking-widest text-accent uppercase font-medium">
          // CREATIVE TECHNOLOGIST
        </span>
      </div>

      {/* Animated Route Content */}
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </>
  );
}

export default PageTransition;
