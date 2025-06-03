/**
 * FileUpload Component
 * 
 * A reusable file upload component that supports:
 * - Drag and drop functionality
 * - File preview
 * - Multiple file selection
 * - Integration with FormBuilder
 */

import React, { useState, useRef } from 'react';
import { DocumentIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

// Types for the component
export type FileUploadProps = {
  onChange: (files: File[]) => void;
  value?: File | File[];
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  label?: string;
  helpText?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
};

/**
 * Format file size to human-readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * FileUpload component
 */
export default function FileUpload({
  onChange,
  value,
  multiple = false,
  accept,
  maxSize,
  maxFiles = 5,
  label = 'Upload files',
  helpText,
  error,
  className = '',
  disabled = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Convert value to array for consistent handling
  const files = value 
    ? (Array.isArray(value) ? value : [value])
    : [];
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };
  
  // Validate files
  const validateFiles = (fileList: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    // Convert FileList to array
    const filesArray = Array.from(fileList);
    
    // Check max files
    if (multiple && filesArray.length > maxFiles) {
      errors.push(`You can only upload up to ${maxFiles} files at once.`);
      return validFiles;
    }
    
    // Validate each file
    for (const file of filesArray) {
      // Check file type
      if (accept) {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileExtension = '.' + file.name.split('.').pop();
        
        const isValidType = acceptTypes.some(type => {
          if (type.startsWith('.')) {
            // Extension check
            return fileExtension.toLowerCase() === type.toLowerCase();
          } else if (type.includes('*')) {
            // Wildcard MIME type check
            const [mainType, subType] = type.split('/');
            const [fileMainType, fileSubType] = fileType.split('/');
            return mainType === fileMainType && (subType === '*' || subType === fileSubType);
          } else {
            // Exact MIME type check
            return fileType === type;
          }
        });
        
        if (!isValidType) {
          errors.push(`File "${file.name}" has an invalid type. Accepted types: ${accept}`);
          continue;
        }
      }
      
      // Check file size
      if (maxSize && file.size > maxSize) {
        errors.push(`File "${file.name}" exceeds the maximum size of ${formatFileSize(maxSize)}.`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    setFileErrors(errors);
    return validFiles;
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = validateFiles(e.dataTransfer.files);
      
      if (validFiles.length > 0) {
        if (multiple) {
          // Combine with existing files if multiple
          onChange([...files, ...validFiles].slice(0, maxFiles));
        } else {
          // Replace existing file if single
          onChange([validFiles[0]]);
        }
      }
    }
  };
  
  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      
      if (validFiles.length > 0) {
        if (multiple) {
          // Combine with existing files if multiple
          onChange([...files, ...validFiles].slice(0, maxFiles));
        } else {
          // Replace existing file if single
          onChange([validFiles[0]]);
        }
      }
    }
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };
  
  // Handle click on upload area
  const handleUploadClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div
        className={`border-2 border-dashed rounded-md p-6 ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <div className="text-center">
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or <span className="text-indigo-600 font-medium">browse</span> to upload
            </p>
            {helpText && (
              <p className="text-xs text-gray-500 mt-1">{helpText}</p>
            )}
            {accept && (
              <p className="text-xs text-gray-500 mt-1">
                Accepted file types: {accept}
              </p>
            )}
            {maxSize && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: {formatFileSize(maxSize)}
              </p>
            )}
            {multiple && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum files: {maxFiles}
              </p>
            )}
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
      </div>
      
      {/* Error messages */}
      {(error || fileErrors.length > 0) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {fileErrors.map((err, index) => (
            <p key={index} className="text-sm text-red-600">{err}</p>
          ))}
        </div>
      )}
      
      {/* File previews */}
      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-gray-100 border border-gray-200 rounded-md">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
              <div className="flex items-center flex-1 min-w-0">
                <DocumentIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="ml-2 flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-gray-500 truncate">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  disabled={disabled}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
