/**
 * useInventory Hook
 * 
 * Custom hook for managing inventory data with Supabase integration.
 * Provides functionality for inventory items and stock adjustments.
 */

import { useState, useEffect } from 'react';
import inventoryService, { InventoryItem, StockAdjustment } from '../lib/supabase/inventory';
import componentService, { Component } from '../lib/supabase/components';

/**
 * Inventory item with component data
 */
export interface InventoryItemWithComponent extends InventoryItem {
  component?: Component | null;  // Updated to allow null
}

/**
 * Hook for managing inventory
 */
export const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemWithComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load inventory items with component data
  const loadInventoryItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const items = await inventoryService.getInventoryItems();
      
      // Fetch component data for each inventory item
      const itemsWithComponents = await Promise.all(
        items.map(async (item) => {
          const component = await componentService.getComponentById(item.componentId);
          return {
            ...item,
            component,
          };
        })
      );
      
      setInventoryItems(itemsWithComponents);
    } catch (err) {
      setError('Failed to load inventory items');
      console.error('Error loading inventory items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load inventory items on mount
  useEffect(() => {
    loadInventoryItems();
  }, []);

  /**
   * Get inventory item by ID
   */
  const getInventoryItemById = async (id: string): Promise<InventoryItemWithComponent | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const item = await inventoryService.getInventoryItemById(id);
      
      if (!item) {
        return null;
      }
      
      const component = await componentService.getComponentById(item.componentId);
      
      return {
        ...item,
        component,
      };
    } catch (err) {
      setError('Failed to load inventory item');
      console.error('Error loading inventory item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create inventory item
   */
  const createInventoryItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItemWithComponent | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newItem = await inventoryService.createInventoryItem(item);
      
      if (!newItem) {
        setError('Failed to create inventory item');
        return null;
      }
      
      const component = await componentService.getComponentById(newItem.componentId);
      
      const newItemWithComponent = {
        ...newItem,
        component,
      };
      
      setInventoryItems(prev => [newItemWithComponent, ...prev]);
      
      return newItemWithComponent;
    } catch (err) {
      setError('Failed to create inventory item');
      console.error('Error creating inventory item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update inventory item
   */
  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItemWithComponent | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedItem = await inventoryService.updateInventoryItem(id, updates);
      
      if (!updatedItem) {
        setError('Failed to update inventory item');
        return null;
      }
      
      const component = await componentService.getComponentById(updatedItem.componentId);
      
      const updatedItemWithComponent = {
        ...updatedItem,
        component,
      };
      
      setInventoryItems(prev => 
        prev.map(item => item.id === id ? updatedItemWithComponent : item)
      );
      
      return updatedItemWithComponent;
    } catch (err) {
      setError('Failed to update inventory item');
      console.error('Error updating inventory item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete inventory item
   */
  const deleteInventoryItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await inventoryService.deleteInventoryItem(id);
      
      if (success) {
        setInventoryItems(prev => prev.filter(item => item.id !== id));
        return true;
      } else {
        setError('Failed to delete inventory item');
        return false;
      }
    } catch (err) {
      setError('Failed to delete inventory item');
      console.error('Error deleting inventory item:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get stock adjustments for an inventory item
   */
  const getStockAdjustments = async (inventoryId: string): Promise<StockAdjustment[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const adjustments = await inventoryService.getStockAdjustments(inventoryId);
      return adjustments;
    } catch (err) {
      setError('Failed to load stock adjustments');
      console.error('Error loading stock adjustments:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create stock adjustment
   */
  const createStockAdjustment = async (adjustment: Omit<StockAdjustment, 'id'>): Promise<StockAdjustment | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newAdjustment = await inventoryService.createStockAdjustment(adjustment);
      
      if (!newAdjustment) {
        setError('Failed to create stock adjustment');
        return null;
      }
      
      // Refresh inventory items to get updated stock levels
      await loadInventoryItems();
      
      return newAdjustment;
    } catch (err) {
      setError('Failed to create stock adjustment');
      console.error('Error creating stock adjustment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get low stock items
   */
  const getLowStockItems = async (): Promise<InventoryItemWithComponent[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const items = await inventoryService.getLowStockItems();
      
      // Fetch component data for each inventory item
      const itemsWithComponents = await Promise.all(
        items.map(async (item) => {
          const component = await componentService.getComponentById(item.componentId);
          return {
            ...item,
            component,
          };
        })
      );
      
      return itemsWithComponents;
    } catch (err) {
      setError('Failed to load low stock items');
      console.error('Error loading low stock items:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get inventory value summary
   */
  const getInventoryValueSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const summary = await inventoryService.getInventoryValueSummary();
      return summary;
    } catch (err) {
      setError('Failed to load inventory value summary');
      console.error('Error loading inventory value summary:', err);
      return { totalItems: 0, totalValue: 0, averageValue: 0 };
    } finally {
      setLoading(false);
    }
  };

  return {
    inventoryItems,
    loading,
    error,
    loadInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getStockAdjustments,
    createStockAdjustment,
    getLowStockItems,
    getInventoryValueSummary,
  };
};

export default useInventory;
