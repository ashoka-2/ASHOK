import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ProjectRing({ projects }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [radius, setRadius] = useState(480);
  const containerRef = useRef(null);

  const total = projects.length;
  const angleStep = 360 / total;

  // Responsive radius calculation
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadius(290);
      } else if (width < 1024) {
        setRadius(380);
      } else {
        setRadius(500);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Compute currently focused project index based on rotation angle
  const normalizedRotation = ((-rotation % 360) + 360) % 360;
  const activeIndex = Math.round(normalizedRotation / angleStep) % total;
  const activeProject = projects[activeIndex];

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setStartX(clientX);
    setStartRotation(rotation);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startX;
    setRotation(startRotation + deltaX * 0.45);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to closest card
    const targetIdx = Math.round((-rotation % 360) / angleStep);
    setRotation(-targetIdx * angleStep);
  };

  const rotateTo = (index) => {
    setRotation(-index * angleStep);
  };

  const handleNext = () => {
    setRotation((prev) => prev - angleStep);
  };

  const handlePrev = () => {
    setRotation((prev) => prev + angleStep);
  };

  return (
    <div className="relative w-full py-12 select-none overflow-hidden flex flex-col items-center">
      {/* 3D Ring Stage Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className="relative w-full h-[460px] sm:h-[540px] md:h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1400px',
        }}
      >
        {/* Revolving Carousel Cylinder */}
        <div
          className="relative w-[280px] xs:w-[320px] sm:w-[380px] md:w-[420px] h-[380px] sm:h-[460px] md:h-[500px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {projects.map((project, idx) => {
            const cardAngle = idx * angleStep;
            // Calculate distance to front
            const currentAngle = (cardAngle + rotation) % 360;
            const diff = Math.abs(((currentAngle + 180) % 360) - 180);
            const isFront = diff < angleStep * 0.75;
            const cardOpacity = Math.max(0.25, 1 - diff / 160);

            return (
              <div
                key={project.slug}
                onClick={() => rotateTo(idx)}
                className="absolute inset-0 rounded-[28px] sm:rounded-[36px] overflow-hidden border border-line bg-bg-elev p-5 sm:p-6 flex flex-col justify-between transition-opacity duration-300 shadow-2xl"
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  opacity: cardOpacity,
                  pointerEvents: isFront ? 'auto' : 'auto',
                }}
              >
                {/* Desktop Background Image (Low Opacity + Grain) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={project.desktopImage || project.cover.dark}
                    alt={project.title}
                    className="w-full h-full object-cover object-top opacity-25 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-elev via-bg-elev/70 to-transparent" />
                </div>

                {/* Per-Project Glow */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 90% 10%, color-mix(in srgb, ${project.accent} 40%, transparent), transparent 70%)`,
                  }}
                />

                {/* Top Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs text-accent font-semibold">
                    {project.index}/{String(total).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-bg-surface/80 border border-line text-fg-muted uppercase">
                    {project.category[0]}
                  </span>
                </div>

                {/* Center Thumbnail Frame */}
                <div className="relative z-10 my-auto w-full aspect-[16/10] rounded-[18px] overflow-hidden border border-line/60 bg-bg">
                  <img
                    src={project.desktopImage || project.cover.dark}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Bottom Title & Details */}
                <div className="relative z-10 pt-2">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-fg truncate">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[11px] sm:text-xs text-fg-muted line-clamp-1 mt-0.5">
                    {project.oneLiner}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focused Project HUD & Controls */}
      <div className="max-w-[800px] w-full mx-auto px-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Project Info Pill */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-line bg-bg-surface flex items-center justify-center font-mono text-xs font-bold text-accent">
            {activeProject.index}
          </div>
          <div>
            <span className="font-display font-bold text-fg text-base sm:text-lg block">
              {activeProject.title}
            </span>
            <span className="font-mono text-xs text-fg-muted block">
              {activeProject.category.join(' · ')}
            </span>
          </div>
        </div>

        {/* Navigation & Select Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            aria-label="Previous ring project"
            className="w-10 h-10 rounded-full border border-line bg-bg-surface/80 backdrop-blur-md flex items-center justify-center text-fg hover:border-accent hover:text-accent transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <Link
            to={`/projects/${activeProject.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-on font-display font-semibold text-xs sm:text-sm hover:bg-accent-hover transition-all"
          >
            <span>Open Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleNext}
            aria-label="Next ring project"
            className="w-10 h-10 rounded-full border border-line bg-bg-surface/80 backdrop-blur-md flex items-center justify-center text-fg hover:border-accent hover:text-accent transition-all active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectRing;
