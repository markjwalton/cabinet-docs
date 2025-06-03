/**
 * NotificationContext
 * 
 * A context provider for managing toast notifications throughout the application.
 * Provides methods to show different types of notifications and manage their lifecycle.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from '../components/ui/notifications/Toast';

// Types for the notification system
export type Notification = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type NotificationContextType = {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => string;
  hideNotification: (id: string) => void;
  showSuccess: (title: string, message?: string, duration?: number) => string;
  showError: (title: string, message?: string, duration?: number) => string;
  showInfo: (title: string, message?: string, duration?: number) => string;
  showWarning: (title: string, message?: string, duration?: number) => string;
};

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider component
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate a unique ID for notifications
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  // Add a new notification
  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  }, [generateId]);

  // Remove a notification by ID
  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Helper methods for different notification types
  const showSuccess = useCallback((title: string, message?: string, duration = 5000) => {
    return showNotification({ type: 'success', title, message, duration });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string, duration = 8000) => {
    return showNotification({ type: 'error', title, message, duration });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string, duration = 5000) => {
    return showNotification({ type: 'info', title, message, duration });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string, duration = 6000) => {
    return showNotification({ type: 'warning', title, message, duration });
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning
      }}
    >
      {children}
      
      {/* Notification container - positioned in top-right, not full width */}
      <div className="fixed top-4 right-4 z-50 space-y-4 max-w-md">
        {notifications.map(notification => (
          <Toast
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            duration={notification.duration}
            action={notification.action}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

/**
 * Hook to use the notification context
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
}
