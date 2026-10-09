import React, { useState } from "react";
import { PageShell } from "../components/layout/PageShell";
import { labExperiments } from "../data/lab";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Button } from "../components/ui/Button";
import { InteractiveTile } from "../components/lab/InteractiveTile";
import { Play, Sparkles, X, Terminal } from "lucide-react";

export function Lab() {
  const [activeExperiment, setActiveExperiment] = useState(null);

  return (
    <PageShell>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-12 select-none">
        {/* Page Header */}
        <div className="mb-16">
          <SectionLabel number="03" label="EXPERIMENTAL LABORATORY" />
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-fg max-w-[900px]">
            Creative code, shaders & mechanics.
          </h1>
          <p className="font-mono text-xs sm:text-sm text-fg-muted mt-4 max-w-[650px] leading-relaxed">
            A sandbox of interactive prototypes exploring computational design,
            WebGL point clouds, physics engines, and generative vector
            mathematics.
          </p>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {labExperiments.map((exp, idx) => (
            <div
              key={exp.id}
              id={exp.id}
              className="group relative rounded-[28px] overflow-hidden border border-line bg-bg-elev p-8 flex flex-col justify-between transition-all duration-500 hover:border-accent hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Soft Corner Bloom */}
              <div
                className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl opacity-25 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: exp.accent }}
              />

              {/* Header Info */}
              <div className="flex items-center justify-between mb-8 z-10">
                <span className="font-mono text-xs text-accent font-semibold tracking-widest">
                  EXP // 0{idx + 1}
                </span>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-bg/80 border border-line text-fg-muted">
                  {exp.category}
                </span>
              </div>

              {/* Canvas Interactive Preview */}
              <div className="relative h-[240px] rounded-[20px] overflow-hidden border border-line my-6 z-10">
                <InteractiveTile
                  id={exp.id}
                  title={exp.title}
                  subtitle={exp.category}
                  color={exp.accent}
                />
              </div>

              {/* Title & Description */}
              <div className="z-10">
                <h3 className="font-display text-2xl font-bold text-fg group-hover:text-accent transition-colors">
                  {exp.title}
                </h3>
                <p className="text-xs sm:text-sm text-fg-muted mt-2 leading-relaxed">
                  {exp.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line/60">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full font-mono text-[11px] bg-bg/60 border border-line text-fg-dim"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal Stage */}
      {activeExperiment && (
        <div className="fixed inset-0 z-50 bg-bg/90 backdrop-blur-2xl flex items-center justify-center p-6 select-none">
          <div className="relative w-full max-w-[900px] h-[640px] rounded-[32px] bg-bg-elev border border-line shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-line">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="font-display font-bold text-fg">
                  {activeExperiment.title}
                </span>
                <span className="font-mono text-xs text-fg-dim hidden sm:inline">
                  // {activeExperiment.category}
                </span>
              </div>
              <button
                onClick={() => setActiveExperiment(null)}
                className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-fg hover:border-accent hover:text-accent transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Sandbox Area */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-8 bg-bg-surface/40">
              <div className="text-center max-w-[500px]">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: `${activeExperiment.accent}20` }}
                >
                  <Sparkles
                    className="w-10 h-10"
                    style={{ color: activeExperiment.accent }}
                  />
                </div>
                <h4 className="font-display text-2xl font-bold text-fg mb-3">
                  {activeExperiment.title} Active
                </h4>
                <p className="text-sm font-mono text-fg-muted mb-6">
                  {activeExperiment.description}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-bg font-mono text-xs text-accent">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  REAL-TIME SIMULATION RUNNING
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default Lab;
