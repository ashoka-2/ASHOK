import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { projects } from "../data/projects";
import { useTheme } from "../hooks/useTheme";
import { Button } from "../components/ui/Button";
import { Tag } from "../components/ui/Tag";
import { SectionLabel } from "../components/ui/SectionLabel";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "../components/ui/GithubIcon";

export function ProjectDetail() {
  const { slug } = useParams();
  const { theme } = useTheme();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) {
    return <Navigate to="/projects" replace />;
  }

  const project = projects[currentIndex];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const isDark = theme === "dark";
  const coverSrc = isDark ? project.cover.dark : project.cover.light;

  return (
    <PageShell>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-8 select-none">
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ALL PROJECTS</span>
        </Link>

        {/* 1. Hero Section: Giant Title & Overlapping Device Cover */}
        <div className="relative mb-20">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="font-mono text-xs text-accent font-semibold tracking-wider">
              PROJECT {project.index}
            </span>
            <span className="text-fg-dim font-mono text-xs">•</span>
            {project.category.map((c) => (
              <Tag key={c} variant="accent">
                {c}
              </Tag>
            ))}
          </div>

          <h1 className="font-display text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-fg leading-[0.95] mb-8">
            {project.title}
          </h1>

          <p className="font-display text-xl sm:text-2xl text-fg-muted max-w-[800px] leading-relaxed mb-10">
            {project.oneLiner}
          </p>

          {/* Metadata Grid & External Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 rounded-[20px] bg-bg-surface border border-line text-xs font-mono mb-12">
            <div>
              <span className="text-fg-dim block mb-1">ROLE</span>
              <span className="text-fg font-medium">{project.role}</span>
            </div>
            <div>
              <span className="text-fg-dim block mb-1">YEAR</span>
              <span className="text-fg font-medium">{project.year}</span>
            </div>
            <div>
              <span className="text-fg-dim block mb-1">STATUS</span>
              <span className="text-accent font-medium">{project.status}</span>
            </div>
            <div className="flex items-center gap-3">
              {project.links.github && (
                <Button
                  href={project.links.github}
                  variant="secondary"
                  size="sm"
                  icon={<GithubIcon className="w-3.5 h-3.5" />}
                >
                  GitHub
                </Button>
              )}
              {project.links.live && (
                <Button
                  href={project.links.live}
                  variant="primary"
                  size="sm"
                  iconRight={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Live Demo
                </Button>
              )}
            </div>
          </div>

          {/* Large Hero Mockup Stage */}
          <div className="relative w-full h-[400px] sm:h-[620px] rounded-[32px] overflow-hidden border border-line bg-bg-elev shadow-2xl">
            <div
              className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full blur-[90px] opacity-30 pointer-events-none"
              style={{ backgroundColor: project.accent }}
            />
            <img
              src={coverSrc}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* 2. Overview Section */}
        <div className="py-16 border-t border-line">
          <SectionLabel number="01" label="ARCHITECTURAL OVERVIEW" />
          <p className="font-display text-lg sm:text-2xl text-fg leading-relaxed max-w-[1000px]">
            {project.overview}
          </p>
        </div>

        {/* 3. Key Features Section */}
        {project.features && project.features.length > 0 && (
          <div className="py-16 border-t border-line">
            <SectionLabel number="02" label="ENGINEERED CAPABILITIES" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[20px] bg-bg-surface/50 border border-line flex items-start gap-4"
                >
                  <span className="font-mono text-xs text-accent font-bold mt-0.5">
                    0{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base text-fg font-medium leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Tech Stack & Concepts */}
        <div className="py-16 border-t border-line grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <SectionLabel number="03" label="TECHNOLOGIES EMPLOYED" />
            <div className="flex flex-wrap gap-2.5 mt-4">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full font-mono text-xs bg-bg-surface border border-line text-fg font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel number="04" label="CORE CONCEPTS" />
            <div className="flex flex-wrap gap-2.5 mt-4">
              {project.concepts.map((concept) => (
                <span
                  key={concept}
                  className="px-4 py-2 rounded-full font-mono text-xs bg-accent-soft border border-accent-border text-accent font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Next Project Transition Banner */}
        <div className="py-20 border-t border-line mt-12 text-center">
          <span className="font-mono text-xs text-fg-dim tracking-widest block mb-4">
            NEXT PROJECT
          </span>
          <Link
            to={`/projects/${nextProject.slug}`}
            className="group inline-flex flex-col items-center gap-2"
          >
            <h2 className="font-display text-4xl sm:text-7xl font-bold text-fg group-hover:text-accent transition-colors flex items-center gap-4">
              <span>{nextProject.title}</span>
              <ArrowUpRight className="w-8 h-8 sm:w-12 sm:h-12 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
            </h2>
            <span className="font-mono text-xs sm:text-sm text-fg-muted">
              {nextProject.oneLiner}
            </span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

export default ProjectDetail;
