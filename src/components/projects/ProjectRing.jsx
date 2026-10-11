import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { playClick, playWhoosh } from '../../lib/sfx';

export function ProjectRing({ projects }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [radius, setRadius] = useState(540);
  const containerRef = useRef(null);

  const total = projects.length;
  const angleStep = 360 / total;

  // Responsive radius calculation with generous angular spacing between cards
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadius(320);
      } else if (width < 1024) {
        setRadius(460);
      } else {
        setRadius(600);
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
    setRotation(startRotation + deltaX * 0.4);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to closest card
    const targetIdx = Math.round((-rotation % 360) / angleStep);
    setRotation(-targetIdx * angleStep);
    playWhoosh();
  };

  const rotateTo = (index) => {
    setRotation(-index * angleStep);
    playClick();
  };

  const handleNext = () => {
    setRotation((prev) => prev - angleStep);
    playWhoosh();
  };

  const handlePrev = () => {
    setRotation((prev) => prev + angleStep);
    playWhoosh();
  };

  return (
    <div className="relative w-full py-6 select-none overflow-hidden flex flex-col items-center">
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
        className="relative w-full h-[520px] sm:h-[600px] md:h-[660px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: '2000px',
        }}
      >
        {/* Revolving Carousel Cylinder with refined smaller card geometry & ample gap */}
        <div
          className="relative w-[210px] xs:w-[230px] sm:w-[250px] md:w-[270px] h-[260px] sm:h-[290px] md:h-[320px]"
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
            const isFront = diff < angleStep * 0.65;
            const cardOpacity = Math.max(0.2, 1 - diff / 140);
            const cardScale = Math.max(0.85, 1 - diff / 360);

            return (
              <div
                key={project.slug}
                onClick={() => rotateTo(idx)}
                className="absolute inset-0 rounded-[24px] sm:rounded-[30px] overflow-hidden border border-line bg-bg-elev p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer hover:border-accent"
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${cardScale})`,
                  opacity: cardOpacity,
                  pointerEvents: isFront ? 'auto' : 'auto',
                }}
              >
                {/* Desktop Background Image (Low Opacity + Grain) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={project.desktopImage || project.cover.dark}
                    alt={project.title}
                    className="w-full h-full object-cover object-top opacity-20 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-elev via-bg-elev/75 to-transparent" />
                </div>

                {/* Per-Project Soft Bloom */}
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 90% 10%, color-mix(in srgb, ${project.accent} 40%, transparent), transparent 70%)`,
                  }}
                />

                {/* Top Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs text-accent font-semibold">
                    {project.index}/{String(total).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-bg-surface/85 border border-line text-fg-muted uppercase">
                    {project.category[0]}
                  </span>
                </div>

                {/* Center Thumbnail Frame */}
                <div className="relative z-10 my-auto w-full aspect-[16/10] rounded-[16px] overflow-hidden border border-line/60 bg-bg">
                  <img
                    src={project.desktopImage || project.cover.dark}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Bottom Title & Details */}
                <div className="relative z-10 pt-1">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-fg truncate">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[10px] sm:text-[11px] text-fg-muted line-clamp-1 mt-0.5">
                    {project.oneLiner}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focused Project HUD & Controls */}
      <div className="max-w-[720px] w-full mx-auto px-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Project Info Pill */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-line bg-bg-surface flex items-center justify-center font-mono text-xs font-bold text-accent">
            {activeProject.index}
          </div>
          <div>
            <span className="font-display font-bold text-fg text-sm sm:text-base block">
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
            className="w-9 h-9 rounded-full border border-line bg-bg-surface/80 backdrop-blur-md flex items-center justify-center text-fg hover:border-accent hover:text-accent transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <Link
            to={`/projects/${activeProject.slug}`}
            onClick={() => playClick()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-on font-display font-semibold text-xs sm:text-sm hover:bg-accent-hover transition-all"
          >
            <span>Open Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleNext}
            aria-label="Next ring project"
            className="w-9 h-9 rounded-full border border-line bg-bg-surface/80 backdrop-blur-md flex items-center justify-center text-fg hover:border-accent hover:text-accent transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectRing;
