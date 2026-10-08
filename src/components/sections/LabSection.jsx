import React from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { Button } from '../ui/Button';
import { InteractiveTile } from '../lab/InteractiveTile';
import { ArrowUpRight } from 'lucide-react';

export function LabSection() {
  const experiments = [
    {
      id: 'particle-portrait',
      title: 'Particle Portrait',
      subtitle: 'Hover to scatter portrait particles with spring return physics',
      color: '#39E600',
    },
    {
      id: 'node-field',
      title: 'Node Network Field',
      subtitle: 'Dynamic floating nodes attracted to cursor proximity',
      color: '#2D6BFF',
    },
    {
      id: 'kinetic-type',
      title: 'Kinetic 3D Typography',
      subtitle: 'Letters react, scale and rotate dynamically with cursor velocity',
      color: '#FF4FA3',
    },
    {
      id: 'cursor-trail',
      title: 'Luminous Light Trail',
      subtitle: 'Draw fluid rainbow particle light trails on dark glass',
      color: '#FFB020',
    },
    {
      id: 'audio-waveform',
      title: 'Frequency Spectrum',
      subtitle: 'Interactive procedural waveform reacting to mouse proximity',
      color: '#00E5FF',
    },
    {
      id: 'matrix-stream',
      title: 'Cyber Data Rain',
      subtitle: 'Cascading monospace glyph streams with interactive flow',
      color: '#A855F7',
    },
  ];

  return (
    <section
      data-avatar-shot="waist"
      data-avatar-side="right"
      data-avatar-pose="think"
      className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-24 border-t border-line/40 select-none relative z-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <SectionLabel number="02" label="EXPERIMENTAL LAB" />
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-fg">
            Interactive prototypes & graphics.
          </h2>
        </div>

        <Button to="/lab" variant="secondary" size="md" iconRight={<ArrowUpRight className="w-4 h-4" />}>
          Explore Playground Studio ({experiments.length})
        </Button>
      </div>

      {/* Grid of Live Interactive Physics Canvas Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {experiments.map((item) => (
          <InteractiveTile
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            color={item.color}
          />
        ))}
      </div>
    </section>
  );
}

export default LabSection;
