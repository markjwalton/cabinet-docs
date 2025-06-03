"use client";

/**
 * Admin Documentation Page Component
 * 
 * This page provides administrative functions for managing system documentation,
 * user guides, and technical specifications.
 */

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Card from '@/components/ui/cards/Card';
import Button from '@/components/ui/buttons/Button';
import { FileText, Plus, Settings, Upload, Download, X } from 'lucide-react';
// Removed unused import: import { useNavigation } from '@/contexts/NavigationContext';

/**
 * AdminDocumentationPage component
 */
export default function AdminDocumentationPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  // Removed unused variable: const { navigate } = useNavigation();

  // Sample documentation items for demonstration
  const documentationItems = [
    { 
      id: '1', 
      title: 'User Manual', 
      description: 'Complete guide for cabinet management system users',
      lastUpdated: '15 May 2025',
      author: 'System Admin',
      format: 'PDF',
      size: '2.4 MB'
    },
    { 
      id: '2', 
      title: 'Installation Guide', 
      description: 'Step-by-step instructions for cabinet installation',
      lastUpdated: '10 April 2025',
      author: 'Technical Team',
      format: 'PDF',
      size: '1.8 MB'
    },
    { 
      id: '3', 
      title: 'Maintenance Procedures', 
      description: 'Regular maintenance tasks for cabinet hardware',
      lastUpdated: '22 March 2025',
      author: 'Maintenance Dept',
      format: 'DOCX',
      size: '1.2 MB'
    },
    { 
      id: '4', 
      title: 'Technical Specifications', 
      description: 'Detailed specifications for all cabinet components',
      lastUpdated: '5 February 2025',
      author: 'Engineering Team',
      format: 'XLSX',
      size: '3.5 MB'
    },
  ];

  // Handle opening the add documentation modal
  const handleAddDocumentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setShowAddModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Documentation', href: '/admin/documentation' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Documentation Management</h1>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Settings className="w-5 h-5" />}
          >
            Settings
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddDocumentClick}
          >
            Add Document
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-6">
          <p className="text-secondary-600">
            Manage system documentation, user guides, and technical specifications. Keeping documentation up-to-date ensures users have access to accurate information.
          </p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        {documentationItems.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4 mt-1">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{doc.title}</h2>
                    <p className="text-secondary-600 mt-1">
                      {doc.description}
                    </p>
                    <div className="flex flex-col mt-2 text-secondary-500">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Last Updated:</span> 
                        {doc.lastUpdated}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="font-medium mr-2">Author:</span> 
                        {doc.author}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-2">
                          {doc.format}
                        </span>
                        <span className="text-sm">{doc.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="small"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Download
                  </Button>
                  <Button variant="outline" size="small">
                    Edit
                  </Button>
                  <Button variant="outline" size="small">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Documentation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Add Documentation</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Title
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter document title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Enter document description"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter author name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Document
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, XLSX up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                >
                  Add Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
