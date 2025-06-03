/**
 * EnhancedFormRenderer Component with Fixed Imports and Parameters
 * 
 * This component renders form fields and handles validation.
 * All imports, props, and parameter issues have been fixed.
 */

import React, { useState } from 'react';
// Removed unused imports
import Button from '@/components/ui/buttons/Button';
import Checkbox from '@/components/ui/forms/Checkbox';
import Input from '@/components/ui/forms/Input';
import Select from '@/components/ui/forms/Select';
// Use textarea directly instead of importing TextArea component
// import TextArea from '@/components/ui/forms/TextArea';

// Updated FormRendererProps to include all required properties
export interface FormRendererProps {
  fields: any[];
  formData: any; // Added required formData property
  onChange: (fieldId: string, value: any) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  title?: string; // Added title property
  showValidationErrors?: boolean;
  validationErrors?: Record<string, string>;
}

// Updated FormField interface with validation property
export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  options?: { value: string; label: string }[];
  dbField: string; // Added required dbField property
  validation?: any; // Changed from validationRules to validation
}

const EnhancedFormRenderer: React.FC<FormRendererProps> = ({
  fields,
  formData,
  onChange,
  isSubmitting = false,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  onCancel,
  title,
  showValidationErrors = false,
  validationErrors = {}
}) => {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  // Handle field change - fixed to pass both parameters
  const handleChange = (fieldId: string, value: any) => {
    setTouchedFields({
      ...touchedFields,
      [fieldId]: true
    });
    
    // Fixed: Pass both parameters as expected
    onChange(fieldId, value);
  };
  
  // Render field based on type
  const renderField = (field: FormField) => {
    const fieldValue = formData?.[field.id] || '';
    const error = touchedFields[field.id] && showValidationErrors
      ? validationErrors[field.id]
      : undefined;
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            label={field.label}
            type="text"
            value={fieldValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.id, e.target.value)}
            required={field.required}
            error={error}
          />
        );
        
      case 'textarea':
        return (
          // Use native textarea instead of TextArea component
          <div className="form-field">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={field.id}
              value={fieldValue}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(field.id, e.target.value)}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${error ? 'border-red-300' : ''}`}
              rows={4}
              required={field.required}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );
        
      case 'select':
        return (
          <Select
            id={field.id}
            label={field.label}
            value={fieldValue}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(field.id, e.target.value)}
            options={field.options || []}
            required={field.required}
            error={error}
          />
        );
        
      case 'checkbox':
        return (
          <Checkbox
            id={field.id}
            label={field.label}
            checked={!!fieldValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.id, e.target.checked)}
            error={error}
          />
        );
        
      default:
        return (
          <Input
            id={field.id}
            label={field.label}
            type="text"
            value={fieldValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.id, e.target.value)}
            required={field.required}
            error={error}
          />
        );
    }
  };
  
  // Fixed: Added null check for fields array
  const sortedFields = fields && fields.length > 0 
    ? [...fields].sort((a, b) => a.order - b.order)
    : [];
  
  return (
    <div className="space-y-6">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      {fields && fields.length > 0 ? (
        <div className="space-y-4">
          {sortedFields.map((field) => (
            <div key={field.id} className="form-field">
              {renderField(field)}
            </div>
          ))}
          
          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
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
        </div>
      ) : (
        <p className="text-gray-500">No fields defined for this form.</p>
      )}
    </div>
  );
};

export default EnhancedFormRenderer;
