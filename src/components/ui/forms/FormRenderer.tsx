/**
 * FormRenderer Component with Fixed Types
 * 
 * This component renders a form based on field definitions.
 */

import React, { useState } from 'react';
import Button from '@/components/ui/buttons/Button';
import Checkbox from './Checkbox';
import Input from './Input';
import Select from './Select';

// Define local FormField interface to avoid type conflicts
interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean; // Note: required is not optional here
  order: number;
  dbField: string;
  isSystem?: boolean;
  hasData?: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

// Define FormRendererProps interface
export interface FormRendererProps {
  formName?: string;
  fields: FormField[];
  values?: Record<string, any>;
  onChange?: (fieldId: string, value: any) => void;
  onSubmit?: (values: Record<string, any>) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  errors?: Record<string, string>;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  formName,
  fields = [],
  values = {},
  onChange,
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  onCancel,
  errors = {}
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(values);
  
  // Sort fields by order
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);
  
  // Handle field value change
  const handleChange = (fieldId: string, value: any) => {
    const newValues = {
      ...formValues,
      [fieldId]: value
    };
    
    setFormValues(newValues);
    
    if (onChange) {
      onChange(fieldId, value);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      onSubmit(formValues);
    }
  };
  
  // Render a field based on its type
  const renderField = (field: FormField) => {
    const value = formValues[field.id] !== undefined ? formValues[field.id] : '';
    const error = errors[field.id];
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'date':
        return (
          <Input
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            error={error}
            helpText={field.helpText}
          />
        );
        
      case 'select':
        return (
          <Select
            key={field.id}
            id={field.id}
            label={field.label}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(field.id, e.target.value)}
            options={field.options || []}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            error={error}
            helpText={field.helpText}
          />
        );
        
      case 'checkbox':
        return (
          <Checkbox
            key={field.id}
            id={field.id}
            label={field.label}
            checked={!!value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.id, e.target.checked)}
            required={field.required}
            disabled={field.disabled}
            error={error}
            helpText={field.helpText}
          />
        );
        
      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={field.id}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.disabled}
              className={`w-full px-3 py-2 border rounded-md ${
                error ? 'border-red-500' : 'border-gray-300'
              } ${field.disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
              rows={4}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            {field.helpText && !error && <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formName && (
        <h2 className="text-xl font-semibold mb-4">{formName}</h2>
      )}
      
      {sortedFields.map(renderField)}
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            variant="secondary"
            onClick={onCancel}
            type="button"
          >
            {cancelButtonText}
          </Button>
        )}
        
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default FormRenderer;

