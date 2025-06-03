"use client";

import React, { useState } from 'react';
import { ClipboardList, Plus, Filter, Search, Clock, CheckCircle, AlertTriangle, X, Eye, Edit as EditIcon } from 'lucide-react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Button from '@/components/ui/buttons/Button';
import Card from '@/components/ui/cards/Card';
import { useNotification } from '@/contexts/NotificationContext';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items?: string[];
  notes?: string;
}

export default function OrdersPage() {
  // Get notification context
  const { showSuccess } = useNotification();
  
  // State for modal visibility
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // State for selected order
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // State for new order form
  const [newOrder, setNewOrder] = useState({
    customer: '',
    items: '',
    notes: ''
  });

  // State for edit order form
  const [editOrder, setEditOrder] = useState({
    customer: '',
    items: '',
    notes: '',
    status: ''
  });

  // Sample products for dropdown - using const instead of useState since we don't modify it
  const products = [
    { id: 'p1', name: 'Standard Cabinet Door' },
    { id: 'p2', name: 'Premium Cabinet Door' },
    { id: 'p3', name: 'Cabinet Side Panel' },
    { id: 'p4', name: 'Drawer Front' },
    { id: 'p5', name: 'Cabinet Hinge Set' },
  ];

  // Sample order data - converted to state
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: 'ORD-1001', 
      customer: 'John Smith', 
      date: '2025-05-15', 
      total: 1245.99, 
      status: 'completed',
      items: ['Standard Cabinet Door (2)', 'Cabinet Hinge Set (4)'],
      notes: 'Customer requested delivery by end of month.'
    },
    { 
      id: 'ORD-1002', 
      customer: 'Sarah Johnson', 
      date: '2025-05-18', 
      total: 879.50, 
      status: 'processing',
      items: ['Premium Cabinet Door (1)', 'Drawer Front (3)'],
      notes: 'Special finish requested.'
    },
    { 
      id: 'ORD-1003', 
      customer: 'Michael Brown', 
      date: '2025-05-20', 
      total: 2350.75, 
      status: 'pending',
      items: ['Cabinet Side Panel (4)', 'Standard Cabinet Door (4)', 'Cabinet Hinge Set (8)'],
      notes: ''
    },
    { 
      id: 'ORD-1004', 
      customer: 'Emily Davis', 
      date: '2025-05-22', 
      total: 1120.25, 
      status: 'completed',
      items: ['Premium Cabinet Door (2)', 'Cabinet Side Panel (2)'],
      notes: 'Rush order.'
    },
    { 
      id: 'ORD-1005', 
      customer: 'Robert Wilson', 
      date: '2025-05-25', 
      total: 3450.00, 
      status: 'processing',
      items: ['Standard Cabinet Door (6)', 'Premium Cabinet Door (2)', 'Drawer Front (4)', 'Cabinet Hinge Set (12)'],
      notes: 'Large order for office renovation.'
    },
  ]);

  // Handle opening the add order modal
  const handleNewOrderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setShowAddModal(true);
  };

  // Handle opening the view order modal
  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // Handle opening the edit order modal
  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setEditOrder({
      customer: order.customer,
      items: order.items ? order.items.join('\n') : '',
      notes: order.notes || '',
      status: order.status
    });
    setShowEditModal(true);
  };

  // Handle closing the modals
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedOrder(null);
    // Reset form
    setNewOrder({
      customer: '',
      items: '',
      notes: ''
    });
  };

  // Handle form input changes for new order
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form input changes for edit order
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for new order
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse items from textarea
    const itemsList = newOrder.items.split('\n').filter(item => item.trim() !== '');
    
    // Create a new order object
    const newOrderObj: Order = {
      id: `ORD-${1006 + orders.length}`,
      customer: newOrder.customer,
      date: new Date().toISOString().split('T')[0],
      total: 0, // Default total, would be calculated in a real app
      status: 'pending',
      items: itemsList,
      notes: newOrder.notes
    };
    
    // Add the new order to the orders state
    setOrders([...orders, newOrderObj]);
    
    // Show notification instead of alert - using showSuccess helper method
    showSuccess(`New order for ${newOrder.customer} has been created successfully!`);
    
    // Close the modal
    handleCloseModal();
  };

  // Handle form submission for edit order
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder) return;
    
    // Parse items from textarea
    const itemsList = editOrder.items.split('\n').filter(item => item.trim() !== '');
    
    // Update the order in the orders state
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          customer: editOrder.customer,
          items: itemsList,
          notes: editOrder.notes,
          status: editOrder.status
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Show notification instead of alert - using showSuccess helper method
    showSuccess(`Order ${selectedOrder.id} has been updated successfully!`);
    
    // Close the modal
    handleCloseModal();
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Orders', href: '/orders' },
        ]}
        className="mb-6"
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
          <ClipboardList className="w-6 h-6 mr-2 text-primary-600" />
          Orders
        </h1>
        
        <Button 
          variant="primary" 
          icon={<Plus className="w-4 h-4 mr-1" />}
          onClick={handleNewOrderClick}
        >
          New Order
        </Button>
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
              placeholder="Search orders..."
            />
          </div>
          
          <div className="flex gap-2">
            <select className="block w-full py-2 px-3 border border-secondary-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
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
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-secondary-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  £{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="small"
                      icon={<Eye className="w-4 h-4" />}
                      onClick={() => handleViewClick(order)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="small"
                      icon={<EditIcon className="w-4 h-4" />}
                      onClick={() => handleEditClick(order)}
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-secondary-900">Create New Order</h3>
              <button
                className="text-secondary-400 hover:text-secondary-500 focus:outline-none"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="customer" className="block text-sm font-medium text-secondary-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customer"
                  name="customer"
                  value={newOrder.customer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="items" className="block text-sm font-medium text-secondary-700 mb-1">
                  Order Items
                </label>
                <div className="mb-2">
                  <select
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    onChange={(e) => {
                      if (e.target.value) {
                        const selectedProduct = products.find(p => p.id === e.target.value);
                        if (selectedProduct) {
                          setNewOrder(prev => ({
                            ...prev,
                            items: prev.items ? `${prev.items}\n${selectedProduct.name} (1)` : `${selectedProduct.name} (1)`
                          }));
                        }
                        e.target.value = ''; // Reset select after adding
                      }
                    }}
                  >
                    <option value="">Select Product to Add</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  id="items"
                  name="items"
                  value={newOrder.items}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Products will appear here"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">Edit quantities in parentheses as needed</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={newOrder.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add any special instructions or notes here"
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
                  Create Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-secondary-900">Order Details: {selectedOrder.id}</h3>
              <button
                className="text-secondary-400 hover:text-secondary-500 focus:outline-none"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-secondary-500">Customer</h4>
                <p className="text-secondary-900">{selectedOrder.customer}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-secondary-500">Date</h4>
                <p className="text-secondary-900">{selectedOrder.date}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-secondary-500">Status</h4>
                <StatusBadge status={selectedOrder.status} />
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-secondary-500">Items</h4>
                <ul className="list-disc pl-5 text-secondary-900">
                  {selectedOrder.items && selectedOrder.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-secondary-500">Total</h4>
                <p className="text-secondary-900 font-bold">£{selectedOrder.total.toFixed(2)}</p>
              </div>
              
              {selectedOrder.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-secondary-500">Notes</h4>
                  <p className="text-secondary-900">{selectedOrder.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  variant="primary"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-secondary-900">Edit Order: {selectedOrder.id}</h3>
              <button
                className="text-secondary-400 hover:text-secondary-500 focus:outline-none"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="edit-customer" className="block text-sm font-medium text-secondary-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="edit-customer"
                  name="customer"
                  value={editOrder.customer}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-status" className="block text-sm font-medium text-secondary-700 mb-1">
                  Status
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={editOrder.status}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-items" className="block text-sm font-medium text-secondary-700 mb-1">
                  Order Items
                </label>
                <div className="mb-2">
                  <select
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    onChange={(e) => {
                      if (e.target.value) {
                        const selectedProduct = products.find(p => p.id === e.target.value);
                        if (selectedProduct) {
                          setEditOrder(prev => ({
                            ...prev,
                            items: prev.items ? `${prev.items}\n${selectedProduct.name} (1)` : `${selectedProduct.name} (1)`
                          }));
                        }
                        e.target.value = ''; // Reset select after adding
                      }
                    }}
                  >
                    <option value="">Select Product to Add</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  id="edit-items"
                  name="items"
                  value={editOrder.items}
                  onChange={handleEditInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">One item per line with quantity in parentheses</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-notes" className="block text-sm font-medium text-secondary-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="edit-notes"
                  name="notes"
                  value={editOrder.notes}
                  onChange={handleEditInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
