// src/app/admin/page.tsx
"use client";

import React from 'react';
import { ListFilter, FormInput, Database, Package, FileText, Users } from 'lucide-react';
import Card from '@/components/ui/cards/Card';
import Button from '@/components/ui/buttons/Button';

/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard with access to all administrative functions.
 */
const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Lists Management */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <ListFilter className="w-6 h-6" />
            </div>
            
            <h2 className="text-lg font-semibold mb-2">Lists Management</h2>
            <p className="text-secondary-500 mb-4">
              Manage dropdown lists and options used throughout the application.
            </p>
            
            <Button 
              variant="primary" 
              href="/admin/lists"
            >
              Manage Lists
            </Button>
          </div>
        </Card>
        
        {/* Forms Management */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <FormInput className="w-6 h-6" />
            </div>
            
            <h2 className="text-lg font-semibold mb-2">Forms Management</h2>
            <p className="text-secondary-500 mb-4">
              Configure forms, fields, and validation rules for data entry.
            </p>
            
            <Button 
              variant="primary" 
              href="/admin/forms"
            >
              Manage Forms
            </Button>
          </div>
        </Card>
        
        {/* Database Management */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <Database className="w-6 h-6" />
            </div>
            
            <h2 className="text-lg font-semibold mb-2">Database Management</h2>
            <p className="text-secondary-500 mb-4">
              Manage database connections, backups, and data integrity.
            </p>
            
            <Button 
              variant="primary" 
              href="/admin/database"
            >
              Manage Database
            </Button>
          </div>
        </Card>
        
        {/* Inventory Management */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <Package className="w-6 h-6" />
            </div>
            
            <h2 className="text-lg font-semibold mb-2">Inventory Management</h2>
            <p className="text-secondary-500 mb-4">
              Configure inventory settings, categories, and tracking options.
            </p>
            
            <Button 
              variant="primary" 
              href="/admin/inventory"
            >
              Manage Inventory
            </Button>
          </div>
        </Card>
        
        {/* Document Management */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            
            <h2 className="text-lg font-semibold mb-2">Document Management</h2>
            <p className="text-secondary-500 mb-4">
              Configure document categories, metadata, and permissions.
            </p>
            
            <Button 
              variant="primary" 
              href="/admin/documents"
            >
              Manage Documents
            </Button>
          </div>
        </Card>
        
        {/* User Management */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <Users className="w-6 h-6" />
            </div>
            
            <h2 className="text-lg font-semibold mb-2">User Management</h2>
            <p className="text-secondary-500 mb-4">
              Manage users, roles, permissions, and access control.
            </p>
            
            <Button 
              variant="primary" 
              href="/admin/users"
            >
              Manage Users
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
