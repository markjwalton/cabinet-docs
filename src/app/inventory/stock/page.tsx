"use client";

import React from 'react';
import { BarChart3 } from 'lucide-react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Table from '@/components/ui/tables/Table';
import Button from '@/components/ui/buttons/Button';

/**
 * Inventory Stock Levels Page
 * 
 * Displays current stock levels and allows for stock adjustments.
 */
export default function StockLevelsPage() {
  // Sample data for demonstration
  const stockItems = [
    { id: 1, component: 'Door Hinge', current: 120, minimum: 50, maximum: 200, status: 'Normal' },
    { id: 2, component: 'Cabinet Door', current: 45, minimum: 30, maximum: 100, status: 'Low' },
    { id: 3, component: 'Shelf Support', current: 200, minimum: 100, maximum: 300, status: 'Normal' },
    { id: 4, component: 'Handle', current: 75, minimum: 50, maximum: 150, status: 'Normal' },
    { id: 5, component: 'Side Panel', current: 30, minimum: 40, maximum: 120, status: 'Critical' },
  ];

  const columns = [
    { key: 'id', header: 'ID', width: 'w-16', sortable: true },
    { key: 'component', header: 'Component', sortable: true },
    { key: 'current', header: 'Current Stock', sortable: true },
    { key: 'minimum', header: 'Min Level', sortable: true },
    { key: 'maximum', header: 'Max Level', sortable: true },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Normal' ? 'bg-green-100 text-green-800' :
          row.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Inventory', href: '/inventory' },
          { label: 'Stock Levels', href: '/inventory/stock' },
        ]}
        className="mb-6"
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-primary-600" />
          Stock Levels
        </h1>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            Export Report
          </Button>
          <Button variant="primary">
            Adjust Stock
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <Table
          columns={columns}
          data={stockItems}
          keyField="id"
          sortable
          pagination
          pageSize={10}
        />
      </div>
    </div>
  );
}
