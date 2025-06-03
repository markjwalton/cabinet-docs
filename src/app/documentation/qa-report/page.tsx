/**
 * QA Test Report
 * 
 * This document contains the results of comprehensive testing performed on the
 * Wall Mounted Cabinet Management Tool skeleton website.
 */

import React from 'react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Card from '@/components/ui/cards/Card';

/**
 * QA Test Report page component
 */
const QATestReportPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Documentation', href: '/documentation' },
          { label: 'QA Test Report', href: '/documentation/qa-report' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <h1 className="text-3xl font-bold mb-8">QA Test Report</h1>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Test Summary</h2>
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-success-500 mr-2"></div>
          <span className="font-medium text-success-700">All critical tests passed</span>
        </div>
        <p>
          This report documents the testing performed on the Wall Mounted Cabinet Management Tool skeleton website.
          The testing covered UI components, document management, inventory management, and Supabase integration.
        </p>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">UI Component Tests</h2>
        <table className="min-w-full divide-y divide-secondary-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Component</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Test</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Button</td>
              <td className="px-4 py-3 text-sm">Render all variants and sizes</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Button</td>
              <td className="px-4 py-3 text-sm">Loading state</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Button</td>
              <td className="px-4 py-3 text-sm">Icon placement</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Card</td>
              <td className="px-4 py-3 text-sm">Render with title and actions</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Card</td>
              <td className="px-4 py-3 text-sm">Clickable state</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Input</td>
              <td className="px-4 py-3 text-sm">Value binding</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Input</td>
              <td className="px-4 py-3 text-sm">Error state</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Select</td>
              <td className="px-4 py-3 text-sm">Options rendering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Select</td>
              <td className="px-4 py-3 text-sm">Value selection</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Modal</td>
              <td className="px-4 py-3 text-sm">Open/close functionality</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Modal</td>
              <td className="px-4 py-3 text-sm">Action buttons</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Navbar</td>
              <td className="px-4 py-3 text-sm">Navigation links</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Navbar</td>
              <td className="px-4 py-3 text-sm">Dropdown menus</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Breadcrumb</td>
              <td className="px-4 py-3 text-sm">Path rendering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Table</td>
              <td className="px-4 py-3 text-sm">Data rendering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Table</td>
              <td className="px-4 py-3 text-sm">Sorting</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Table</td>
              <td className="px-4 py-3 text-sm">Pagination</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
          </tbody>
        </table>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Document Management Tests</h2>
        <table className="min-w-full divide-y divide-secondary-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Feature</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Test</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentUpload</td>
              <td className="px-4 py-3 text-sm">File selection</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentUpload</td>
              <td className="px-4 py-3 text-sm">Metadata input</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentUpload</td>
              <td className="px-4 py-3 text-sm">Supabase integration</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentList</td>
              <td className="px-4 py-3 text-sm">Document rendering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentList</td>
              <td className="px-4 py-3 text-sm">Filtering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentList</td>
              <td className="px-4 py-3 text-sm">Search functionality</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentPreview</td>
              <td className="px-4 py-3 text-sm">Image preview</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentPreview</td>
              <td className="px-4 py-3 text-sm">PDF preview</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentPreview</td>
              <td className="px-4 py-3 text-sm">Download functionality</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentFilter</td>
              <td className="px-4 py-3 text-sm">Category filtering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentFilter</td>
              <td className="px-4 py-3 text-sm">Date range filtering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DocumentFilter</td>
              <td className="px-4 py-3 text-sm">Tag filtering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
          </tbody>
        </table>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Inventory Management Tests</h2>
        <table className="min-w-full divide-y divide-secondary-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Feature</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Test</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Component Management</td>
              <td className="px-4 py-3 text-sm">Component creation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Component Management</td>
              <td className="px-4 py-3 text-sm">Component editing</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Component Management</td>
              <td className="px-4 py-3 text-sm">Component archiving</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Stock Management</td>
              <td className="px-4 py-3 text-sm">Stock level tracking</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Stock Management</td>
              <td className="px-4 py-3 text-sm">Stock adjustments</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Stock Management</td>
              <td className="px-4 py-3 text-sm">Low stock alerts</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Inventory Reports</td>
              <td className="px-4 py-3 text-sm">Value calculation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Inventory Reports</td>
              <td className="px-4 py-3 text-sm">Stock history</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
          </tbody>
        </table>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Admin Features Tests</h2>
        <table className="min-w-full divide-y divide-secondary-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Feature</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Test</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium">FormBuilder</td>
              <td className="px-4 py-3 text-sm">Field creation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">FormBuilder</td>
              <td className="px-4 py-3 text-sm">Field reordering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">FormBuilder</td>
              <td className="px-4 py-3 text-sm">Validation rules</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">ListBuilder</td>
              <td className="px-4 py-3 text-sm">Item creation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">ListBuilder</td>
              <td className="px-4 py-3 text-sm">Item reordering</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DropdownListManagement</td>
              <td className="px-4 py-3 text-sm">List creation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">DropdownListManagement</td>
              <td className="px-4 py-3 text-sm">Item management</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
          </tbody>
        </table>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Supabase Integration Tests</h2>
        <table className="min-w-full divide-y divide-secondary-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Feature</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Test</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Client Setup</td>
              <td className="px-4 py-3 text-sm">Connection</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Database</td>
              <td className="px-4 py-3 text-sm">CRUD operations</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Storage</td>
              <td className="px-4 py-3 text-sm">File uploads</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Storage</td>
              <td className="px-4 py-3 text-sm">File downloads</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Error Handling</td>
              <td className="px-4 py-3 text-sm">Connection errors</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Error Handling</td>
              <td className="px-4 py-3 text-sm">Query errors</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
          </tbody>
        </table>
      </Card>
      
      <Card className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Documentation Tests</h2>
        <table className="min-w-full divide-y divide-secondary-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Feature</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Test</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Architecture Doc</td>
              <td className="px-4 py-3 text-sm">Content accuracy</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Architecture Doc</td>
              <td className="px-4 py-3 text-sm">Navigation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Troubleshooting Guide</td>
              <td className="px-4 py-3 text-sm">Content accuracy</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Troubleshooting Guide</td>
              <td className="px-4 py-3 text-sm">Navigation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Supabase Integration</td>
              <td className="px-4 py-3 text-sm">Documentation accuracy</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
          </tbody>
        </table>
      </Card>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Responsive Design Tests</h2>
        <table className="min-w-full divide-y divide-secondary-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Device</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Test</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Mobile</td>
              <td className="px-4 py-3 text-sm">Layout</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Mobile</td>
              <td className="px-4 py-3 text-sm">Navigation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Tablet</td>
              <td className="px-4 py-3 text-sm">Layout</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Tablet</td>
              <td className="px-4 py-3 text-sm">Navigation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Desktop</td>
              <td className="px-4 py-3 text-sm">Layout</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Desktop</td>
              <td className="px-4 py-3 text-sm">Navigation</td>
              <td className="px-4 py-3 text-sm text-success-600">Pass</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default QATestReportPage;
