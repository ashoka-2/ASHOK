import React, { useRef, useEffect } from 'react';
import { profile } from '../../data/profile';
import { SectionLabel } from '../ui/SectionLabel';
import { Button } from '../ui/Button';
import { gsap } from '../../lib/gsap';
import { ArrowUpRight } from 'lucide-react';

export function Intro() {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);

  const statementWords = profile.statement.split(' ');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-by-word scroll-scrubbed reveal
      if (wordsRef.current.length > 0) {
        gsap.fromTo(
          wordsRef.current,
          { opacity: 0.15, y: 5 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'center 45%',
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-24 sm:py-36 flex flex-col justify-center border-t border-line/40 select-none"
    >
      <SectionLabel number="00" label="PHILOSOPHY & CRAFT" />

      {/* Large Statement with Scrubbed Word Opacity */}
      <h2 className="font-display font-medium text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-fg max-w-[1200px] mb-16">
        {statementWords.map((word, index) => (
          <span
            key={index}
            ref={(el) => (wordsRef.current[index] = el)}
            className="inline-block mr-[0.28em] transition-colors"
          >
            {word}
          </span>
        ))}
      </h2>

      {/* Meta Information Strip & About Action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-line text-xs font-mono">
        <div>
          <span className="text-fg-dim block mb-1">FOCUS</span>
          <span className="text-fg font-medium">Autonomous Agents & Creative Web</span>
        </div>

        <div>
          <span className="text-fg-dim block mb-1">EDUCATION</span>
          <span className="text-fg font-medium">{profile.education.degree}</span>
        </div>

        <div>
          <span className="text-fg-dim block mb-1">LOCATION</span>
          <span className="text-fg font-medium">{profile.location}</span>
        </div>

        <div className="flex sm:justify-end items-center">
          <Button to="/about" variant="secondary" size="sm" iconRight={<ArrowUpRight className="w-4 h-4" />}>
            Read Biography
          </Button>
        </div>
      </div>
    </section>
  );
}
