"use client";

/**
 * useForms Hook
 * 
 * Custom hook for managing form definitions and submissions.
 * Provides functionality for creating, updating, and deleting forms.
 */

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define FormField interface
export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  order?: number;
}

// Define FormDefinition interface
export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for forms
const initialForms: FormDefinition[] = [
  {
    id: '1',
    name: 'Cabinet Installation Request',
    description: 'Form for requesting cabinet installation services',
    fields: [
      {
        id: 'field-1',
        type: 'text',
        label: 'Customer Name',
        placeholder: 'Enter full name',
        required: true,
      },
      {
        id: 'field-2',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter email address',
        required: true,
      },
      {
        id: 'field-3',
        type: 'tel',
        label: 'Phone Number',
        placeholder: 'Enter phone number',
        required: false,
      },
      {
        id: 'field-4',
        type: 'select',
        label: 'Cabinet Type',
        required: true,
        options: [
          { label: 'Wall Mounted', value: 'wall-mounted' },
          { label: 'Floor Standing', value: 'floor-standing' },
          { label: 'Corner Unit', value: 'corner-unit' },
        ],
      },
      {
        id: 'field-5',
        type: 'textarea',
        label: 'Additional Notes',
        placeholder: 'Enter any additional requirements or notes',
        required: false,
      },
    ],
    createdAt: '2025-05-28T10:00:00Z',
    updatedAt: '2025-05-28T10:00:00Z',
  },
  {
    id: '2',
    name: 'Component Order Form',
    description: 'Form for ordering cabinet components',
    fields: [
      {
        id: 'field-1',
        type: 'text',
        label: 'Order Reference',
        placeholder: 'Enter order reference',
        required: true,
      },
      {
        id: 'field-2',
        type: 'select',
        label: 'Component Type',
        required: true,
        options: [
          { label: 'Door Hinge', value: 'door-hinge' },
          { label: 'Handle', value: 'handle' },
          { label: 'Shelf', value: 'shelf' },
          { label: 'Panel', value: 'panel' },
        ],
      },
      {
        id: 'field-3',
        type: 'number',
        label: 'Quantity',
        placeholder: 'Enter quantity',
        required: true,
        validation: {
          min: 1,
          max: 100,
        },
      },
      {
        id: 'field-4',
        type: 'checkbox',
        label: 'Express Delivery',
        required: false,
      },
    ],
    createdAt: '2025-05-28T11:30:00Z',
    updatedAt: '2025-05-28T14:15:00Z',
  },
];

/**
 * Interface for form submission data
 */
export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook for managing forms
 */
export const useForms = () => {
  const [forms, setForms] = useState<FormDefinition[]>(initialForms);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load forms from API/database
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // For now, we're using the mock data
    setLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        setForms(initialForms);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load forms');
      setLoading(false);
    }
  }, []);

  /**
   * Create a new form
   */
  const createForm = (form: Omit<FormDefinition, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const now = new Date().toISOString();
      const newForm: FormDefinition = {
        id: uuidv4(),
        ...form,
        createdAt: now,
        updatedAt: now,
      };
      
      setForms([...forms, newForm]);
      setLoading(false);
      return newForm;
    } catch (err) {
      setError('Failed to create form');
      setLoading(false);
      return null;
    }
  };

  /**
   * Update an existing form
   */
  const updateForm = (id: string, updates: Partial<FormDefinition>) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const now = new Date().toISOString();
      const updatedForms = forms.map(form => {
        if (form.id === id) {
          return {
            ...form,
            ...updates,
            updatedAt: now,
          };
        }
        return form;
      });
      
      setForms(updatedForms);
      setLoading(false);
      return updatedForms.find(form => form.id === id) || null;
    } catch (err) {
      setError('Failed to update form');
      setLoading(false);
      return null;
    }
  };

  /**
   * Delete a form
   */
  const deleteForm = (id: string) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const updatedForms = forms.filter(form => form.id !== id);
      setForms(updatedForms);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to delete form');
      setLoading(false);
      return false;
    }
  };

  /**
   * Submit a form
   */
  const submitForm = (formId: string, data: Record<string, any>) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const now = new Date().toISOString();
      const newSubmission: FormSubmission = {
        id: uuidv4(),
        formId,
        data,
        createdAt: now,
        updatedAt: now,
      };
      
      setSubmissions([...submissions, newSubmission]);
      setLoading(false);
      return newSubmission;
    } catch (err) {
      setError('Failed to submit form');
      setLoading(false);
      return null;
    }
  };

  /**
   * Get form by ID
   */
  const getFormById = (id: string) => {
    return forms.find(form => form.id === id) || null;
  };

  /**
   * Get submissions for a form
   */
  const getFormSubmissions = (formId: string) => {
    return submissions.filter(submission => submission.formId === formId);
  };

  /**
   * Validate form data against form definition
   */
  const validateFormData = (formId: string, data: Record<string, any>) => {
    const form = getFormById(formId);
    if (!form) return { valid: false, errors: { _form: 'Form not found' } };
    
    const errors: Record<string, string> = {};
    let valid = true;
    
    form.fields.forEach(field => {
      const value = data[field.id];
      
      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        errors[field.id] = `${field.label} is required`;
        valid = false;
        return;
      }
      
      // Skip validation if field is empty and not required
      if (value === undefined || value === null || value === '') return;
      
      // Validate based on field type and validation rules
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors[field.id] = 'Please enter a valid email address';
            valid = false;
          }
          break;
          
        case 'number':
          const numValue = Number(value);
          if (isNaN(numValue)) {
            errors[field.id] = 'Please enter a valid number';
            valid = false;
          } else if (field.validation?.min !== undefined && numValue < field.validation.min) {
            errors[field.id] = `Value must be at least ${field.validation.min}`;
            valid = false;
          } else if (field.validation?.max !== undefined && numValue > field.validation.max) {
            errors[field.id] = `Value must be at most ${field.validation.max}`;
            valid = false;
          }
          break;
          
        case 'text':
        case 'textarea':
          if (field.validation?.minLength !== undefined && value.length < field.validation.minLength) {
            errors[field.id] = `Must be at least ${field.validation.minLength} characters`;
            valid = false;
          } else if (field.validation?.maxLength !== undefined && value.length > field.validation.maxLength) {
            errors[field.id] = `Must be at most ${field.validation.maxLength} characters`;
            valid = false;
          } else if (field.validation?.pattern) {
            try {
              const regex = new RegExp(field.validation.pattern);
              if (!regex.test(value)) {
                errors[field.id] = 'Please enter a valid value';
                valid = false;
              }
            } catch (err) {
              // Invalid regex pattern, skip validation
            }
          }
          break;
      }
    });
    
    return { valid, errors: valid ? {} : errors };
  };

  return {
    forms,
    submissions,
    loading,
    error,
    createForm,
    updateForm,
    deleteForm,
    submitForm,
    getFormById,
    getFormSubmissions,
    validateFormData,
  };
};

export default useForms;
