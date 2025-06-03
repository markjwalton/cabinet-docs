/**
 * Shared Document Types
 * 
 * This file contains shared interfaces for document-related and form-related components.
 * All components should import their types from this file
 * to ensure consistency across the application.
 */

// Document interface with all required properties
export interface Document {
  id: string;
  name: string;
  category: string;
  tags: string[];
  fileName: string;
  fileSize: number; // Must be number, not string
  fileType: string;
  uploadDate: string;
  dateUploaded: string; // Required property
  status: string; // Required property
  description?: string; // Optional property
  uploadedBy?: string; // Added optional property
  url?: string; // Added optional property
}

// Filter options interface with tags property
export interface FilterOptions {
  category: string;
  dateRange: string;
  searchTerm: string;
  tags: string[]; // Added required property
}

// DocumentFilter props interface
export interface DocumentFilterProps {
  categories: { value: string; label: string }[];
  availableTags: string[]; // Required property
  filterOptions: FilterOptions;
  onFilterChange: (newOptions: FilterOptions) => void;
}

// DocumentList props interface
export interface DocumentListProps {
  documents: Document[];
  categories: { value: string; label: string }[];
  onSelectDocument?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onView?: (document: Document) => void;
  onDelete?: (id: string) => void;
  allowDelete?: boolean;
  allowEdit?: boolean;
}

// DocumentUpload props interface
export interface DocumentUploadProps {
  categories: { value: string; label: string }[];
  availableTags: string[];
  onUpload: (document: Document) => void;
}

// FormManagerProps interface for form components
export interface FormManagerProps {
  formName: string;
  endpoint?: string;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
  initialData?: any;
  submitButtonText?: string;
  cancelButtonText?: string;
}

// FormRendererProps interface for EnhancedFormRenderer
export interface FormRendererProps {
  fields: any[];
  formData: any;
  onChange: (fieldId: string, value: any) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  title?: string;
  showValidationErrors?: boolean;
  validationErrors?: Record<string, string>;
}

// FormField interface for form components
export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  options?: { value: string; label: string }[];
  dbField: string;
  validation?: any;
}
