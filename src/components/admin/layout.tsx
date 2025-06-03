"use client";

/**
 * Admin Layout Component
 * 
 * Provides a consistent layout for all admin pages with proper navigation state management.
 * Uses the global NavigationContext for robust navigation between admin pages.
 */

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { debugInfo } = useNavigation();
  
  // Debug navigation issues in admin section
  useEffect(() => {
    console.log('Admin Layout Mounted', { 
      pathname,
      navigationHistory: debugInfo.navigationHistory,
      navigationErrors: debugInfo.navigationErrors
    });
    
    // Force cleanup of any potential event handlers
    const cleanup = () => {
      // Remove any global event listeners that might be causing issues
      const eventTypes = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
      eventTypes.forEach(type => {
        document.removeEventListener(type, e => e.stopPropagation(), true);
      });
    };
    
    cleanup();
    
    return () => {
      cleanup();
      console.log('Admin Layout Unmounted', { pathname });
    };
  }, [pathname, debugInfo]);
  
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

export default AdminLayout;
