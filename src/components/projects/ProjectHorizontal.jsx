import React, { useRef, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { gsap } from '../../lib/gsap';

export function ProjectHorizontal({ projects }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const scrollWidth = track.scrollWidth - window.innerWidth + 120;

      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [projects]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex flex-col justify-center"
    >
      <div
        ref={trackRef}
        className="flex gap-8 pl-6 sm:pl-16 pr-24 w-max items-center will-change-transform"
      >
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={idx}
            layout="horizontal"
          />
        ))}
      </div>
    </div>
  );
}
