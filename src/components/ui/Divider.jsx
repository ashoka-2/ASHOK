import React from 'react';
import { cn } from '../../lib/utils';

export function Divider({ className, subtle = false }) {
  return (
    <div
      className={cn(
        "w-full h-[1px]",
        subtle ? "bg-line/40" : "bg-line",
        className
      )}
    />
  );
}
