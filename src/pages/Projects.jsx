import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { projects } from '../data/projects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { SectionLabel } from '../components/ui/SectionLabel';

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'AI', 'FULL STACK', 'CLOUD', 'CREATIVE'];

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter((p) =>
        p.category.some((c) => c.toUpperCase().includes(selectedCategory))
      );

  return (
    <PageShell>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-12 select-none">
        {/* Page Header */}
        <div className="mb-12">
          <SectionLabel number="01" label="ARCHIVE & WORKS" />
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-fg max-w-[900px]">
            Selected works & engineering projects.
          </h1>
          <p className="font-mono text-xs sm:text-sm text-fg-muted mt-4 max-w-[600px] leading-relaxed">
            A comprehensive catalog of autonomous AI agent workflows, distributed cloud architectures, and interactive digital experiences.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2.5 mb-16 pb-6 border-b border-line">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-accent text-accent-on font-semibold shadow-sm'
                  : 'bg-bg-surface/60 border border-line text-fg-muted hover:text-fg'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-fg-dim hidden sm:inline-block">
            SHOWING {filteredProjects.length} OF {projects.length}
          </span>
        </div>

        {/* Projects 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {filteredProjects.map((project, idx) => (
            <div key={project.slug} className="w-full">
              <ProjectCard project={project} index={idx} layout="stack" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default Projects;
