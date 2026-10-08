import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Compass } from 'lucide-react';

export function NotFound() {
  return (
    <PageShell showFooter={false}>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 select-none">
        <div className="w-20 h-20 rounded-full border border-line bg-bg-surface flex items-center justify-center text-accent mb-6 animate-pulse">
          <Compass className="w-10 h-10" />
        </div>

        <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-2">
          ERROR 404 // COORDINATES UNKNOWN
        </span>

        <h1 className="font-display text-5xl sm:text-7xl font-black text-fg tracking-tight mb-4">
          Lost in hyperspace.
        </h1>

        <p className="font-mono text-xs sm:text-sm text-fg-muted max-w-[480px] leading-relaxed mb-8">
          The requested coordinate or project node does not exist in this dimension. Navigate back to the safe zone.
        </p>

        <Button to="/" variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
          Return to Command Center
        </Button>
      </div>
    </PageShell>
  );
}

export default NotFound;
