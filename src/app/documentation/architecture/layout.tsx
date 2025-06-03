/**
 * Documentation Architecture Layout Component
 * 
 * This layout wraps the architecture documentation page.
 */

import React from 'react';

/**
 * ArchitectureLayout component
 */
export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="documentation-section">
      {children}
    </div>
  );
}
