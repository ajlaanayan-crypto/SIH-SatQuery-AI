'use client';

import React from 'react';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[var(--color-panel)] backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center space-x-3 text-[var(--color-primary)]">
        <h1 className="text-xl font-bold tracking-tight">SatQuery AI</h1>
      </div>
    </nav>
  );
}
