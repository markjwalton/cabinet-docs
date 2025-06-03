"use client";

/**
 * Application Initialization Component
 * 
 * This component initializes the application by running database migrations
 * and setting up the forms management system.
 */

import React, { useEffect, useState } from 'react';
import { initializeDatabase } from '@/utils/database/runMigrations';
import { useNotification } from '@/contexts/NotificationContext';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);
        
        // Run database migrations and initialize forms
        await initializeDatabase();
        
      } catch (error) {
        console.error('Failed to initialize application:', error);
        showError(
          'Application initialization failed', 
          'There was an error initializing the application. Some features may not work correctly.'
        );
      } finally {
        setIsInitializing(false);
      }
    };
    
    initialize();
  }, [showError]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-lg text-secondary-700">Initializing application...</p>
          <p className="mt-2 text-sm text-secondary-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
