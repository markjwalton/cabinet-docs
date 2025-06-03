"use client";

import DocumentFilter from '@/components/documents/DocumentFilter';
import DocumentList from '@/components/documents/DocumentList';
import Button from '@/components/ui/buttons/Button';
import { useNotification } from '@/contexts/NotificationContext';
import { Document as AppDocument, FilterOptions } from '@/types/shared_document_types';
import Link from 'next/link';
import React from 'react';

const DocumentsPage: React.FC = () => {
  // Sample documents data
  const documents: AppDocument[] = [
    {
      id: '1',
      name: 'Invoice #12345',
      category: 'invoice',
      tags: ['important', 'finance'],
      fileName: 'invoice-12345.pdf',
      fileSize: 1024 * 1024 * 2.5, // 2.5 MB
      fileType: 'application/pdf',
      uploadDate: '2023-05-15T10:30:00Z',
      dateUploaded: '2023-05-15T10:30:00Z',
      status: 'active',
      description: 'Monthly invoice for May 2023',
      uploadedBy: 'John Doe',
      url: 'https://example.com/files/invoice-12345.pdf'
    },
    // Add more sample documents as needed
  ];
  
  // Sample categories
  const categories = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'contract', label: 'Contract' },
    { value: 'report', label: 'Report' },
    { value: 'other', label: 'Other' }
  ];
  
  // Sample tags
  const availableTags = [
    'important',
    'urgent',
    'draft',
    'final',
    'archived',
    'finance',
    'legal',
    'marketing'
  ];
  
  // Filter state
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>({
    category: '',
    dateRange: '',
    searchTerm: '',
    tags: []
  });
  
  // Notification context
  const { showNotification } = useNotification();
  
  // Handle filter change
  const handleFilterChange = (newOptions: FilterOptions) => {
    setFilterOptions(newOptions);
  };
  
  // Handle document selection
  const handleSelectDocument = (document: AppDocument) => {
    console.log('Selected document:', document);
  };
  
  // Handle document download
  const handleDownload = (document: AppDocument) => {
    // In a real app, this would trigger a download
    console.log('Downloading document:', document);
    
    // Create a temporary link element
    const link = window.document.createElement('a');
    link.href = document.url || '#';
    link.download = document.fileName;
    link.click();
    
    showNotification({
      type: 'success',
      title: 'Download Started',
      message: `${document.name} is being downloaded.`
    });
  };
  
  // Handle document view
  const handleView = (document: AppDocument) => {
    // In a real app, this would open the document
    console.log('Viewing document:', document);
    
    showNotification({
      type: 'info',
      title: 'Opening Document',
      message: `Opening ${document.name} for viewing.`
    });
  };
  
  // Filter documents based on filter options
  const filteredDocuments = documents.filter(doc => {
    // Filter by category
    if (filterOptions.category && doc.category !== filterOptions.category) {
      return false;
    }
    
    // Filter by search term
    if (filterOptions.searchTerm) {
      const searchTerm = filterOptions.searchTerm.toLowerCase();
      const nameMatch = doc.name.toLowerCase().includes(searchTerm);
      const descMatch = doc.description?.toLowerCase().includes(searchTerm) || false;
      
      if (!nameMatch && !descMatch) {
        return false;
      }
    }
    
    // Filter by tags
    if (filterOptions.tags.length > 0) {
      const hasAllTags = filterOptions.tags.every(tag => doc.tags.includes(tag));
      if (!hasAllTags) {
        return false;
      }
    }
    
    // Filter by date range (simplified for demo)
    if (filterOptions.dateRange) {
      // Implement date range filtering logic here
      // This is a simplified example
      const today = new Date();
      const docDate = new Date(doc.uploadDate);
      
      switch (filterOptions.dateRange) {
        case 'today':
          if (docDate.toDateString() !== today.toDateString()) {
            return false;
          }
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          if (docDate < weekAgo) {
            return false;
          }
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);
          if (docDate < monthAgo) {
            return false;
          }
          break;
        // Add more date range options as needed
      }
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Link href="/documents/upload">
          <Button variant="primary">Upload Document</Button>
        </Link>
      </div>
      
      <DocumentFilter
        categories={categories}
        availableTags={availableTags}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      
      <DocumentList
        documents={filteredDocuments}
        categories={categories}
        onSelectDocument={handleSelectDocument}
        onDownload={handleDownload}
        onView={handleView}
        allowDelete={false}
      />
    </div>
  );
};

export default DocumentsPage;
