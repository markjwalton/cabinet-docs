"use client";

/**
 * Inventory Page Component
 * 
 * This page displays the inventory management interface, allowing users to
 * track component stock levels, manage inventory, and view stock history.
 */

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Card from '@/components/ui/cards/Card';
import Button from '@/components/ui/buttons/Button';
import { Package, Plus, AlertTriangle, TrendingDown, X } from 'lucide-react';
import { useData, InventoryItem } from '@/contexts/DataContext';

export default function InventoryPage() {
  const { inventory, adjustStock, addInventoryItem } = useData();
  
  // State for adjust stock modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  
  // State for new component form
  const [newComponent, setNewComponent] = useState({
    name: '',
    category: '',
    currentStock: '',
    reorderPoint: ''
  });

  // Calculate low stock items
  const lowStockItems = inventory.filter((item: InventoryItem) => item.currentStock <= item.reorderPoint);
  
  // Calculate total inventory value (placeholder for now)
  const inventoryValue = inventory.reduce((total: number, item: InventoryItem) => {
    // This is a placeholder calculation - in a real app, you'd have a price for each item
    return total + (item.currentStock * 10); // Assuming £10 per item as placeholder
  }, 0);

  // Handle opening the adjust stock modal
  const handleAdjustStock = (e: React.MouseEvent<HTMLButtonElement>, item: InventoryItem) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setSelectedItem(item);
    setAdjustQuantity(0);
    setShowAdjustModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowAdjustModal(false);
    setShowAddComponentModal(false);
    setSelectedItem(null);
    setNewComponent({
      name: '',
      category: '',
      currentStock: '',
      reorderPoint: ''
    });
  };

  // Handle stock adjustment
  const handleSaveAdjustment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    
    if (!selectedItem) return;
    
    // Update the item in the state using the context
    adjustStock(selectedItem.id, adjustQuantity);
    
    // Close the modal
    handleCloseModal();
  };

  // Handle add component button click
  const handleAddComponent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowAddComponentModal(true);
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdjustQuantity(parseInt(e.target.value) || 0);
  };
  
  // Handle form input changes for new component
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewComponent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for new component
  const handleSubmitComponent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new component object
    const newItem = {
      name: newComponent.name,
      category: newComponent.category,
      currentStock: parseInt(newComponent.currentStock) || 0,
      reorderPoint: parseInt(newComponent.reorderPoint) || 0
    };
    
    // Add the new component to the state using the context
    addInventoryItem(newItem);
    
    // Close the modal
    handleCloseModal();
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Inventory', href: '/inventory' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Package className="w-5 h-5 mr-1" />}
            href="/components"
          >
            View Components
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddComponent}
          >
            Add Component
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Total Components</h2>
              <Package className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-3xl font-bold">{inventory.length}</p>
            <p className="text-secondary-500 text-sm mt-1">
              {new Set(inventory.map((item: InventoryItem) => item.category)).size} categories
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Low Stock Items</h2>
              <AlertTriangle className="w-8 h-8 text-warning-500" />
            </div>
            <p className="text-3xl font-bold">
              {lowStockItems.length}
            </p>
            <p className="text-secondary-500 text-sm mt-1">Requires attention</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Inventory Value</h2>
              <TrendingDown className="w-8 h-8 text-success-500" />
            </div>
            <p className="text-3xl font-bold">£{inventoryValue.toFixed(2)}</p>
            <p className="text-secondary-500 text-sm mt-1">Updated today</p>
          </div>
        </Card>
      </div>
      
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Low Stock Items</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Component</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Reorder Point</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-secondary-500">
                      No low stock items found
                    </td>
                  </tr>
                ) : (
                  lowStockItems.map((item: InventoryItem) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-sm">{item.category}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${
                        item.currentStock < item.reorderPoint ? 'text-danger-600' : 'text-secondary-600'
                      }`}>
                        {item.currentStock}
                      </td>
                      <td className="px-4 py-3 text-sm">{item.reorderPoint}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={(e) => handleAdjustStock(e, item)}
                        >
                          Adjust Stock
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Inventory Items</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Component</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Reorder Point</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-secondary-500">
                      No inventory items found
                    </td>
                  </tr>
                ) : (
                  inventory.map((item: InventoryItem) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-sm">{item.category}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${
                        item.currentStock < item.reorderPoint ? 'text-danger-600' : 'text-secondary-600'
                      }`}>
                        {item.currentStock}
                      </td>
                      <td className="px-4 py-3 text-sm">{item.reorderPoint}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={(e) => handleAdjustStock(e, item)}
                        >
                          Adjust Stock
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Adjust Stock: {selectedItem.name}</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  value={selectedItem.currentStock}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Quantity
                </label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={adjustQuantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter positive or negative value"
                />
                <p className="text-sm text-secondary-500 mt-1">
                  Use positive values to add stock, negative to remove
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Stock Level
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  value={Math.max(0, selectedItem.currentStock + adjustQuantity)}
                  disabled
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleSaveAdjustment}
                >
                  Save Adjustment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Component Modal */}
      {showAddComponentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Add New Component</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitComponent} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newComponent.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newComponent.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Panels">Panels</option>
                  <option value="Doors">Doors</option>
                  <option value="Drawers">Drawers</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock
                </label>
                <input 
                  type="number" 
                  name="currentStock"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newComponent.currentStock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Point
                </label>
                <input 
                  type="number" 
                  name="reorderPoint"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={newComponent.reorderPoint}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="primary"
                >
                  Add Component
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
