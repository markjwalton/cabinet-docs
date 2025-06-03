// src/app/admin/layout.tsx
"use client";

/**
 * Admin Layout Component
 * 
 * Provides a consistent layout for all admin pages with proper navigation state management.
 * Uses the global NavigationContext for robust navigation between admin pages.
 */

import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

export default AdminLayout;
