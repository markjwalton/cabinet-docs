/**
 * Documentation Page Component
 * 
 * A component for displaying the architecture documentation and troubleshooting guide.
 * Provides easy access to project documentation for developers.
 */

import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/cards/Card';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';

/**
 * Documentation page component
 */
const DocumentationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Documentation', href: '/documentation' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <h1 className="text-3xl font-bold mb-8">Project Documentation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/documentation/architecture" className="block">
          <Card clickable>
            <div className="flex items-start">
              <FileText className="w-8 h-8 text-primary-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Architecture Documentation</h2>
                <p className="text-secondary-600">
                  Comprehensive guide to the project architecture, component structure, and design patterns.
                </p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link href="/documentation/troubleshooting" className="block">
          <Card clickable>
            <div className="flex items-start">
              <AlertTriangle className="w-8 h-8 text-warning-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Troubleshooting Guide</h2>
                <p className="text-secondary-600">
                  Solutions for common issues including dependency conflicts, TypeScript errors, and Supabase integration problems.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Supabase Integration</h2>
        <Card>
          <h3 className="text-lg font-medium mb-4">Connection Details</h3>
          <div className="bg-secondary-50 p-4 rounded-md font-mono text-sm mb-4">
            <p className="mb-2">URL: https://wdspmqtdefkcasgubbme.supabase.co</p>
            <p>Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkc3BtcXRkZWZrY2FzZ3ViYm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTEwOTgsImV4cCI6MjA2NDA2NzA5OH0.MVxDuOjHeOdPrPSdOZzmVl9rgexqsCQOYC-AKW6tT8E</p>
          </div>
          
          <h3 className="text-lg font-medium mb-4">Usage Example</h3>
          <div className="bg-secondary-900 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
            <pre>{`import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wdspmqtdefkcasgubbme.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)`}</pre>
          </div>
        </Card>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Component Library</h2>
        <Card>
          <p className="mb-4">
            The project includes a comprehensive set of UI components built with Tailwind CSS.
            These components are designed to be reusable, accessible, and visually consistent.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-secondary-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Layout Components</h3>
              <ul className="list-disc list-inside text-secondary-600">
                <li>Navbar</li>
                <li>Breadcrumb</li>
                <li>Card</li>
                <li>Modal</li>
              </ul>
            </div>
            
            <div className="border border-secondary-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Form Components</h3>
              <ul className="list-disc list-inside text-secondary-600">
                <li>Input</li>
                <li>Select</li>
                <li>Checkbox</li>
                <li>Button</li>
              </ul>
            </div>
            
            <div className="border border-secondary-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Data Components</h3>
              <ul className="list-disc list-inside text-secondary-600">
                <li>Table</li>
                <li>DocumentList</li>
                <li>DocumentPreview</li>
                <li>DocumentFilter</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentationPage;
