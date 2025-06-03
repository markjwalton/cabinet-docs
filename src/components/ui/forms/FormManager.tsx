"use client";

/**
 * FormManager Component with Fixed Module Structure
 * 
 * This component manages form state and submission.
 * Updated to use shared types from shared_document_types.ts
 * Removed unused parameters to fix TypeScript warnings
 */

import { useNotification } from '@/contexts/NotificationContext';
import { FormField, FormManagerProps } from '@/types/shared_document_types';
import React, { useState } from 'react';
import EnhancedFormRenderer from './EnhancedFormRenderer';

// Modified FormManagerProps interface to make endpoint truly optional
const FormManager: React.FC<FormManagerProps> = ({
  formName,
  // Removed unused endpoint parameter
  onSuccess,
  onError,
  initialData = {},
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel'
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const { showNotification } = useNotification();
  
  // Sample fields for demonstration
  const fields: FormField[] = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      order: 1,
      dbField: 'name',
      validation: { required: true }
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      order: 2,
      dbField: 'email',
      validation: { required: true, email: true }
    }
  ];
  
  // Handle form field change
  const handleChange = (fieldId: string, value: any) => {
    // Add explicit type annotation to prev parameter
    setFormData((prev: typeof initialData) => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[fieldId]) {
      // Add explicit type annotation to prev parameter
      setValidationErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        errors[field.id] = `${field.label} is required`;
      }
      
      // Add more validation logic as needed
    });
    
    setValidationErrors(errors);
    setShowValidationErrors(true);
    
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Submitting form:', formName, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification({
        type: 'success',
        title: 'Form Submitted',
        message: `${formName} has been submitted successfully.`
      });
      
      // Call onSuccess callback
      onSuccess(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      
      showNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'There was an error submitting the form. Please try again.'
      });
      
      // Call onError callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form cancel
  const handleCancel = () => {
    // Reset form data and validation errors
    setFormData(initialData);
    setValidationErrors({});
    setShowValidationErrors(false);
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <EnhancedFormRenderer
          fields={fields}
          formData={formData}
          onChange={handleChange}
          isSubmitting={isSubmitting}
          submitButtonText={submitButtonText}
          cancelButtonText={cancelButtonText}
          onCancel={handleCancel}
          title={formName}
          showValidationErrors={showValidationErrors}
          validationErrors={validationErrors}
        />
      </form>
    </div>
  );
};

// Ensure default export is present
export default FormManager;
