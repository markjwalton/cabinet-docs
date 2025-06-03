"use client";

import DocumentUpload from '@/components/documents/DocumentUpload';
import { useNotification } from '@/contexts/NotificationContext';
import { Document } from '@/types/shared_document_types';
import { useRouter } from 'next/navigation';
import React from 'react';

const DocumentUploadPage: React.FC = () => {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const handleUpload = (document: Document) => {
    showNotification({
      type: 'success',
      title: 'Document Uploaded',
      message: `${document.name} has been uploaded successfully.`
    });
    
    router.push('/documents');
  };
  
  // Sample categories and tags for demonstration
  const categories = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'contract', label: 'Contract' },
    { value: 'report', label: 'Report' },
    { value: 'other', label: 'Other' }
  ];
  
  const availableTags = [
    'important',
    'urgent',
    'draft',
    'final',
    'archived'
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Document</h1>
      
      <DocumentUpload
        categories={categories}
        availableTags={availableTags}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default DocumentUploadPage;
