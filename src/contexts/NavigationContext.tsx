// src/contexts/NavigationContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  navigate: (href: string) => void;
  currentPath: string;
  lastNavigationTime: number;
  debugInfo: {
    navigationHistory: Array<{path: string, timestamp: number}>;
    navigationErrors: Array<{error: string, timestamp: number}>;
  };
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastNavigationTime, setLastNavigationTime] = useState(Date.now());
  const navigationInProgress = useRef(false);
  const [debugInfo, setDebugInfo] = useState({
    navigationHistory: [] as Array<{path: string, timestamp: number}>,
    navigationErrors: [] as Array<{error: string, timestamp: number}>
  });

  // Update navigation history when path changes
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      navigationHistory: [
        ...prev.navigationHistory,
        { path: pathname || '/', timestamp: Date.now() }
      ].slice(-10) // Keep only last 10 entries
    }));
    
    // Reset navigation state when path changes
    setIsNavigating(false);
    navigationInProgress.current = false;
  }, [pathname]);

  // Navigation function
  const navigate = useCallback((href: string) => {
    try {
      // Prevent duplicate navigation attempts
      if (navigationInProgress.current) {
        console.log('Navigation already in progress, ignoring request');
        return;
      }
      
      // Set navigation flags
      setIsNavigating(true);
      navigationInProgress.current = true;
      setLastNavigationTime(Date.now());
      
      // Log navigation attempt
      console.log(`Navigating to: ${href}`);
      
      // Use Next.js router for navigation
      router.push(href);
    } catch (error) {
      // Log navigation errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Navigation error:', errorMessage);
      
      setDebugInfo(prev => ({
        ...prev,
        navigationErrors: [
          ...prev.navigationErrors,
          { error: errorMessage, timestamp: Date.now() }
        ].slice(-10) // Keep only last 10 entries
      }));
      
      // Reset navigation state on error
      setIsNavigating(false);
      navigationInProgress.current = false;
    } finally {
      // Reset navigation state after a delay
      setTimeout(() => {
        setIsNavigating(false);
        navigationInProgress.current = false;
      }, 500);
    }
  }, [router]);

  // Context value
  const value = {
    isNavigating,
    navigate,
    currentPath: pathname || '/',
    lastNavigationTime,
    debugInfo
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    // Check if we're in a server/static context (no window)
    if (typeof window === 'undefined') {
      // Return a dummy navigation object during static generation
      return {
        isNavigating: false,
        navigate: (href: string) => {
          console.log('Navigation not available during static generation', href);
        },
        currentPath: '/',
        lastNavigationTime: Date.now(),
        debugInfo: {
          navigationHistory: [],
          navigationErrors: []
        }
      };
    }
    // Only throw in client-side context
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
