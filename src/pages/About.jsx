import React from "react";
import { PageShell } from "../components/layout/PageShell";
import { profile } from "../data/profile";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Button } from "../components/ui/Button";
import { ArrowUpRight, GraduationCap, MapPin, Sparkles } from "lucide-react";

export function About() {
  return (
    <PageShell>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-12 select-none">
        {/* Page Header */}
        <div className="mb-16">
          <SectionLabel number="04" label="BIOGRAPHY & CORE SYSTEM" />
          <h1 className="font-display text-4xl sm:text-7xl font-bold tracking-tight text-fg max-w-[950px] leading-[1.05]">
            Engineering software with creative vision and rigorous logic.
          </h1>
        </div>

        {/* Hero Portrait & High-Level Statement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-center">
          {/* Portrait Hologram Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-[460px] sm:h-[540px] rounded-[32px] overflow-hidden border border-line bg-bg-elev shadow-2xl">
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
              <img
                src="/assets/portrait/hero-portrait-main.png"
                alt={profile.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-[20px] bg-bg-surface/80 border border-line backdrop-blur-md flex items-center justify-between text-xs font-mono">
                <span className="text-fg font-medium">{profile.name}</span>
                <span className="text-accent">{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Statement & Bio */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="p-8 rounded-[28px] bg-bg-surface/40 border border-line">
              <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-4">
                STATEMENT OF PURPOSE
              </span>
              <p className="font-display text-2xl sm:text-3xl text-fg leading-relaxed">
                "{profile.statement}"
              </p>
            </div>

            {/* Philosophy Box */}
            <div className="p-8 rounded-[28px] bg-bg-elev border border-line">
              <span className="font-mono text-xs text-fg-dim uppercase tracking-widest block mb-3">
                PHILOSOPHICAL LOOP
              </span>
              <p className="font-mono text-sm sm:text-base text-accent font-semibold leading-relaxed tracking-wide">
                {profile.philosophy}
              </p>
            </div>

            {/* Quick Education & Location Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-5 rounded-[20px] bg-bg-surface border border-line flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-fg font-semibold block">
                    {profile.education.degree}
                  </span>
                  <span className="text-fg-muted block mt-1">
                    {profile.education.institution}
                  </span>
                  <span className="text-fg-dim block mt-0.5">
                    {profile.education.campus}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-[20px] bg-bg-surface border border-line flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-fg font-semibold block">
                    Based in {profile.location}
                  </span>
                  <span className="text-fg-muted block mt-1">
                    Available for global remote engagements
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Workflow Chain (IDEA -> DESIGN -> ...) */}
        <div className="py-20 border-t border-line">
          <SectionLabel number="01" label="ENGINEERING LIFECYCLE" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-fg mb-10">
            From inception to production.
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {profile.workflow.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="px-5 py-3 rounded-full bg-bg-surface border border-line text-xs font-mono font-semibold tracking-wider text-fg flex items-center gap-2 hover:border-accent hover:text-accent transition-colors">
                  <span className="text-accent">0{idx + 1}</span>
                  <span>{step}</span>
                </div>
                {idx < profile.workflow.length - 1 && (
                  <span className="text-accent font-bold text-lg select-none">
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Categorized Skills Grid */}
        <div className="py-20 border-t border-line">
          <SectionLabel number="02" label="TECHNICAL SPECTRUM" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-fg mb-12">
            Languages, frameworks & architectures.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(profile.skills).map(([category, list]) => (
              <div
                key={category}
                className="p-6 rounded-[24px] bg-bg-elev border border-line"
              >
                <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-4 font-semibold">
                  // {category.toUpperCase()}
                </span>
                <ul className="flex flex-col gap-2 font-mono text-xs text-fg-muted">
                  {list.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 hover:text-fg transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Open To Collaborations */}
        <div className="py-20 border-t border-line">
          <SectionLabel number="03" label="COLLABORATION OPPORTUNITIES" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-fg mb-10">
            Open to impact-driven challenges.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.openTo.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-[20px] bg-bg-surface/50 border border-line flex items-center justify-between text-sm font-display font-medium text-fg hover:border-accent hover:text-accent transition-all"
              >
                <span>{item}</span>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
            ))}
          </div>
        </div>

        {/* Identity Line Closer */}
        <div className="py-24 border-t border-line text-center">
          <p className="font-mono text-xs sm:text-sm text-fg-dim tracking-[0.2em] mb-4">
            CORE OPERATING PRINCIPLE
          </p>
          <div className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-accent">
            {profile.identityLine}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default About;
