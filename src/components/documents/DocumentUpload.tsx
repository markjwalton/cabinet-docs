/**
 * DocumentUpload Component with Fixed Imports and Explicit Type Exports
 * 
 * This component handles document uploads with metadata.
 * Updated to use shared types from shared_document_types.ts
 */

import Button from '@/components/ui/buttons/Button';
import Card from '@/components/ui/cards/Card';
import { Document, DocumentUploadProps } from '@/types/shared_document_types';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Explicitly typed as React.FC<DocumentUploadProps>
const DocumentUpload: React.FC<DocumentUploadProps> = ({
  categories,
  availableTags,
  onUpload
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill name from filename if empty
      if (!name) {
        const fileName = selectedFile.name;
        const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        setName(nameWithoutExtension);
      }
    }
  };
  
  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!file) {
      newErrors.file = 'Please select a file to upload';
    }
    
    if (!name.trim()) {
      newErrors.name = 'Document name is required';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!file) return;
    
    // Create document object
    const document: Document = {
      id: uuidv4(),
      name,
      category,
      description,
      tags: selectedTags,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadDate: new Date().toISOString(),
      dateUploaded: new Date().toISOString(),
      status: 'active',
      uploadedBy: 'Current User', // In a real app, this would come from auth context
      url: URL.createObjectURL(file) // In a real app, this would be a server URL
    };
    
    // Call onUpload callback
    onUpload(document);
    
    // Reset form
    setFile(null);
    setName('');
    setCategory('');
    setDescription('');
    setSelectedTags([]);
    setErrors({});
    
    // Reset file input
    const fileInput = window.document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  return (
    <Card>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File <span className="text-red-500">*</span>
              </label>
              <input
                id="file-upload"
                type="file"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
                onChange={handleFileChange}
              />
              {errors.file && (
                <p className="mt-1 text-sm text-red-600">{errors.file}</p>
              )}
              {file && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            
            {/* Document Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  errors.name ? 'border-red-300' : ''
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  errors.category ? 'border-red-300' : ''
                }`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
              >
                Upload Document
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
};

// Ensure default export is present
export default DocumentUpload;
