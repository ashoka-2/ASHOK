import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { projects } from "../data/projects";
import { useTheme } from "../hooks/useTheme";
import { Button } from "../components/ui/Button";
import { Tag } from "../components/ui/Tag";
import { SectionLabel } from "../components/ui/SectionLabel";
import { ArrowLeft, ArrowUpRight, ExternalLink, Maximize2, X } from "lucide-react";
import { GithubIcon } from "../components/ui/GithubIcon";

export function ProjectDetail() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const [activeModalImage, setActiveModalImage] = useState(null);

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) {
    return <Navigate to="/projects" replace />;
  }

  const project = projects[currentIndex];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const heroImageSrc = project.desktopImage || project.cover.dark;

  // Compile full gallery of images (explicit images array + mobile image fallback)
  const gallery = project.images && project.images.length > 0 
    ? project.images 
    : [
        {
          url: project.desktopImage || project.cover.dark,
          title: `${project.title} Desktop Experience`,
          caption: project.oneLiner,
          aspect: "desktop"
        },
        ...(project.mobileImage ? [{
          url: project.mobileImage,
          title: `${project.title} Mobile View`,
          caption: "Optimized mobile viewport and responsive controls",
          aspect: "mobile"
        }] : [])
      ];

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

        {/* 1. Hero Section: Giant Title & Project Identity */}
        <div className="relative mb-16">
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

          <p className="font-display text-xl sm:text-2xl text-fg-muted max-w-[850px] leading-relaxed mb-10">
            {project.oneLiner}
          </p>

          {/* Metadata Grid & External Links (Minimal AI-App Tonal Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 sm:p-8 rounded-[24px] bg-bg-surface border border-line text-xs font-mono mb-12">
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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

          {/* Large Hero Mockup Stage with Project Glow */}
          <div className="relative w-full h-[360px] sm:h-[600px] md:h-[680px] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-line bg-bg-elev shadow-2xl">
            <div
              className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full blur-[100px] opacity-25 pointer-events-none"
              style={{ backgroundColor: project.accent }}
            />
            <img
              src={heroImageSrc}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* 2. Overview Section */}
        <div className="py-16 border-t border-line">
          <SectionLabel number="01" label="ARCHITECTURAL OVERVIEW" />
          <p className="font-display text-lg sm:text-2xl text-fg leading-relaxed max-w-[1000px] mt-4">
            {project.overview}
          </p>
        </div>

        {/* 3. Multi-Image Gallery (Array of Objects, Fully Responsive) */}
        {gallery.length > 0 && (
          <div className="py-16 border-t border-line">
            <div className="flex items-center justify-between mb-8">
              <SectionLabel number="02" label="INTERFACE & MULTI-SCREEN ARTIFACTS" />
              <span className="font-mono text-xs text-fg-dim">
                {gallery.length} DISPLAY ARTIFACTS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className={`group relative rounded-[28px] overflow-hidden border border-line bg-bg-elev p-3 sm:p-4 flex flex-col gap-3 transition-all duration-300 hover:border-accent/40 ${
                    img.aspect === "mobile" ? "max-w-[440px] mx-auto w-full md:col-span-1" : "w-full"
                  }`}
                >
                  {/* Image Container with Zoom Cue */}
                  <div 
                    onClick={() => setActiveModalImage(img)}
                    className="cursor-pointer rounded-[20px] overflow-hidden relative bg-bg border border-line/40 group-hover:shadow-lg transition-all"
                  >
                    <img
                      src={img.url}
                      alt={img.title || `${project.title} screenshot ${idx + 1}`}
                      className="w-full h-auto object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-bg/70 backdrop-blur-md border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-fg">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Caption & Title */}
                  {(img.title || img.caption) && (
                    <div className="px-2 py-1">
                      {img.title && (
                        <h4 className="font-display font-semibold text-fg text-sm sm:text-base">
                          {img.title}
                        </h4>
                      )}
                      {img.caption && (
                        <p className="font-mono text-xs text-fg-muted mt-1 leading-relaxed">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Key Features Section */}
        {project.features && project.features.length > 0 && (
          <div className="py-16 border-t border-line">
            <SectionLabel number="03" label="ENGINEERED CAPABILITIES" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-[20px] bg-bg-surface/50 border border-line flex items-start gap-4 hover:border-accent/30 transition-colors"
                >
                  <span className="font-mono text-xs text-accent font-bold mt-0.5">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm sm:text-base text-fg font-medium leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Tech Stack & Concepts */}
        <div className="py-16 border-t border-line grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <SectionLabel number="04" label="TECHNOLOGIES EMPLOYED" />
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
            <SectionLabel number="05" label="CORE ARCHITECTURAL CONCEPTS" />
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

        {/* 6. Next Project Transition Banner */}
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
            <span className="font-mono text-xs sm:text-sm text-fg-muted max-w-xl">
              {nextProject.oneLiner}
            </span>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal for Full Image Inspection */}
      {activeModalImage && (
        <div 
          onClick={() => setActiveModalImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] rounded-[24px] overflow-hidden bg-bg-elev border border-line p-2 sm:p-4 flex flex-col gap-3"
          >
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-accent hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-auto max-h-[75vh] rounded-[16px]">
              <img
                src={activeModalImage.url}
                alt={activeModalImage.title || "Project Screenshot"}
                className="w-full h-auto object-contain"
              />
            </div>
            {activeModalImage.title && (
              <div className="px-2">
                <h4 className="font-display font-bold text-fg text-lg">{activeModalImage.title}</h4>
                {activeModalImage.caption && (
                  <p className="font-mono text-xs text-fg-muted mt-0.5">{activeModalImage.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default ProjectDetail;
