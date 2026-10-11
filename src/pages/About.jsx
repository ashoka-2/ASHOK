import React from "react";
import { PageShell } from "../components/layout/PageShell";
import { profile } from "../data/profile";
import { SectionLabel } from "../components/ui/SectionLabel";
import { GooeyReveal } from "../components/effects/ScrollTextReveal";
import { GraduationCap, MapPin, Sparkles, ChevronRight, Terminal, Layers, Cpu, Globe } from "lucide-react";

export function About() {
  return (
    <PageShell>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-12 select-none">
        {/* Page Header */}
        <div className="mb-14">
          <SectionLabel number="01" label="BIOGRAPHY & CORE PROFILE" />
          <GooeyReveal as="h1" className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-fg max-w-[950px] leading-[1.05]">
            Engineering software with creative vision and rigorous logic.
          </GooeyReveal>
          <GooeyReveal as="p" className="font-sans text-sm sm:text-base text-fg-muted mt-4 max-w-[620px] leading-relaxed">
            Turning frontier AI models, cloud infrastructures, and high-performance frontends into calm, production-ready digital realities.
          </GooeyReveal>
        </div>

        {/* Hero Portrait & High-Level Statement Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-start">
          {/* Portrait Hologram Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-[440px] sm:h-[500px] rounded-[28px] overflow-hidden border border-line bg-bg-elev shadow-2xl">
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
              <img
                src="/assets/portrait/hero-portrait-main.png"
                alt={profile.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-[20px] bg-bg-surface/85 border border-line backdrop-blur-md flex items-center justify-between text-xs font-mono">
                <span className="text-fg font-medium">{profile.name}</span>
                <span className="text-accent flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {profile.location}
                </span>
              </div>
            </div>
          </div>

          {/* Statement & Minimal AI Grouped Rows */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Statement of Purpose */}
            <div className="p-7 sm:p-8 rounded-[28px] bg-bg-surface/60 border border-line">
              <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-3 font-semibold">
                STATEMENT OF PURPOSE
              </span>
              <GooeyReveal as="p" className="font-display text-2xl sm:text-3xl text-fg leading-relaxed">
                "{profile.statement}"
              </GooeyReveal>
            </div>

            {/* Philosophy Box */}
            <div className="p-6 sm:p-7 rounded-[28px] bg-bg-elev border border-line flex flex-col gap-2">
              <span className="font-mono text-xs text-fg-dim uppercase tracking-widest block font-medium">
                PHILOSOPHICAL CYCLE
              </span>
              <p className="font-mono text-xs sm:text-sm text-accent font-semibold leading-relaxed tracking-wide">
                {profile.philosophy}
              </p>
            </div>

            {/* Grouped Information Rows (Minimal-AI Pattern: 56dp tall, 2dp gap) */}
            <div className="grouped-list">
              <div className="grouped-row">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-bg-surface-raised flex items-center justify-center text-accent">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-fg block">{profile.education.degree}</span>
                    <span className="text-xs font-mono text-fg-muted block">{profile.education.institution}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-fg-dim hidden sm:inline-block">Kannur, Kerala</span>
              </div>

              <div className="grouped-row">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-bg-surface-raised flex items-center justify-center text-accent">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-fg block">Location &amp; Remote</span>
                    <span className="text-xs font-mono text-fg-muted block">Kerala, India (IST Clock)</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-accent font-medium">Global Collabs</span>
              </div>

              <div className="grouped-row">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-bg-surface-raised flex items-center justify-center text-accent">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-fg block">Communication</span>
                    <span className="text-xs font-mono text-fg-muted block">{profile.contact.email}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-fg-dim" />
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Lifecycle Chain (IDEA -> DESIGN -> ...) */}
        <div className="py-16 border-t border-line">
          <SectionLabel number="02" label="ENGINEERING LIFECYCLE" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-fg mb-8">
            From inception to production.
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            {profile.workflow.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="px-4 py-2.5 rounded-full bg-bg-surface border border-line text-xs font-mono font-semibold tracking-wider text-fg flex items-center gap-2 hover:border-accent hover:text-accent transition-colors">
                  <span className="text-accent">0{idx + 1}</span>
                  <span>{step}</span>
                </div>
                {idx < profile.workflow.length - 1 && (
                  <span className="text-fg-dim text-xs select-none">
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Categorized Skills as Minimal AI-App Grouped Rows */}
        <div className="py-16 border-t border-line">
          <SectionLabel number="03" label="TECHNICAL SPECTRUM & STACK" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-fg mb-10">
            Languages, frameworks &amp; architectures.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(profile.skills).map(([category, list]) => (
              <div
                key={category}
                className="p-6 rounded-[24px] bg-bg-elev border border-line flex flex-col gap-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <span className="font-mono text-xs text-accent uppercase tracking-wider font-semibold">
                    {category}
                  </span>
                  <span className="font-mono text-[11px] text-fg-dim">
                    {list.length} TECHNOLOGIES
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {list.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-full text-xs font-mono bg-bg-surface border border-line text-fg hover:border-accent hover:text-accent transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Opportunities */}
        <div className="py-16 border-t border-line">
          <SectionLabel number="04" label="COLLABORATION OPPORTUNITIES" />
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-fg mb-8">
            Open to impact-driven challenges.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {profile.openTo.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-[20px] bg-bg-surface/50 border border-line flex items-center justify-between text-sm font-display font-medium text-fg hover:border-accent hover:text-accent transition-all"
              >
                <span>{item}</span>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
            ))}
          </div>
        </div>

        {/* Identity Line Closer */}
        <div className="py-20 border-t border-line text-center">
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
