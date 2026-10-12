import React, { useRef, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { gsap } from '../../lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ProjectHorizontal({ projects }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const getScrollDist = () => {
        return Math.max(100, track.scrollWidth - window.innerWidth + 140);
      };

      gsap.to(track, {
        x: () => -getScrollDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [projects]);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: '340vh' }}
    >
      {/* Sticky Viewport Stage (Zero GSAP DOM spacers = Zero Black Screens) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        <div
          ref={trackRef}
          className="flex gap-8 pl-6 sm:pl-16 pr-28 w-max items-center will-change-transform"
        >
          {projects.map((project, idx) => (
            <div
              key={project.slug}
              className="w-[300px] xs:w-[340px] sm:w-[460px] md:w-[520px] flex-shrink-0"
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
      </div>
    </div>
  );
}

export default ProjectHorizontal;
