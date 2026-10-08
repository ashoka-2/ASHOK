import React from 'react';
import { cn } from '../../lib/utils';

export function SectionLabel({ number, label, className }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-fg-muted mb-4 select-none", className)}>
      {number && (
        <span className="text-accent font-semibold">{number}</span>
      )}
      {number && <span className="text-fg-dim">/</span>}
      <span className="tracking-[0.16em] text-fg-muted font-medium">{label}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
    </div>
  );
}
