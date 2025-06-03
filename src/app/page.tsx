// src/app/page.tsx
"use client";

import React from 'react';
// Removing unused Link import
import { FileText, Package, Settings, BarChart } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
// Removed unused import: import { useNavigation } from '@/contexts/NavigationContext';

/**
 * Home Page Component
 * 
 * Landing page for the Wall Mounted Cabinet Management Tool.
 */
export default function HomePage() {
  // Removed unused variable: const { navigate } = useNavigation();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Wall Mounted Cabinet Management Tool
        </h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
          A comprehensive solution for managing cabinet components, documents, and inventory
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Document Management */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <FileText className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Document Management</h2>
          <p className="text-secondary-600 mb-6">
            Upload, organize, and access documents related to cabinet components and installations
          </p>
          <Button 
            variant="primary" 
            href="/documents"
          >
            View Documents
          </Button>
        </div>
        
        {/* Inventory Management */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <Package className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Inventory Management</h2>
          <p className="text-secondary-600 mb-6">
            Track component stock levels, manage inventory, and monitor reorder points
          </p>
          <Button 
            variant="primary" 
            href="/inventory"
          >
            View Inventory
          </Button>
        </div>
        
        {/* Administration */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <Settings className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Administration</h2>
          <p className="text-secondary-600 mb-6">
            Configure forms, manage dropdown lists, and administer system settings
          </p>
          <Button 
            variant="primary" 
            href="/admin"
          >
            Admin Dashboard
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <BarChart className="w-6 h-6 mr-2 text-primary-600" />
          System Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <p className="text-secondary-600 mb-4">
              Manage technical specifications, installation guides, and maintenance documents
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Components</h3>
            <p className="text-secondary-600 mb-4">
              Track cabinet components including hardware, panels, shelves, and accessories
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Inventory</h3>
            <p className="text-secondary-600 mb-4">
              Monitor stock levels, track usage, and manage reordering of components
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          variant="primary" 
          size="large" 
          href="/documentation"
        >
          View Documentation
        </Button>
      </div>
    </div>
  );
}
