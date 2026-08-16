import React from 'react';

export function SomaliPattern({ className = '', opacity = 0.08, color = '#0F3D2E' }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id="somali-lattice" width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="1.4" opacity={opacity}>
            <path d="M28 4 L52 28 L28 52 L4 28 Z" />
            <path d="M28 16 L40 28 L28 40 L16 28 Z" />
            <circle cx="28" cy="28" r="3" />
            <path d="M0 28 H8 M48 28 H56 M28 0 V8 M28 48 V56" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#somali-lattice)" />
    </svg>
  );
}
