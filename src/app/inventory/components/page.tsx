"use client";

import React from 'react';
import { Package } from 'lucide-react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Table from '@/components/ui/tables/Table';
import Button from '@/components/ui/buttons/Button';

/**
 * Inventory Components Page
 * 
 * Displays a list of all cabinet components in the inventory.
 */
export default function InventoryComponentsPage() {
  // Sample data for demonstration
  const components = [
    { id: 1, name: 'Door Hinge', category: 'Hardware', quantity: 120, unit: 'pcs' },
    { id: 2, name: 'Cabinet Door', category: 'Panels', quantity: 45, unit: 'pcs' },
    { id: 3, name: 'Shelf Support', category: 'Hardware', quantity: 200, unit: 'pcs' },
    { id: 4, name: 'Handle', category: 'Hardware', quantity: 75, unit: 'pcs' },
    { id: 5, name: 'Side Panel', category: 'Panels', quantity: 30, unit: 'pcs' },
  ];

  const columns = [
    { key: 'id', header: 'ID', width: 'w-16', sortable: true },
    { key: 'name', header: 'Component Name', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'quantity', header: 'Quantity', sortable: true },
    { key: 'unit', header: 'Unit', sortable: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Inventory', href: '/inventory' },
          { label: 'Components', href: '/inventory/components' },
        ]}
        className="mb-6"
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
          <Package className="w-6 h-6 mr-2 text-primary-600" />
          Components
        </h1>
        
        <Button variant="primary">
          Add Component
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <Table
          columns={columns}
          data={components}
          keyField="id"
          sortable
          pagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
