// src/app/products/page.tsx
"use client";

/**
 * Products Page Component
 * 
 * This page displays the products management interface, allowing users to
 * view, add, edit, and manage cabinet products.
 */

import React, { useState } from 'react';
import { ShoppingBag, Plus, Filter, Search, X, Package } from 'lucide-react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Button from '@/components/ui/buttons/Button';
import Card from '@/components/ui/cards/Card';
import { useData } from '@/contexts/DataContext';
import { Component } from '@/services/componentService';

// Define Product interface since it's not exported from DataContext
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  components?: Component[];
}

export default function ProductsPage() {
  const { 
    products, 
    components, 
    addProduct, 
    updateProduct, 
    updateProductComponents 
  } = useData();
  
  // State for modal visibility
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showComponentsModal, setShowComponentsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State for new product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });

  // State for edit product form
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  
  // State for selected components in the modal
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  // Handle opening the add product modal
  const handleAddProductClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setShowAddModal(true);
  };

  // Handle opening the edit product modal
  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowComponentsModal(false);
    setSelectedProduct(null);
    setEditProduct(null);
    setSelectedComponents([]);
    // Reset form
    setNewProduct({
      name: '',
      category: '',
      price: '',
      stock: ''
    });
  };

  // Handle form input changes for new product
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form input changes for edit product
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editProduct) return;
    
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: name === 'price' || name === 'stock' 
        ? parseFloat(value) 
        : value
    });
  };

  // Handle form submission for new product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new product object
    const productData = {
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
    };
    
    // Add the new product using the context
    addProduct(productData);
    
    // Close the modal
    handleCloseModal();
  };

  // Handle form submission for edit product
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editProduct) return;
    
    // Update the product using the context
    updateProduct(editProduct.id, {
      name: editProduct.name,
      category: editProduct.category,
      price: editProduct.price,
      stock: editProduct.stock
    });
    
    // Close the modal
    handleCloseModal();
  };

  // Handle opening the components modal
  const handleManageComponents = (product: Product) => {
    setSelectedProduct(product);
    setSelectedComponents(product.components?.map((c: Component) => c.id) || []);
    setShowComponentsModal(true);
  };

  // Handle component selection in the modal
  const handleComponentToggle = (componentId: string) => {
    setSelectedComponents(prev => {
      if (prev.includes(componentId)) {
        return prev.filter(id => id !== componentId);
      } else {
        return [...prev, componentId];
      }
    });
  };

  // Handle saving components to a product
  const handleSaveComponents = () => {
    if (!selectedProduct) return;
    
    // Update the product's components using the context
    updateProductComponents(selectedProduct.id, selectedComponents);
    
    // Close the modal
    handleCloseModal();
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
        ]}
        className="mb-6"
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2 text-primary-600" />
          Products
        </h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            icon={<Package className="w-4 h-4 mr-1" />}
            href="/components"
          >
            Manage Components
          </Button>
          <Button 
            variant="primary" 
            icon={<Plus className="w-4 h-4 mr-1" />}
            onClick={handleAddProductClick}
          >
            Add Product
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search products..."
            />
          </div>
          
          <div className="flex gap-2">
            <select className="block w-full py-2 px-3 border border-secondary-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="">All Categories</option>
              <option value="doors">Doors</option>
              <option value="panels">Panels</option>
              <option value="drawers">Drawers</option>
              <option value="hardware">Hardware</option>
            </select>
            
            <Button variant="outline" icon={<Filter className="w-4 h-4 mr-1" />}>
              Filter
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Components
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-secondary-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product: Product) => (
                <tr key={product.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-secondary-900">{product.name}</div>
                    <div className="text-sm text-secondary-500">#{product.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    £{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 20 ? 'bg-success-100 text-success-800' : 
                      product.stock > 10 ? 'bg-warning-100 text-warning-800' : 
                      'bg-danger-100 text-danger-800'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    <div className="flex flex-wrap gap-1">
                      {product.components && product.components.length > 0 ? (
                        product.components.slice(0, 2).map((component: Component, index: number) => (
                          <span key={index} className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full">
                            {component.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-secondary-400">No components</span>
                      )}
                      {product.components && product.components.length > 2 && (
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs rounded-full">
                          +{product.components.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="small"
                        onClick={() => handleManageComponents(product)}
                      >
                        Components
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="small"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-secondary-900">Add New Product</h3>
              <button
                className="text-secondary-400 hover:text-secondary-500 focus:outline-none"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Doors">Doors</option>
                  <option value="Panels">Panels</option>
                  <option value="Drawers">Drawers</option>
                  <option value="Hardware">Hardware</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-secondary-700 mb-1">
                  Price (£)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-secondary-700 mb-1">
                  Initial Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
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
                  Add Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {showEditModal && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-secondary-900">Edit Product</h3>
              <button
                className="text-secondary-400 hover:text-secondary-500 focus:outline-none"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-secondary-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editProduct.name}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-category" className="block text-sm font-medium text-secondary-700 mb-1">
                  Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={editProduct.category}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Doors">Doors</option>
                  <option value="Panels">Panels</option>
                  <option value="Drawers">Drawers</option>
                  <option value="Hardware">Hardware</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-price" className="block text-sm font-medium text-secondary-700 mb-1">
                  Price (£)
                </label>
                <input
                  type="number"
                  id="edit-price"
                  name="price"
                  value={editProduct.price}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-stock" className="block text-sm font-medium text-secondary-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  id="edit-stock"
                  name="stock"
                  value={editProduct.stock}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
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
                  Update Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Manage Components Modal */}
      {showComponentsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-secondary-900">Manage Components</h3>
              <button
                className="text-secondary-400 hover:text-secondary-500 focus:outline-none"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-secondary-600 mb-4">
                Select components for <strong>{selectedProduct.name}</strong>
              </p>
              
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {components.length === 0 ? (
                  <p className="p-4 text-center text-secondary-500">No components available</p>
                ) : (
                  <ul className="divide-y divide-secondary-200">
                    {components.map((component) => (
                      <li key={component.id} className="p-3 hover:bg-secondary-50">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedComponents.includes(component.id)}
                            onChange={() => handleComponentToggle(component.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                          />
                          <span className="text-sm font-medium text-secondary-900">{component.name}</span>
                          <span className="text-xs text-secondary-500">{component.category}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSaveComponents}
                >
                  Save Components
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
