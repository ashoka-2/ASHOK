import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProjectViewMode } from '../../store/uiSlice';
import { projects } from '../../data/projects';
import { SectionLabel } from '../ui/SectionLabel';
import { ProjectStack } from '../projects/ProjectStack';
import { ProjectHorizontal } from '../projects/ProjectHorizontal';
import { Layers, Columns } from 'lucide-react';
import { Button } from '../ui/Button';

export function ProjectsSection() {
  const dispatch = useDispatch();
  const projectViewMode = useSelector((state) => state.ui.projectViewMode);
  return (
    <section
      data-avatar-shot="far"
      data-avatar-side="left"
      data-avatar-pose="idle"
      className="w-full relative py-20 select-none z-20"
    >
      {/* Top Header & View Switcher */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <SectionLabel number="01" label="SELECTED WORK" />
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-fg">
            Engineered systems & products.
          </h2>
        </div>

        {/* Gooey Pill Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-full bg-bg-surface border border-line backdrop-blur-md">
            <button
              onClick={() => dispatch(setProjectViewMode('stack'))}
              aria-label="Stack layout view"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                projectViewMode === 'stack'
                  ? 'bg-accent text-accent-on font-semibold shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>STACK</span>
            </button>

            <button
              onClick={() => dispatch(setProjectViewMode('horizontal'))}
              aria-label="Horizontal layout view"
              className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                projectViewMode === 'horizontal'
                  ? 'bg-accent text-accent-on font-semibold shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>REEL</span>
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
      ) : (
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20">
          <ProjectStack projects={projects} />
        </div>
      )}
    </section>
  );
}
