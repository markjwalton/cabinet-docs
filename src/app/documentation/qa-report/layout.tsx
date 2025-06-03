/**
 * Documentation QA Report Layout Component
 * 
 * This layout wraps the QA report documentation page.
 */

import React from 'react';

/**
 * QAReportLayout component
 */
export default function QAReportLayout({
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
