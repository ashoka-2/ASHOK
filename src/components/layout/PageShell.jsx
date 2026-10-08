import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MenuOverlay } from './MenuOverlay';
import { Footer } from './Footer';
import { Cursor } from '../effects/Cursor';
import { Grain } from '../effects/Grain';
import { GooeyFilter } from '../effects/GooeyFilter';
import { PullCord } from '../effects/PullCord';
import { Preloader } from '../effects/Preloader';
import { PageTransition } from '../effects/PageTransition';

export function PageShell({ children, showFooter = true }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="relative min-h-screen bg-bg text-fg selection:bg-accent selection:text-black overflow-x-clip flex flex-col justify-between">
      <Preloader />
      <Grain />
      <GooeyFilter />
      <Cursor />
      <PullCord />
      <Navbar />
      <MenuOverlay />

      <main className={`flex-1 w-full ${isHome ? 'pt-0' : 'pt-24 sm:pt-28'}`}>
        <PageTransition>{children}</PageTransition>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
