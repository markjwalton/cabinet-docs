/**
 * NotificationContext Type Definition
 * 
 * This file defines the types used by the NotificationContext
 * to ensure consistent usage across components.
 */

// Define the Notification type
export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Define the NotificationContextType
export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearNotifications: () => void;
}
