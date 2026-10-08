import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCursorState, resetCursorState } from '../../store/uiSlice';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ProjectCard({ project, index, total = 8, layout = 'stack' }) {
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    dispatch(setCursorState({ mode: 'view', text: 'VIEW' }));
  };

  const handleMouseLeave = () => {
    dispatch(resetCursorState());
  };

  const hasLive = Boolean(project.links && project.links.live && project.links.live.length > 0);

  return (
    <Link
      to={`/projects/${project.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative block w-full rounded-[36px] sm:rounded-[40px] overflow-hidden border border-line bg-bg-elev transition-all duration-700 ease-out select-none",
        layout === 'stack' ? 'h-[64vh] sm:h-[72vh] min-h-[480px]' : 'h-[520px] sm:h-[600px] w-[320px] sm:w-[480px] flex-shrink-0'
      )}
      style={{
        '--a': project.accent,
      }}
    >
      {/* 1. Radiant Background Gradient (.cv) */}
      <div
        className="absolute inset-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: `radial-gradient(65% 75% at 95% 5%, color-mix(in srgb, ${project.accent} 65%, transparent), transparent 70%), radial-gradient(45% 55% at 5% 95%, color-mix(in srgb, ${project.accent} 22%, transparent), transparent 70%)`
        }}
      />

      {/* 2. Top Right Index Counter (.ix) */}
      <div className="absolute top-6 sm:top-8 right-6 sm:right-8 z-20 flex items-center gap-3">
        <span className="font-mono text-xs sm:text-sm tracking-widest text-fg-muted font-medium">
          {project.index}/{String(total).padStart(2, '0')}
        </span>

        {/* ONLY show live redirect icon if project is hosted */}
        {hasLive && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(project.links.live, '_blank', 'noopener,noreferrer');
            }}
            title={`Visit ${project.title} Live`}
            className="w-8 h-8 rounded-full border border-line bg-bg/60 backdrop-blur-md flex items-center justify-center text-accent hover:bg-accent hover:text-black transition-all z-30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Floating 3D Tilted Glass Card (.gl) */}
      <div className="absolute right-[6%] sm:right-[8%] bottom-[8%] sm:bottom-[10%] w-[min(46%,340px)] aspect-[4/5] rounded-[24px] sm:rounded-[28px] bg-bg/40 backdrop-blur-xl border border-line/80 p-4 sm:p-5 flex flex-col gap-2.5 rotate-[4deg] group-hover:rotate-0 group-hover:-translate-y-3 transition-transform duration-700 ease-out shadow-2xl pointer-events-none">
        <div className="h-2.5 rounded-full w-1/2" style={{ backgroundColor: project.accent, opacity: 0.9 }} />
        <div className="flex-1 rounded-[16px] overflow-hidden relative border border-line/40 my-1" style={{ backgroundColor: `color-mix(in srgb, ${project.accent} 18%, transparent)` }}>
          <img
            src={project.cover.dark}
            alt={project.title}
            className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="h-2 rounded-full w-3/4 bg-line/60" />
        <div className="h-2 rounded-full w-2/5 bg-line/40" />
      </div>

      {/* 4. Text Information Area (.tx) */}
      <div className="absolute left-6 sm:left-12 bottom-6 sm:bottom-12 right-[48%] sm:right-[46%] z-20 flex flex-col gap-3">
        {/* Category Tags */}
        <div className="flex flex-wrap gap-2">
          {project.category.slice(0, 2).map((c) => (
            <span
              key={c}
              className="px-3 py-1 rounded-full border border-line text-[11px] font-mono tracking-wider uppercase bg-bg/50 backdrop-blur-sm text-fg-muted"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-fg group-hover:text-accent transition-colors leading-[0.95]">
          {project.title}
        </h3>

        {/* Subtitle / One-Liner */}
        <p className="font-mono text-xs sm:text-sm text-fg-muted leading-relaxed line-clamp-2">
          {project.oneLiner}
        </p>
      </div>
    </Link>
  );
}
