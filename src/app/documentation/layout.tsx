"use client";

import React from 'react';
// Removed unused import: import { NavigationProvider } from '@/contexts/NavigationContext';
import '@/app/globals.css';

/**
 * Documentation Layout Component
 * 
 * Wraps all documentation pages with necessary providers and layout elements.
 */
export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="documentation-layout">
      {/* Documentation-specific layout elements can go here */}
      {children}
    </div>
  );
}
