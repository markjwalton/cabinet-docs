/**
 * Shared FormField interface for consistent field definitions across components
 */

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
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
  validation?: {
    pattern?: RegExp;
    message?: string;
    custom?: (value: any) => boolean | string;
  };
}

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'file'
  | 'tel';

export interface SelectOption {
  value: string;
  label: string;
}

export type FormValues = Record<string, any>;
