/**
 * Centralized Type Definitions for Forms System
 * 
 * This file contains all type definitions related to the forms system,
 * ensuring consistency across components.
 */

// Basic field option type for select, radio, and checkbox fields
export interface FieldOption {
  value: string;
  label: string;
}

// Validation rule definition
export interface ValidationRule {
  pattern?: RegExp;
  message?: string;
  custom?: (value: any) => boolean | string;
}

// Form field definition
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
  options?: FieldOption[];
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  validation?: ValidationRule;
}

// Field type enumeration
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

// Form definition
export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  table_name: string;
  is_system?: boolean;
  fields: FormField[];
  created_at?: string;
  updated_at?: string;
}

// Table information for form association
export interface TableInfo {
  name: string;
  display_name: string;
  description?: string;
}

// Form values type
export type FormValues = Record<string, any>;

// Form submission result
export interface FormSubmissionResult {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Record<string, string>;
}

// Props for Input component
export interface InputProps {
  id: string;
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  error?: string;
  helpText?: string;
}

// Props for Select component
export interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: FieldOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
}

// Props for Checkbox component
export interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
}

// Props for Radio component
export interface RadioProps {
  id: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
}

// Props for FileInput component
export interface FileInputProps {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
}

// Props for DateInput component
export interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
  error?: string;
  helpText?: string;
}

// Props for FormRenderer component
export interface FormRendererProps {
  formName?: string;
  fields?: FormField[];
  values?: FormValues;
  onChange?: (values: FormValues) => void;
  onSubmit?: (values: FormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  errors?: Record<string, string>;
}

// Props for FormBuilder component
export interface FormBuilderProps {
  form: FormDefinition;
  availableTables?: TableInfo[];
  onFieldsChange: (fields: FormField[]) => void;
}

// Props for DocumentList component
export interface DocumentListProps {
  documents: {
    id: string;
    name: string;
    category: string;
    uploadDate: string;
    size: number;
    type: string;
    url?: string;
  }[];
  onDelete: (documentId: string) => void;
  onDownload: (document: any) => void;
  onView: (document: any) => void;
}

// Props for DocumentFilter component
export interface DocumentFilterProps {
  categories: FieldOption[];
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

// Props for DocumentUpload component
export interface DocumentUploadProps {
  categories: FieldOption[];
  onUpload: (document: any) => void;
}

// Legacy Form interface for backward compatibility
export interface Form {
  id: string;
  name: string;
  description?: string;
  table_name: string;
  is_system?: boolean;
  fields: FormField[];
}

// Data context type
export interface DataContextType {
  // Add methods that should be available in DataContext
  addProduct?: (product: any) => Promise<any>;
  updateProduct?: (id: string, product: any) => Promise<any>;
  deleteProduct?: (id: string) => Promise<any>;
  
  addOrder?: (order: any) => Promise<any>;
  updateOrder?: (id: string, order: any) => Promise<any>;
  deleteOrder?: (id: string) => Promise<any>;
  
  // Add other methods as needed
}
