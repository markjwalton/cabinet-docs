/**
 * Documentation Troubleshooting Layout Component
 * 
 * This layout wraps the troubleshooting documentation page.
 */

import React from 'react';

/**
 * TroubleshootingLayout component
 */
export default function TroubleshootingLayout({
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
