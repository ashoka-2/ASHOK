// src/components/effects/Grain.jsx
import React from 'react';

/**
 * Subtle CSS-only grain overlay.
 * Uses modern CSS blend modes + background-blend-mode for a realistic, soft noise.
 */
export function Grain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.028] mix-blend-overlay"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        backgroundBlendMode:
          'overlay', // <-- soft and subtle
      }}
      aria-hidden="true"
    />
  );
}
