"use client";

/**
 * Admin Suppliers Page Component
 * 
 * This page provides administrative functions for managing suppliers,
 * their contact information, and product offerings.
 */

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Card from '@/components/ui/cards/Card';
import Button from '@/components/ui/buttons/Button';
import { Truck, Plus, Settings, Phone, Mail, X } from 'lucide-react';
// Removed unused import: import { useNavigation } from '@/contexts/NavigationContext';

interface Supplier {
  id: string;
  name: string;
  description: string;
  contactName: string;
  email: string;
  phone: string;
  rating: number;
}

/**
 * AdminSuppliersPage component
 */
export default function AdminSuppliersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  // Removed unused variable: const { navigate } = useNavigation();

  // New supplier form state
  const [newSupplier, setNewSupplier] = useState<{
    name: string;
    description: string;
    contactName: string;
    email: string;
    phone: string;
  }>({
    name: '',
    description: '',
    contactName: '',
    email: '',
    phone: ''
  });

  // Sample suppliers for demonstration - converted to state
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { 
      id: '1', 
      name: 'Cabinet Hardware Ltd', 
      description: 'Premium cabinet hardware supplier',
      contactName: 'John Smith',
      email: 'john@cabinethardware.com',
      phone: '+44 20 1234 5678',
      rating: 5
    },
    { 
      id: '2', 
      name: 'Board Materials Inc', 
      description: 'Specializing in high-quality board materials',
      contactName: 'Sarah Johnson',
      email: 'sarah@boardmaterials.com',
      phone: '+44 20 2345 6789',
      rating: 4
    },
    { 
      id: '3', 
      name: 'Cabinet Fittings Co', 
      description: 'Complete range of cabinet fittings and accessories',
      contactName: 'Michael Brown',
      email: 'michael@cabinetfittings.com',
      phone: '+44 20 3456 7890',
      rating: 3
    },
    { 
      id: '4', 
      name: 'Tools & Equipment Ltd', 
      description: 'Professional cabinet installation tools',
      contactName: 'Emma Wilson',
      email: 'emma@toolsequipment.com',
      phone: '+44 20 4567 8901',
      rating: 4
    },
  ]);

  // Handle opening the add supplier modal
  const handleAddSupplierClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setShowAddModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    // Reset form
    setNewSupplier({
      name: '',
      description: '',
      contactName: '',
      email: '',
      phone: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new supplier object
    const newSupplierObj: Supplier = {
      id: `${suppliers.length + 1}`,
      name: newSupplier.name,
      description: newSupplier.description,
      contactName: newSupplier.contactName,
      email: newSupplier.email,
      phone: newSupplier.phone,
      rating: 3 // Default rating for new suppliers
    };
    
    // Add the new supplier to the suppliers state
    setSuppliers([...suppliers, newSupplierObj]);
    
    // Close the modal
    handleCloseModal();
    
    // Show confirmation
    alert(`Supplier "${newSupplier.name}" has been added successfully!`);
  };

  // Handle edit button click
  const handleEditClick = (supplier: Supplier) => {
    // In a real application, this would open an edit modal
    alert(`Edit functionality for ${supplier.name} will be implemented soon.`);
  };

  // Handle delete button click
  const handleDeleteClick = (supplierId: string) => {
    // Confirm before deleting
    if (confirm("Are you sure you want to delete this supplier?")) {
      // Filter out the supplier with the matching ID
      setSuppliers(suppliers.filter(supplier => supplier.id !== supplierId));
      alert("Supplier deleted successfully!");
    }
  };

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Suppliers', href: '/admin/suppliers' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Supplier Management</h1>
        
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
            onClick={handleAddSupplierClick}
          >
            Add Supplier
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-6">
          <p className="text-secondary-600">
            Manage suppliers, their contact information, and product offerings. Maintaining good supplier relationships is essential for efficient cabinet production.
          </p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4 mt-1">
                    <Truck className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{supplier.name}</h2>
                    <p className="text-secondary-600 mt-1">
                      {supplier.description}
                    </p>
                    <div className="mt-2">
                      {renderRating(supplier.rating)}
                    </div>
                    <div className="flex flex-col mt-2 text-secondary-500">
                      <span className="flex items-center">
                        <span className="font-medium mr-2">Contact:</span> 
                        {supplier.contactName}
                      </span>
                      <span className="flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-1" />
                        {supplier.email}
                      </span>
                      <span className="flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-1" />
                        {supplier.phone}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleEditClick(supplier)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleDeleteClick(supplier.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Add Supplier</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={newSupplier.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter supplier name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  name="description"
                  value={newSupplier.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Enter supplier description"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input 
                  type="text" 
                  name="contactName"
                  value={newSupplier.contactName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter contact person's name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={newSupplier.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={newSupplier.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="primary"
                >
                  Add Supplier
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
