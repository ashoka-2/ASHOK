import React, { useRef, useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProjectHorizontal({ projects }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);

    // Approximate active card
    const cardWidth = 360;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(projects.length - 1, Math.max(0, index)));
  };

  useEffect(() => {
    checkScroll();
    const scroller = scrollRef.current;
    if (scroller) {
      scroller.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (scroller) scroller.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [projects]);

  const scrollToCard = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth > 640 ? 460 : 320;
    const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full py-6 select-none">
      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none px-6 sm:px-12 md:px-20 py-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project, idx) => (
          <div
            key={project.slug}
            className="snap-center flex-shrink-0 w-[290px] xs:w-[330px] sm:w-[420px] md:w-[480px]"
          >
            <ProjectCard
              project={project}
              index={idx}
              total={projects.length}
              layout="horizontal"
            />
          </div>
        ))}
      </div>

      {/* Floating Controls & Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => {
                if (!scrollRef.current) return;
                const cardWidth = scrollRef.current.clientWidth > 640 ? 460 : 320;
                scrollRef.current.scrollTo({ left: i * (cardWidth + 24), behavior: 'smooth' });
              }}
              aria-label={`Jump to project ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-8 bg-accent' : 'w-2 bg-line hover:bg-fg-dim'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollToCard('prev')}
            disabled={!canScrollLeft}
            aria-label="Previous project"
            className="w-10 h-10 rounded-full border border-line bg-bg-surface/80 backdrop-blur-md flex items-center justify-center text-fg hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollToCard('next')}
            disabled={!canScrollRight}
            aria-label="Next project"
            className="w-10 h-10 rounded-full border border-line bg-bg-surface/80 backdrop-blur-md flex items-center justify-center text-fg hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectHorizontal;
