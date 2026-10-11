import React, { Children, useCallback, useEffect, useId, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ------------------------------------------------------------------ */
/*  Melt config (SVG Liquid Gooey Blur)                                */
/* ------------------------------------------------------------------ */
const TEXT_BLUR = 0.3; // em, CSS blur on the text at full liquid
const SVG_BLUR = 15.5; // px, feGaussianBlur stdDeviation at full liquid
const ALPHA_MULT = 400; // feColorMatrix alpha multiplier at full liquid
const ALPHA_SHIFT = -117; // feColorMatrix alpha offset at full liquid
const REF_FONT_SIZE = 64; // px, desktop heading size SVG_BLUR was tuned at

const DEFAULT_HEADING_CLASS =
  'will-change-[filter] font-display font-medium text-[clamp(1.75rem,4.5vw,4.25rem)] leading-[1.1] tracking-[-0.03em] max-md:text-[clamp(1.5rem,6.8vw,2.5rem)] max-md:leading-[1.15] max-[480px]:text-[clamp(1.35rem,7.4vw,1.9rem)]';

/**
 * Multi-statement paragraphs that surface from a liquid blur as they scroll to center.
 */
export function ScrollTextReveal({
  children,
  statements,
  className = '',
  headingClassName = DEFAULT_HEADING_CLASS,
}) {
  const rootRef = useRef(null);
  const listRef = useRef([]);
  const setRef = useCallback((i, key) => (el) => {
    (listRef.current[i] ??= {
      section: null,
      heading: null,
      inner: null,
      blur: null,
      matrix: null,
    })[key] = el;
  }, []);

  const uid = useId().replace(/\W/g, '');
  const filterId = (i) => `goo-multi-${uid}-${i}`;

  const items = Children.count(children)
    ? Children.toArray(children)
    : (statements || []).map((text, i) => <p key={i}>{text}</p>);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      let blurScale = 1;
      const updateBlurScale = () => {
        const heading = listRef.current[0]?.heading;
        if (heading) {
          blurScale = parseFloat(window.getComputedStyle(heading).fontSize) / REF_FONT_SIZE;
        }
      };
      updateBlurScale();
      ScrollTrigger.addEventListener('refreshInit', updateBlurScale);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      listRef.current.forEach(({ section, heading, inner, blur, matrix }, i) => {
        if (!section || !heading || !inner || !blur || !matrix) return;
        let filterOn = false;

        const render = (t) => {
          const melt = 1 - t;
          if (t <= 0) {
            inner.style.visibility = 'hidden';
            inner.style.opacity = '0';
            inner.style.filter = `blur(${TEXT_BLUR}em)`;
          } else {
            inner.style.visibility = 'visible';
            inner.style.opacity = String(t);
            inner.style.filter = t >= 1 ? 'none' : `blur(${(TEXT_BLUR * melt).toFixed(3)}em)`;
          }

          if (t <= 0 || t >= 1) {
            if (filterOn) {
              heading.style.filter = 'none';
              filterOn = false;
            }
            return;
          }

          if (!filterOn) {
            heading.style.filter = `url(#${filterId(i)})`;
            filterOn = true;
          }

          const mult = 1 + (ALPHA_MULT - 1) * melt;
          blur.setAttribute('stdDeviation', (SVG_BLUR * blurScale * melt).toFixed(2));
          matrix.setAttribute(
            'values',
            `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${mult.toFixed(2)} ${(ALPHA_SHIFT * melt).toFixed(2)}`
          );
        };

        if (reduced) {
          render(1);
          return;
        }

        const state = { progress: 0 };
        gsap.to(state, {
          progress: 1,
          ease: 'none',
          onUpdate: () => render(state.progress),
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'center 45%',
            scrub: true,
          },
        });
        render(0);
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [items.length]);

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      {/* SVG Liquid Gooey Filters */}
      <svg className="absolute h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          {items.map((_, i) => (
            <filter key={i} id={filterId(i)} x="-20%" y="-100%" width="140%" height="300%">
              <feGaussianBlur
                ref={setRef(i, 'blur')}
                in="SourceGraphic"
                stdDeviation="0"
                result="blur"
              />
              <feColorMatrix
                ref={setRef(i, 'matrix')}
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
              />
            </filter>
          ))}
        </defs>
      </svg>

      {/* Melt Statements */}
      {items.map((item, i) => (
        <div key={i} ref={setRef(i, 'section')} className="relative w-full py-2">
          <div ref={setRef(i, 'heading')} className={headingClassName}>
            <div ref={setRef(i, 'inner')} className="will-change-[filter,opacity] [&>*]:m-0">
              {item}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Universal Gooey Text Reveal for ANY heading or text block across all pages.
 */
export function GooeyReveal({
  as: Component = 'div',
  children,
  className = '',
  triggerStart = 'top 85%',
  triggerEnd = 'center 50%',
}) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const blurRef = useRef(null);
  const matrixRef = useRef(null);

  const uid = useId().replace(/\W/g, '');
  const filterId = `goo-single-${uid}`;

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    const blur = blurRef.current;
    const matrix = matrixRef.current;
    if (!container || !inner || !blur || !matrix) return;

    const ctx = gsap.context(() => {
      let blurScale = 1;
      const updateScale = () => {
        const fs = parseFloat(window.getComputedStyle(container).fontSize) || 36;
        blurScale = Math.max(0.4, fs / REF_FONT_SIZE);
      };
      updateScale();
      ScrollTrigger.addEventListener('refreshInit', updateScale);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let filterOn = false;

      const render = (t) => {
        const melt = 1 - t;
        if (t <= 0) {
          inner.style.visibility = 'hidden';
          inner.style.opacity = '0';
          inner.style.filter = `blur(${TEXT_BLUR}em)`;
        } else {
          inner.style.visibility = 'visible';
          inner.style.opacity = String(t);
          inner.style.filter = t >= 1 ? 'none' : `blur(${(TEXT_BLUR * melt).toFixed(3)}em)`;
        }

        if (t <= 0 || t >= 1) {
          if (filterOn) {
            container.style.filter = 'none';
            filterOn = false;
          }
          return;
        }

        if (!filterOn) {
          container.style.filter = `url(#${filterId})`;
          filterOn = true;
        }

        const mult = 1 + (ALPHA_MULT - 1) * melt;
        blur.setAttribute('stdDeviation', (SVG_BLUR * blurScale * melt).toFixed(2));
        matrix.setAttribute(
          'values',
          `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${mult.toFixed(2)} ${(ALPHA_SHIFT * melt).toFixed(2)}`
        );
      };

      if (reduced) {
        render(1);
        return;
      }

      const state = { progress: 0 };
      gsap.to(state, {
        progress: 1,
        ease: 'none',
        onUpdate: () => render(state.progress),
        scrollTrigger: {
          trigger: container,
          start: triggerStart,
          end: triggerEnd,
          scrub: true,
        },
      });
      render(0);
    }, container);

    return () => {
      ctx.revert();
    };
  }, [triggerStart, triggerEnd, filterId]);

  return (
    <div className="relative w-full">
      <svg className="absolute h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-100%" width="140%" height="300%">
            <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="0" result="blur" />
            <feColorMatrix
              ref={matrixRef}
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <Component ref={containerRef} className={`will-change-[filter] ${className}`}>
        <div ref={innerRef} className="will-change-[filter,opacity]">
          {children}
        </div>
      </Component>
    </div>
  );
}

export default ScrollTextReveal;
