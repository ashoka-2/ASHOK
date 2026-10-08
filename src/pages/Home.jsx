import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Hero } from '../components/sections/Hero';
import { Intro } from '../components/sections/Intro';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { LabSection } from '../components/sections/LabSection';
import { TechPhysics } from '../components/sections/TechPhysics';
import { BigName } from '../components/sections/BigName';

export function Home() {
  return (
    <PageShell>
      <Hero />
      <Intro />
      <ProjectsSection />
      <LabSection />
      <TechPhysics />
      <BigName />
    </PageShell>
  );
}

export default Home;
