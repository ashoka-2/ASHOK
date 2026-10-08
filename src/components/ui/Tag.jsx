import React from 'react';
import { cn } from '../../lib/utils';

export function Tag({ children, className, variant = 'default' }) {
  const variants = {
    default: "bg-bg-surface/60 text-fg-muted border-line",
    accent: "bg-accent-soft text-accent border-accent-border font-semibold",
    subtle: "bg-transparent text-fg-dim border-line/60",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border backdrop-blur-sm transition-colors",
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  );
}
