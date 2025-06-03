/**
 * useFormManagement Hook
 * 
 * This custom hook provides form management functionality for the application.
 */

import { FormDefinition, FormSubmissionResult, FormValues } from '@/types/forms';
import { hasErrors, validateForm } from '@/utils/formValidation';
import { useState } from 'react';

interface UseFormManagementProps {
  formDefinition: FormDefinition;
  initialData?: FormValues;
  onSubmit?: (values: FormValues) => Promise<FormSubmissionResult>;
}

interface UseFormManagementReturn {
  values: FormValues;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (fieldId: string, value: any) => void;
  handleSubmit: () => Promise<FormSubmissionResult>;
  resetForm: () => void;
  setFieldValue: (fieldId: string, value: any) => void;
  setFieldError: (fieldId: string, error: string) => void;
  validateField: (fieldId: string) => boolean;
  validateAllFields: () => boolean;
}

/**
 * Custom hook for form management
 */
export const useFormManagement = ({
  formDefinition,
  initialData = {},
  onSubmit
}: UseFormManagementProps): UseFormManagementReturn => {
  // Initialize form values from initialData or empty object
  const [values, setValues] = useState<FormValues>(() => {
    const initialValues: FormValues = {};
    
    // Set default values for all fields
    formDefinition.fields.forEach((field) => {
      // Use initial data if available, otherwise use empty value based on field type
      if (initialData && initialData[field.id] !== undefined) {
        initialValues[field.id] = initialData[field.id];
      } else {
        switch (field.type) {
          case 'checkbox':
            initialValues[field.id] = false;
            break;
          case 'select':
            initialValues[field.id] = field.options && field.options.length > 0 ? field.options[0].value : '';
            break;
          case 'number':
            initialValues[field.id] = '';
            break;
          default:
            initialValues[field.id] = '';
        }
      }
    });
    
    return initialValues;
  });
  
  // State for form errors and submission status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Reset form to initial values
  const resetForm = () => {
    setValues(() => {
      const initialValues: FormValues = {};
      
      formDefinition.fields.forEach((field) => {
        if (initialData && initialData[field.id] !== undefined) {
          initialValues[field.id] = initialData[field.id];
        } else {
          switch (field.type) {
            case 'checkbox':
              initialValues[field.id] = false;
              break;
            case 'select':
              initialValues[field.id] = field.options && field.options.length > 0 ? field.options[0].value : '';
              break;
            case 'number':
              initialValues[field.id] = '';
              break;
            default:
              initialValues[field.id] = '';
          }
        }
      });
      
      return initialValues;
    });
    
    setErrors({});
  };
  
  // Handle field value change
  const handleChange = (fieldId: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error for this field when value changes
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };
  
  // Set a specific field value
  const setFieldValue = (fieldId: string, value: any) => {
    handleChange(fieldId, value);
  };
  
  // Set a specific field error
  const setFieldError = (fieldId: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldId]: error
    }));
  };
  
  // Validate a specific field
  const validateField = (fieldId: string): boolean => {
    const field = formDefinition.fields.find(f => f.id === fieldId);
    
    if (!field) {
      return true; // Field not found, no validation needed
    }
    
    const value = values[fieldId];
    const fieldErrors = validateForm([field], { [fieldId]: value });
    
    if (fieldErrors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: fieldErrors[fieldId]
      }));
      return false;
    } else {
      // Clear error for this field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
      return true;
    }
  };
  
  // Validate all fields
  const validateAllFields = (): boolean => {
    const formErrors = validateForm(formDefinition.fields, values);
    setErrors(formErrors);
    return !hasErrors(formErrors);
  };
  
  // Handle form submission
  const handleSubmit = async (): Promise<FormSubmissionResult> => {
    // Validate all fields
    const isValid = validateAllFields();
    
    if (!isValid) {
      return {
        success: false,
        message: 'Please fix the errors in the form'
      };
    }
    
    if (!onSubmit) {
      return {
        success: true,
        data: values
      };
    }
    
    try {
      setIsSubmitting(true);
      const result = await onSubmit(values);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateField,
    validateAllFields
  };
};

export default useFormManagement;
