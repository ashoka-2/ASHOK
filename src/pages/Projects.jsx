import React, { useState } from "react";
import { PageShell } from "../components/layout/PageShell";
import { projects } from "../data/projects";
import { ProjectCard } from "../components/projects/ProjectCard";
import { SectionLabel } from "../components/ui/SectionLabel";

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = ["ALL", "AI", "FULL STACK", "CLOUD", "CREATIVE"];

  const filteredProjects =
    selectedCategory === "ALL"
      ? projects
      : projects.filter((p) =>
          p.category.some((c) => c.toUpperCase().includes(selectedCategory)),
        );

  return (
    <PageShell>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-12 select-none">
        {/* Page Header */}
        <div className="mb-12">
          <SectionLabel number="01" label="ENGINEERING & WORK ARCHIVE" />
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-fg max-w-[950px] leading-[1.05]">
            Engineered systems &amp; products.
          </h1>
          <p className="font-sans text-sm sm:text-base text-fg-muted mt-4 max-w-[620px] leading-relaxed">
            A comprehensive catalog of autonomous AI agent workspaces,
            distributed cloud architectures, computer vision applications, and interactive digital
            experiences.
          </p>
        </div>

        {/* Filter Chips (Pill Buttons) */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-line">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-accent text-accent-on font-semibold shadow-sm"
                  : "bg-bg-surface/70 border border-line text-fg-muted hover:text-fg hover:bg-bg-surface"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-fg-dim hidden sm:inline-block">
            SHOWING {filteredProjects.length} OF {projects.length} PROJECTS
          </span>
        </div>

        {/* Projects 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {filteredProjects.map((project, idx) => (
            <div key={project.slug} className="w-full">
              <ProjectCard project={project} index={idx} total={projects.length} layout="stack" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default Projects;
