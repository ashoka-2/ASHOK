import React, { useRef } from 'react';
import { profile } from '../../data/profile';
import { SectionLabel } from '../ui/SectionLabel';
import { ScrollTextReveal } from '../effects/ScrollTextReveal';

export function Intro() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      data-avatar-shot="waist"
      data-avatar-side="right"
      data-avatar-pose="present"
      className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-24 sm:py-36 flex flex-col justify-center border-t border-line/40 select-none relative z-20"
    >
      <SectionLabel number="00" label="PHILOSOPHY & CRAFT" />

      {/* Large Statement with Liquid Gooey Reveal */}
      <div className="max-w-[1200px] mb-16">
        <ScrollTextReveal>
          <p className="text-fg font-display leading-[1.1] tracking-tight">
            {profile.statement}
          </p>
        </ScrollTextReveal>
      </div>

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

        <div>
          <span className="text-fg-dim block mb-1">STATUS</span>
          <span className="text-accent font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {profile.availability}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Intro;
