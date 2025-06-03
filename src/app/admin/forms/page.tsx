"use client";

import React from 'react';
import { FormInput } from 'lucide-react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import FormManagement from '@/components/admin/FormManagement';

/**
 * Form Management Page
 * 
 * Allows administrators to create, edit, and manage forms.
 */
export default function FormManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Form Management', href: '/admin/forms' },
        ]}
        className="mb-6"
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
          <FormInput className="w-6 h-6 mr-2 text-primary-600" />
          Form Management
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <FormManagement />
      </div>
    </div>
  );
}
