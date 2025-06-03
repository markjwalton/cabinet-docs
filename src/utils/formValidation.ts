/**
 * formValidation.ts
 * 
 * This utility file provides form validation functions for the application.
 */

import { FormField, FormValues } from '@/types/forms';

/**
 * Validates a single form field value
 * 
 * @param field The form field definition
 * @param value The value to validate
 * @returns Error message if validation fails, empty string if validation passes
 */
export const validateField = (field: FormField, value: any): string => {
  // Check required fields
  if (field.required && (value === undefined || value === null || value === '')) {
    return `${field.label} is required`;
  }
  
  // Type-specific validations
  switch (field.type) {
    case 'email':
      if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        return `${field.label} must be a valid email address`;
      }
      break;
      
    case 'number':
      if (value !== '' && isNaN(Number(value))) {
        return `${field.label} must be a number`;
      }
      
      if (field.min !== undefined && value < field.min) {
        return `${field.label} must be at least ${field.min}`;
      }
      
      if (field.max !== undefined && value > field.max) {
        return `${field.label} must be at most ${field.max}`;
      }
      break;
      
    case 'tel':
      if (value && !/^[0-9+\-() ]+$/.test(value)) {
        return `${field.label} must be a valid phone number`;
      }
      break;
  }
  
  // Custom validation rule
  if (field.validation?.custom && value) {
    const customResult = field.validation.custom(value);
    if (typeof customResult === 'string') {
      return customResult;
    } else if (customResult === false) {
      return `${field.label} is invalid`;
    }
  }
  
  // Pattern validation
  if (field.validation?.pattern && value && !field.validation.pattern.test(value)) {
    return field.validation.message || `${field.label} is invalid`;
  }
  
  return '';
};

/**
 * Validates an entire form
 * 
 * @param fields Array of form field definitions
 * @param values Form values to validate
 * @returns Object with field IDs as keys and error messages as values
 */
export const validateForm = (fields: FormField[], values: FormValues): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  fields.forEach(field => {
    const value = values[field.id];
    const error = validateField(field, value);
    
    if (error) {
      errors[field.id] = error;
    }
  });
  
  return errors;
};

/**
 * Checks if a form has any validation errors
 * 
 * @param errors Validation errors object
 * @returns True if there are any errors, false otherwise
 */
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};

export default {
  validateField,
  validateForm,
  hasErrors
};
