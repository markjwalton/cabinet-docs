"use client";

/**
 * Error Handling Utility
 * 
 * This utility provides functions for handling errors in a consistent way
 * throughout the application, particularly for Supabase-related errors.
 */

import { PostgrestError } from '@supabase/supabase-js';

/**
 * Handle Supabase errors in a consistent way
 * @param error The error from Supabase
 * @param defaultMessage A default message to use if the error doesn't have a message
 * @returns A standardized error object
 */
export const handleSupabaseError = (
  error: PostgrestError | Error,
  defaultMessage: string = 'An error occurred'
): Error => {
  console.error('Supabase error:', error);
  
  // If it's a PostgrestError, format it nicely
  if ('code' in error && 'message' in error && 'details' in error) {
    const postgrestError = error as PostgrestError;
    const message = postgrestError.message || defaultMessage;
    const formattedError = new Error(`${message} (Code: ${postgrestError.code})`);
    
    // Add additional properties to the error
    Object.assign(formattedError, {
      code: postgrestError.code,
      details: postgrestError.details,
      hint: postgrestError.hint,
      originalError: postgrestError
    });
    
    return formattedError;
  }
  
  // If it's a regular Error, just return it
  if (error instanceof Error) {
    return error;
  }
  
  // If it's something else, create a new Error
  return new Error(defaultMessage);
};

/**
 * Format an error message for display to the user
 * @param error The error object
 * @returns A user-friendly error message
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};
