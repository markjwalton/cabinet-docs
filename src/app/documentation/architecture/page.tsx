/**
 * Architecture Documentation Page Component
 * 
 * A component for displaying the detailed architecture documentation.
 * Provides comprehensive information about the project structure and design.
 */

import React from 'react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Card from '@/components/ui/cards/Card';

/**
 * Architecture documentation page component
 */
const ArchitectureDocumentationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Documentation', href: '/documentation' },
          { label: 'Architecture', href: '/documentation/architecture' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <h1 className="text-3xl font-bold mb-8">Wall Mounted Cabinet Management Tool Architecture</h1>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
        <p className="mb-4">
          The Wall Mounted Cabinet Management Tool is a comprehensive web application designed to manage cabinet components, 
          documents, and inventory. It provides a user-friendly interface for tracking cabinet installations, managing component 
          inventory, and storing related documentation.
        </p>
        <p>
          This architecture document outlines the structure, components, and design patterns used in the application to ensure 
          consistency, maintainability, and scalability.
        </p>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Frontend</h3>
            <ul className="list-disc list-inside space-y-1 text-secondary-700">
              <li>Next.js (React framework)</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Headless UI</li>
              <li>Lucide React (icons)</li>
              <li>React Beautiful DnD</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Backend & Data</h3>
            <ul className="list-disc list-inside space-y-1 text-secondary-700">
              <li>Supabase (Backend-as-a-Service)</li>
              <li>PostgreSQL (via Supabase)</li>
              <li>Supabase Storage</li>
              <li>Supabase Authentication</li>
            </ul>
          </div>
        </div>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Project Structure</h2>
        <div className="bg-secondary-50 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
          <pre>{`cabinet-skeleton-ui/
├── public/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/              # Admin pages
│   │   ├── documents/          # Document management pages
│   │   ├── inventory/          # Inventory management pages
│   │   ├── documentation/      # Documentation pages
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── admin/              # Admin-specific components
│   │   ├── documents/          # Document-related components
│   │   ├── inventory/          # Inventory-related components
│   │   └── ui/                 # Core UI components
│   │       ├── buttons/        # Button components
│   │       ├── cards/          # Card components
│   │       ├── forms/          # Form input components
│   │       ├── layout/         # Layout components
│   │       └── tables/         # Table components
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility libraries
│       └── supabase/           # Supabase integration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies`}</pre>
        </div>
        <p>
          The project follows a modular structure with clear separation of concerns. Components are organized by feature 
          and functionality, making it easy to locate and maintain specific parts of the application.
        </p>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Core UI Components</h2>
        <p className="mb-4">
          The application includes a comprehensive set of reusable UI components that follow consistent design patterns:
        </p>
        
        <h3 className="text-lg font-medium mb-2">Button Component</h3>
        <p className="mb-4">
          A flexible button component with various styles, sizes, and states. Supports icons, loading states, and different variants.
        </p>
        <div className="bg-secondary-50 p-4 rounded-md font-mono text-sm overflow-x-auto mb-6">
          <pre>{`<Button
  variant="primary"
  size="md"
  isLoading={false}
  icon={<Upload className="w-5 h-5" />}
  onClick={handleUpload}
>
  Upload Document
</Button>`}</pre>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Card Component</h3>
        <p className="mb-4">
          A container component for grouping related content with consistent styling. Supports headers, footers, and actions.
        </p>
        <div className="bg-secondary-50 p-4 rounded-md font-mono text-sm overflow-x-auto mb-6">
          <pre>{`<Card
  title="Document Details"
  subtitle="View and manage document information"
  actions={<Button variant="outline" size="sm">Edit</Button>}
>
  <p>Card content goes here</p>
</Card>`}</pre>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Form Components</h3>
        <p className="mb-4">
          A set of form input components with consistent styling, validation, and accessibility features.
        </p>
        <div className="bg-secondary-50 p-4 rounded-md font-mono text-sm overflow-x-auto mb-6">
          <pre>{`<Input
  id="document-name"
  label="Document Name"
  value={name}
  onChange={setName}
  error={errors.name}
  required
/>

<Select
  id="document-category"
  label="Category"
  value={category}
  onChange={setCategory}
  options={categoryOptions}
  required
/>`}</pre>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Table Component</h3>
        <p className="mb-4">
          A flexible table component with sorting, pagination, and row actions.
        </p>
        <div className="bg-secondary-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
          <pre>{`<Table
  data={components}
  columns={[
    { key: 'name', title: 'Name', sortable: true },
    { key: 'category', title: 'Category', sortable: true },
    { key: 'cost', title: 'Cost', sortable: true },
  ]}
  rowActions={(item) => (
    <Button variant="outline" size="sm">Edit</Button>
  )}
  pagination={{
    currentPage: 1,
    pageSize: 10,
    totalItems: 100,
    onPageChange: handlePageChange,
  }}
/>`}</pre>
        </div>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Admin Features</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Form Management</h3>
            <p>
              The FormManagement and FormBuilder components allow administrators to create, edit, and manage custom forms.
              Forms can include various field types with validation rules and can be reordered via drag-and-drop.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">List Management</h3>
            <p>
              The ListBuilder and DropdownListManagement components provide tools for creating and managing dropdown lists
              and other selectable options throughout the application.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Document Management</h3>
            <p>
              The DocumentManagement component allows administrators to manage document categories, permissions, and metadata.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Inventory Dashboard</h3>
            <p>
              The InventoryDashboard provides tools for managing component inventory, tracking stock levels, and viewing
              inventory reports.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Document Management</h2>
        <div className="space-y-4">
          <p>
            The document management system allows users to upload, categorize, search, and preview documents related to
            cabinet components and installations.
          </p>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Key Components</h3>
            <ul className="list-disc list-inside space-y-1 text-secondary-700">
              <li>DocumentUpload: For uploading new documents with metadata</li>
              <li>DocumentList: For browsing and searching documents</li>
              <li>DocumentPreview: For viewing document content and details</li>
              <li>DocumentFilter: For filtering documents by various criteria</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Supabase Integration</h3>
            <p>
              Documents are stored in Supabase Storage, with metadata stored in the database. The documentService provides
              methods for uploading, retrieving, updating, and deleting documents.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Inventory Management</h2>
        <div className="space-y-4">
          <p>
            The inventory management system tracks cabinet components, stock levels, and inventory adjustments.
          </p>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1 text-secondary-700">
              <li>Component tracking with categories and attributes</li>
              <li>Stock level monitoring with reorder points</li>
              <li>Stock adjustment history</li>
              <li>Inventory valuation reports</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Data Model</h3>
            <p>
              The inventory system uses three main tables in Supabase:
            </p>
            <ul className="list-disc list-inside space-y-1 text-secondary-700">
              <li>components: Stores component definitions and attributes</li>
              <li>inventory: Tracks stock levels and inventory metadata</li>
              <li>stock_adjustments: Records all changes to inventory levels</li>
            </ul>
          </div>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Custom Hooks</h2>
        <div className="space-y-4">
          <p>
            The application includes several custom React hooks that encapsulate business logic and data access:
          </p>
          
          <div>
            <h3 className="text-lg font-medium mb-2">useDocuments</h3>
            <p>
              Provides methods for working with documents, including uploading, fetching, searching, and managing document metadata.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">useInventory</h3>
            <p>
              Manages inventory data, including components, stock levels, and stock adjustments.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">useForms</h3>
            <p>
              Handles form definitions and submissions, allowing for dynamic form creation and management.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">useLists</h3>
            <p>
              Manages dropdown lists and selectable options throughout the application.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArchitectureDocumentationPage;
