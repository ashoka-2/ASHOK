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
        "group relative block w-full rounded-[28px] sm:rounded-[36px] overflow-hidden border border-line bg-bg-elev transition-all duration-700 ease-out select-none",
        layout === 'stack' ? 'h-[64vh] sm:h-[72vh] min-h-[480px] sm:min-h-[520px]' : 'h-[520px] sm:h-[600px] w-[320px] sm:w-[480px] flex-shrink-0'
      )}
      style={{
        '--a': project.accent,
      }}
    >
      {/* 1. Desktop Project Image in Background (Low Opacity + Grain + Blend) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={project.desktopImage || project.cover.dark}
          alt={`${project.title} Desktop`}
          className="w-full h-full object-cover object-top opacity-20 sm:opacity-25 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-30 transition-all duration-1000 ease-out"
          loading="lazy"
        />
        {/* Subtle grain texture overlay specifically over the desktop background */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        {/* Directional gradient veil ensuring text readability while preserving atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-elev/95 via-bg-elev/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-elev via-bg-elev/60 to-transparent pointer-events-none" />
      </div>

      {/* 2. Soft Ambient Per-Project Glow (Retains Accent Color Identity) */}
      <div
        className="absolute inset-0 opacity-60 group-hover:opacity-85 transition-opacity duration-700 ease-out pointer-events-none"
        style={{
          background: `radial-gradient(55% 65% at 95% 10%, color-mix(in srgb, ${project.accent} 40%, transparent), transparent 70%), radial-gradient(40% 50% at 5% 95%, color-mix(in srgb, ${project.accent} 15%, transparent), transparent 70%)`
        }}
      />

      {/* 3. Top Header Bar: Category Badges & Live Status */}
      <div className="absolute top-6 sm:top-8 left-6 sm:left-10 right-6 sm:right-10 z-20 flex items-center justify-between pointer-events-none">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {project.category.slice(0, 2).map((c) => (
            <span
              key={c}
              className="px-3 py-1 rounded-full border border-line text-[11px] font-mono tracking-wider uppercase bg-bg-surface/85 backdrop-blur-md text-fg-muted font-medium"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Top Right: Index Counter & External Link */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="font-mono text-xs sm:text-sm tracking-widest text-fg-muted font-semibold">
            {project.index}/{String(total).padStart(2, '0')}
          </span>

          {hasLive && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(project.links.live, '_blank', 'noopener,noreferrer');
              }}
              title={`Visit ${project.title} Live`}
              className="w-8 h-8 rounded-full border border-line bg-bg-surface/90 backdrop-blur-md flex items-center justify-center text-accent hover:bg-accent hover:text-black transition-all z-30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Floating Mobile Frame on the Right (Showcasing the Mobile Screenshot) */}
      <div className="absolute right-[5%] sm:right-[7%] bottom-[6%] sm:bottom-[8%] w-[150px] xs:w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px] aspect-[9/16] rounded-[22px] sm:rounded-[28px] bg-bg-surface/85 backdrop-blur-xl border border-line/80 p-2 sm:p-3 flex flex-col rotate-[3deg] group-hover:rotate-0 group-hover:-translate-y-2 transition-all duration-700 ease-out shadow-floating pointer-events-none z-10">
        {/* Device Top Pill / Speaker */}
        <div className="flex items-center justify-center py-1 sm:py-1.5 mb-1 sm:mb-2">
          <div className="w-10 sm:w-16 h-1 sm:h-1.5 rounded-full bg-fg-dim/40" />
        </div>

        {/* Screen Content: Mobile Page Image */}
        <div className="flex-1 rounded-[14px] sm:rounded-[18px] overflow-hidden relative border border-line/30 bg-bg">
          <img
            src={project.mobileImage || project.cover.dark}
            alt={`${project.title} Mobile Screen`}
            className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
            loading="lazy"
          />
          {/* Subtle mobile screen glare reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
        </div>

        {/* Device Bottom Indicator */}
        <div className="flex items-center justify-center pt-1.5 sm:pt-2">
          <div className="w-12 sm:w-16 h-1 rounded-full bg-fg-dim/30" />
        </div>
      </div>

      {/* 5. Primary Typography & Action Area (Left Side) */}
      <div className="absolute left-6 sm:left-10 bottom-6 sm:bottom-10 right-[38%] xs:right-[42%] sm:right-[45%] md:right-[48%] z-20 flex flex-col gap-2.5 sm:gap-3.5">
        {/* Project Title */}
        <h3 className="font-display text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-fg group-hover:text-accent transition-colors leading-[0.95]">
          {project.title}
        </h3>

        {/* One-Liner Summary */}
        <p className="font-sans text-xs xs:text-sm sm:text-base text-fg-muted leading-relaxed line-clamp-2 max-w-lg">
          {project.oneLiner}
        </p>
      </div>
    </Link>
  );
}

export default ProjectCard;
