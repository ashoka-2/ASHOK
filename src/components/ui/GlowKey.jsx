import React from 'react';
import { cn } from '../../lib/utils';

export function GlowKey({ children, className, onClick }) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center px-2 py-0.5 min-w-[24px] h-[22px] rounded-[6px] font-mono text-[11px] font-semibold tracking-wider text-fg-muted uppercase bg-bg-surface/90 border border-line/80 shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 hover:text-accent hover:border-accent hover:shadow-[0_0_12px_rgba(57,230,0,0.4)] cursor-default select-none",
        className
      )}
    >
      {children}
    </span>
  );
}
