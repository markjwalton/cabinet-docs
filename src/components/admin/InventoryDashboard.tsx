"use client";

/**
 * InventoryDashboard Component
 * 
 * A component for displaying inventory statistics and low stock items.
 * Used in the admin section for inventory management.
 */

import React, { useState } from 'react';
import { Package, TrendingDown, AlertTriangle, Plus, ArrowUpRight } from 'lucide-react';
import Card from '@/components/ui/cards/Card';
import Button from '@/components/ui/buttons/Button';

/**
 * Inventory item interface
 */
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  lastUpdated: string;
}

/**
 * InventoryDashboard component
 */
const InventoryDashboard: React.FC = () => {
  // Sample inventory data
  const [lowStockItems] = useState<InventoryItem[]>([
    { 
      id: '1', 
      name: 'Cabinet Door Hinge', 
      category: 'Hardware', 
      currentStock: 5, 
      reorderPoint: 10,
      lastUpdated: '2025-05-15'
    },
    { 
      id: '2', 
      name: 'Door Handle', 
      category: 'Hardware', 
      currentStock: 3, 
      reorderPoint: 8,
      lastUpdated: '2025-05-18'
    },
    { 
      id: '3', 
      name: 'Mounting Bracket', 
      category: 'Hardware', 
      currentStock: 2, 
      reorderPoint: 5,
      lastUpdated: '2025-05-20'
    },
    { 
      id: '4', 
      name: 'Cabinet Board (600mm)', 
      category: 'Boards', 
      currentStock: 8, 
      reorderPoint: 15,
      lastUpdated: '2025-05-12'
    },
    { 
      id: '5', 
      name: 'Drawer Slides', 
      category: 'Hardware', 
      currentStock: 6, 
      reorderPoint: 12,
      lastUpdated: '2025-05-10'
    },
  ]);
  
  // Calculate inventory statistics
  const totalComponents = 24;
  const lowStockCount = lowStockItems.length;
  const inventoryValue = 1245.75;
  
  return (
    <div className="space-y-6">
      {/* Inventory statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Total Components</h2>
              <Package className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-3xl font-bold">{totalComponents}</p>
            <p className="text-secondary-500 text-sm mt-1">8 categories</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Low Stock Items</h2>
              <AlertTriangle className="w-8 h-8 text-warning-500" />
            </div>
            <p className="text-3xl font-bold">{lowStockCount}</p>
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
      
      {/* Low stock items */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Low Stock Items</h2>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowUpRight className="w-4 h-4 mr-1" />}
              >
                Export
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4 mr-1" />}
              >
                Order Stock
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Component</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Reorder Point</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-danger-600 font-medium">{item.currentStock}</td>
                    <td className="px-4 py-3 text-sm">{item.reorderPoint}</td>
                    <td className="px-4 py-3 text-sm">{item.lastUpdated}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.currentStock < item.reorderPoint / 2 
                          ? 'bg-danger-100 text-danger-800' 
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {item.currentStock < item.reorderPoint / 2 ? 'Critical' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      
      {/* Recent activity */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary-100 p-2 rounded-full mr-3">
                <Package className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Stock updated: Cabinet Door Hinge</p>
                <p className="text-xs text-secondary-500">Today, 10:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-success-100 p-2 rounded-full mr-3">
                <Plus className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New item added: Drawer Slides</p>
                <p className="text-xs text-secondary-500">Yesterday, 2:15 PM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-warning-100 p-2 rounded-full mr-3">
                <AlertTriangle className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Low stock alert: Mounting Bracket</p>
                <p className="text-xs text-secondary-500">Yesterday, 9:45 AM</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InventoryDashboard;
