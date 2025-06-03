"use client";

/**
 * Admin Inventory Page Component
 * 
 * This page provides administrative functions for managing inventory settings
 * and stock tracking configurations.
 */

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Card from '@/components/ui/cards/Card';
import Button from '@/components/ui/buttons/Button';
import { Package, Plus, Settings, AlertTriangle, X, Edit as EditIcon, Trash, Save } from 'lucide-react';
// Removed unused import: import { useNavigation } from '@/contexts/NavigationContext';

interface InventoryCategory {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  lowStock: number;
}

/**
 * AdminInventoryPage component
 */
export default function AdminInventoryPage() {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  // Form states
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  
  // Selected category for edit/delete
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState({
    lowStockThreshold: 5,
    enableNotifications: true,
    autoReorder: false,
    reorderLeadTime: 7
  });
  
  // Removed unused variable: const { navigate } = useNavigation();

  // Sample inventory categories for demonstration - converted to state
  const [inventoryCategories, setInventoryCategories] = useState<InventoryCategory[]>([
    { 
      id: '1', 
      name: 'Hardware', 
      description: 'Cabinet hardware components like hinges and handles',
      itemCount: 24,
      lowStock: 3
    },
    { 
      id: '2', 
      name: 'Boards', 
      description: 'Various board materials used for cabinet construction',
      itemCount: 12,
      lowStock: 2
    },
    { 
      id: '3', 
      name: 'Fittings', 
      description: 'Internal cabinet fittings and accessories',
      itemCount: 18,
      lowStock: 1
    },
    { 
      id: '4', 
      name: 'Tools', 
      description: 'Tools used for cabinet installation and maintenance',
      itemCount: 15,
      lowStock: 0
    },
  ]);

  // Handle opening the add category modal
  const handleAddCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setShowAddModal(true);
  };

  // Handle opening the edit category modal
  const handleEditClick = (category: InventoryCategory, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  // Handle opening the delete confirmation modal
  const handleDeleteClick = (category: InventoryCategory, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setSelectedCategory(category);
    setShowDeleteConfirmModal(true);
  };

  // Handle opening the settings modal
  const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setShowSettingsModal(true);
  };

  // Handle closing all modals
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowSettingsModal(false);
    setShowDeleteConfirmModal(false);
    setSelectedCategory(null);
    setNewCategory({
      name: '',
      description: ''
    });
  };

  // Handle form input changes for new category
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form input changes for edit category
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        [name]: value
      });
    }
  };

  // Handle form input changes for settings
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value)
    }));
  };

  // Handle form submission for new category
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new category object
    const newCategoryObj: InventoryCategory = {
      id: `${inventoryCategories.length + 1}`,
      name: newCategory.name,
      description: newCategory.description,
      itemCount: 0,
      lowStock: 0
    };
    
    // Add the new category to the state
    setInventoryCategories([...inventoryCategories, newCategoryObj]);
    
    // Show confirmation
    alert(`Category "${newCategory.name}" has been added successfully!`);
    
    // Close the modal
    handleCloseModal();
  };

  // Handle form submission for edit category
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) return;
    
    // Update the category in the state
    const updatedCategories = inventoryCategories.map(category => {
      if (category.id === selectedCategory.id) {
        return selectedCategory;
      }
      return category;
    });
    
    setInventoryCategories(updatedCategories);
    
    // Show confirmation
    alert(`Category "${selectedCategory.name}" has been updated successfully!`);
    
    // Close the modal
    handleCloseModal();
  };

  // Handle form submission for settings
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save to a database or API
    // For now, we just show a confirmation
    alert('Inventory settings have been updated successfully!');
    
    // Close the modal
    handleCloseModal();
  };

  // Handle delete category
  const handleDeleteConfirm = () => {
    if (!selectedCategory) return;
    
    // Remove the category from the state
    setInventoryCategories(inventoryCategories.filter(category => category.id !== selectedCategory.id));
    
    // Show confirmation
    alert(`Category "${selectedCategory.name}" has been deleted successfully!`);
    
    // Close the modal
    handleCloseModal();
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Inventory', href: '/admin/inventory' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Settings className="w-5 h-5" />}
            onClick={handleSettingsClick}
          >
            Settings
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddCategoryClick}
          >
            Add Category
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-6">
          <p className="text-secondary-600">
            Manage inventory categories, stock level thresholds, and tracking settings. These configurations determine how inventory is organized and monitored.
          </p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        {inventoryCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4 mt-1">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <p className="text-secondary-600 mt-1">
                      {category.description}
                    </p>
                    <div className="flex items-center mt-2 text-secondary-500">
                      <span className="mr-4">{category.itemCount} items</span>
                      {category.lowStock > 0 && (
                        <span className="flex items-center text-warning-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {category.lowStock} low stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="small"
                    icon={<EditIcon className="w-4 h-4" />}
                    onClick={(e) => handleEditClick(category, e)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small"
                    icon={<Trash className="w-4 h-4 text-danger-500" />}
                    onClick={(e) => handleDeleteClick(category, e)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Add Inventory Category</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Enter category description"
                  required
                ></textarea>
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
                  Add Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Edit Category</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={selectedCategory.name}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  name="description"
                  value={selectedCategory.description}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  required
                ></textarea>
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
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Inventory Settings</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSettingsSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Threshold
                </label>
                <input 
                  type="number" 
                  name="lowStockThreshold"
                  value={settings.lowStockThreshold}
                  onChange={handleSettingsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="1"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  Items with stock below this threshold will be marked as low stock
                </p>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleSettingsChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable low stock notifications</span>
                </label>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="autoReorder"
                    checked={settings.autoReorder}
                    onChange={handleSettingsChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable automatic reordering</span>
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Lead Time (days)
                </label>
                <input 
                  type="number" 
                  name="reorderLeadTime"
                  value={settings.reorderLeadTime}
                  onChange={handleSettingsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="1"
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
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Confirm Delete</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="mb-4">
                Are you sure you want to delete the category "{selectedCategory.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
