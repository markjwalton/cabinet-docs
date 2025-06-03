"use client";

/**
 * Storage Utility
 * 
 * This utility provides functions for interacting with local storage
 * in a consistent way throughout the application.
 */

// Get an item from local storage
export const getLocalStorage = <T>(key: string): T | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item ${key} from local storage:`, error);
    return null;
  }
};

// Set an item in local storage
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in local storage:`, error);
  }
};

// Remove an item from local storage
export const removeLocalStorage = (key: string): void => {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from local storage:`, error);
  }
};

// Clear all items from local storage
export const clearLocalStorage = (): void => {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};

// Check if an item exists in local storage
export const hasLocalStorage = (key: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking if item ${key} exists in local storage:`, error);
    return false;
  }
};
