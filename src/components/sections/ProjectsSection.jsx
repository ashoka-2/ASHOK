import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProjectViewMode } from '../../store/uiSlice';
import { projects } from '../../data/projects';
import { SectionLabel } from '../ui/SectionLabel';
import { ProjectStack } from '../projects/ProjectStack';
import { ProjectHorizontal } from '../projects/ProjectHorizontal';
import { ProjectRing } from '../projects/ProjectRing';
import { Layers, Columns, Disc3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playClick } from '../../lib/sfx';
import { getLenis } from '../../lib/lenis';

export function ProjectsSection() {
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const projectViewMode = useSelector((state) => state.ui.projectViewMode);

  const handleModeChange = (mode) => {
    if (mode === projectViewMode) return;
    playClick();

    // Kill pinned virtual distance and align scroll to section top before switching
    if (sectionRef.current) {
      const secEl = sectionRef.current;
      const targetTop = secEl.getBoundingClientRect().top + window.scrollY;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(targetTop - 60, { immediate: true });
      } else {
        window.scrollTo({ top: Math.max(0, targetTop - 60), behavior: 'instant' });
      }
    }

    dispatch(setProjectViewMode(mode));

    // Force ScrollTrigger refresh on next frame
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 120);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [projectViewMode]);

  return (
    <section
      ref={sectionRef}
      data-avatar-shot="far"
      data-avatar-side="left"
      data-avatar-pose="idle"
      className="w-full relative py-20 select-none z-20"
    >
      {/* Top Header & 3-Mode View Switcher */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <SectionLabel number="01" label="SELECTED WORK" />
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-fg">
            Engineered systems &amp; products.
          </h2>
        </div>

        {/* 3-Way Pill Mode Switcher: STACK · REEL · RING */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 rounded-full bg-bg-surface border border-line backdrop-blur-md">
            <button
              onClick={() => handleModeChange('stack')}
              aria-label="Stack layout view"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                projectViewMode === 'stack'
                  ? 'bg-accent text-accent-on font-semibold shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>STACK</span>
            </button>

            <button
              onClick={() => handleModeChange('horizontal')}
              aria-label="Reel slide view"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                projectViewMode === 'horizontal'
                  ? 'bg-accent text-accent-on font-semibold shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>REEL</span>
            </button>

            <button
              onClick={() => handleModeChange('ring')}
              aria-label="3D ring circular wheel view"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                projectViewMode === 'ring'
                  ? 'bg-accent text-accent-on font-semibold shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Disc3 className="w-3.5 h-3.5" />
              <span>RING</span>
            </button>
          </div>

          <Button to="/projects" variant="ghost" size="sm">
            View All ({projects.length}) →
          </Button>
        </div>
      </div>

      {/* Render Active View Mode */}
      {projectViewMode === 'horizontal' ? (
        <ProjectHorizontal projects={projects} />
      ) : projectViewMode === 'ring' ? (
        <ProjectRing projects={projects} />
      ) : (
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20">
          <ProjectStack projects={projects} />
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;
