/**
 * FormBuilder Component
 * 
 * A reusable form component that supports:
 * - Configurable fields with different types
 * - Consistent validation
 * - Standardized layout and submission handling
 * - Support for different field types (text, number, dropdown, file upload)
 */

import React, { useState, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { FieldType, SelectOption, FormValues } from './FormField';

type FieldDefinition = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  defaultValue?: any;
  options?: SelectOption[]; // For select, radio
  min?: number; // For number
  max?: number; // For number
  step?: number; // For number
  accept?: string; // For file
  multiple?: boolean; // For file, select
  disabled?: boolean;
  className?: string;
  validation?: {
    pattern?: RegExp;
    message?: string;
    custom?: (value: any) => boolean | string;
  };
};

type FormBuilderProps = {
  fields: FieldDefinition[];
  onSubmit: (values: FormValues) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  initialValues?: FormValues;
  isLoading?: boolean;
  className?: string;
};

/**
 * FormBuilder component
 */
export default function FormBuilder({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  initialValues = {},
  isLoading = false,
  className = ''
}: FormBuilderProps) {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form with initial values
  useEffect(() => {
    const defaultValues: FormValues = {};
    
    fields.forEach(field => {
      if (initialValues[field.name] !== undefined) {
        defaultValues[field.name] = initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      } else {
        // Set appropriate default values based on field type
        switch (field.type) {
          case 'checkbox':
            defaultValues[field.name] = false;
            break;
          case 'number':
            defaultValues[field.name] = '';
            break;
          case 'select':
            defaultValues[field.name] = field.options && field.options.length > 0 
              ? field.options[0].value 
              : '';
            break;
          default:
            defaultValues[field.name] = '';
        }
      }
    });
    
    setValues(defaultValues);
  }, [fields, initialValues]);

  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValues(prev => ({ ...prev, [name]: checked }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error if value is valid
    validateField(name, type === 'checkbox' ? (e.target as HTMLInputElement).checked : value);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (files) {
      const field = fields.find(f => f.name === name);
      
      if (field?.multiple) {
        setValues(prev => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setValues(prev => ({ ...prev, [name]: files[0] || null }));
      }
      
      // Mark field as touched
      setTouched(prev => ({ ...prev, [name]: true }));
      
      // Clear error
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate a single field
  const validateField = (name: string, value: any): boolean => {
    const field = fields.find(f => f.name === name);
    if (!field) return true;
    
    let error = '';
    
    // Required validation
    if (field.required && (value === '' || value === null || value === undefined)) {
      error = `${field.label} is required`;
    }
    
    // Type-specific validation
    if (!error) {
      switch (field.type) {
        case 'email':
          if (value && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Please enter a valid email address';
          }
          break;
        case 'number':
          if (value && isNaN(Number(value))) {
            error = 'Please enter a valid number';
          }
          if (field.min !== undefined && value !== '' && Number(value) < field.min) {
            error = `Value must be at least ${field.min}`;
          }
          if (field.max !== undefined && value !== '' && Number(value) > field.max) {
            error = `Value must be at most ${field.max}`;
          }
          break;
        case 'file':
          // File validation would go here
          break;
      }
    }
    
    // Pattern validation
    if (!error && field.validation?.pattern && value && !field.validation.pattern.test(value)) {
      error = field.validation.message || `Invalid format for ${field.label}`;
    }
    
    // Custom validation
    if (!error && field.validation?.custom && value) {
      const customResult = field.validation.custom(value);
      if (customResult !== true) {
        error = typeof customResult === 'string' ? customResult : `Invalid value for ${field.label}`;
      }
    }
    
    // Update error state
    setErrors(prev => ({ ...prev, [name]: error }));
    
    return !error;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    fields.forEach(field => {
      const value = values[field.name];
      if (!validateField(field.name, value)) {
        isValid = false;
        // Get the current error for this field
        newErrors[field.name] = errors[field.name] || `Invalid value for ${field.label}`;
      }
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    fields.forEach(field => {
      newTouched[field.name] = true;
    });
    setTouched(newTouched);
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(values);
    }
  };

  // Render field based on type
  const renderField = (field: FieldDefinition) => {
    const { name, label, type, placeholder, helpText, required, options, disabled, className } = field;
    const value = values[name];
    const error = touched[name] ? errors[name] : '';
    
    const baseInputClasses = `block w-full rounded-md ${
      error 
        ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    } shadow-sm ${disabled ? 'bg-gray-100' : ''} ${className || ''}`;
    
    switch (type) {
      case 'textarea':
        return (
          <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 relative">
              <textarea
                id={name}
                name={name}
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled || isLoading}
                className={`${baseInputClasses} h-32`}
              />
              {error && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {(helpText || error) && (
              <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                {error || helpText}
              </p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 relative">
              <select
                id={name}
                name={name}
                value={value || ''}
                onChange={handleChange}
                required={required}
                disabled={disabled || isLoading}
                className={baseInputClasses}
                multiple={field.multiple}
              >
                {!field.multiple && !required && (
                  <option value="">Select...</option>
                )}
                {options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {error && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {(helpText || error) && (
              <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                {error || helpText}
              </p>
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id={name}
                name={name}
                type="checkbox"
                checked={!!value}
                onChange={handleChange}
                disabled={disabled || isLoading}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={name} className="font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              {(helpText || error) && (
                <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                  {error || helpText}
                </p>
              )}
            </div>
          </div>
        );
        
      case 'radio':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 space-y-2">
              {options?.map(option => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`${name}-${option.value}`}
                    name={name}
                    type="radio"
                    value={option.value}
                    checked={value === option.value}
                    onChange={handleChange}
                    disabled={disabled || isLoading}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor={`${name}-${option.value}`} className="ml-3 text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {(helpText || error) && (
              <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                {error || helpText}
              </p>
            )}
          </div>
        );
        
      case 'file':
        return (
          <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 relative">
              <input
                id={name}
                name={name}
                type="file"
                onChange={handleFileChange}
                required={required}
                disabled={disabled || isLoading}
                accept={field.accept}
                multiple={field.multiple}
                className={`${baseInputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100`}
              />
            </div>
            {(helpText || error) && (
              <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                {error || helpText}
              </p>
            )}
            {value && !field.multiple && (
              <div className="mt-2 text-sm text-gray-500">
                Selected file: {(value as File).name}
              </div>
            )}
            {value && field.multiple && Array.isArray(value) && value.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                Selected files: {value.length}
              </div>
            )}
          </div>
        );
        
      default: // text, email, password, number, date
        return (
          <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 relative">
              <input
                id={name}
                name={name}
                type={type}
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled || isLoading}
                min={field.min}
                max={field.max}
                step={field.step}
                className={baseInputClasses}
              />
              {error && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {(helpText || error) && (
              <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                {error || helpText}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.name}>
            {renderField(field)}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
