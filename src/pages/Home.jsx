import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { AvatarCanvas } from '../components/avatar/AvatarCanvas';
import { HeroAvatar } from '../components/hero/HeroAvatar';
import { Intro } from '../components/sections/Intro';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { LabSection } from '../components/sections/LabSection';
import { TechPhysics } from '../components/sections/TechPhysics';
import { BigName } from '../components/sections/BigName';

export function Home() {
  return (
    <PageShell>
      {/* Persistent WebGL 3D Avatar Canvas */}
      <AvatarCanvas />

      {/* 3D Avatar Hero (300vh runway + sticky stage) */}
      <HeroAvatar />

      {/* Rest of the Home Sections with data-avatar-* director stops */}
      <Intro />
      <ProjectsSection />
      <LabSection />
      <TechPhysics />
      <BigName />
    </PageShell>
  );
}

export default Home;
