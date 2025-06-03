"use client";

import DropdownListManagement from '@/components/admin/DropdownListManagement';
import ListBuilderAdapter from '@/components/admin/ListBuilderAdapter';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import { ListTree } from 'lucide-react';

/**
 * List Management Page
 * 
 * Allows administrators to create, edit, and manage dropdown lists and options.
 */
export default function ListManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'List Management', href: '/admin/lists' },
        ]}
        className="mb-6"
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
          <ListTree className="w-6 h-6 mr-2 text-primary-600" />
          List Management
        </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Dropdown Lists</h2>
          <DropdownListManagement />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">List Builder</h2>
          <ListBuilderAdapter 
            listName="Cabinet Components" 
            initialItems={[
              { id: '1', value: 'door_hinge', label: 'Door Hinge', order: 0 },
              { id: '2', value: 'cabinet_door', label: 'Cabinet Door', order: 1 },
              { id: '3', value: 'shelf_support', label: 'Shelf Support', order: 2 }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
