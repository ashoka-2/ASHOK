import React, { useRef, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { gsap } from '../../lib/gsap';

export function ProjectStack({ projects }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return; // Last card stays visible

        gsap.to(card, {
          scale: 0.92,
          opacity: 0.45,
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: cards[index + 1],
            start: 'top 85%',
            end: 'top 15%',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col">
      {projects.map((project, idx) => (
        <div
          key={project.slug}
          ref={(el) => (cardsRef.current[idx] = el)}
          className="sticky top-[12vh] mb-[12vh] w-full origin-top transition-transform"
          style={{ zIndex: 10 + idx }}
        >
          <ProjectCard project={project} index={idx} total={projects.length} layout="stack" />
        </div>
      ))}
    </div>
  );
}
