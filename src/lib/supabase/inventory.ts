/**
 * Inventory Service
 * 
 * Service for managing inventory data with Supabase integration.
 * Provides CRUD operations for inventory items and stock adjustments.
 */

import { v4 as uuidv4 } from 'uuid';
import supabase from './client';

/**
 * Inventory item interface
 */
export interface InventoryItem {
  id: string;
  componentId: string;
  currentStock: number;
  minimumStock: number;
  reorderPoint: number;
  unitCost: number;
  location?: string;
  lastStockCheck: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Stock adjustment interface
 */
export interface StockAdjustment {
  id: string;
  inventoryId: string;
  adjustmentType: 'addition' | 'reduction' | 'stocktake';
  quantity: number;
  reason?: string;
  performedBy?: string;
  performedAt: string;
}

/**
 * Inventory service for managing inventory in Supabase
 */
const inventoryService = {
  /**
   * Get all inventory items
   */
  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('updatedAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching inventory items:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getInventoryItems:', error);
      return [];
    }
  },
  
  /**
   * Get inventory item by ID
   */
  async getInventoryItemById(id: string): Promise<InventoryItem | null> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching inventory item by ID:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getInventoryItemById:', error);
      return null;
    }
  },
  
  /**
   * Get inventory item by component ID
   */
  async getInventoryItemByComponentId(componentId: string): Promise<InventoryItem | null> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('componentId', componentId)
        .single();
      
      if (error) {
        console.error('Error fetching inventory item by component ID:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getInventoryItemByComponentId:', error);
      return null;
    }
  },
  
  /**
   * Create inventory item
   */
  async createInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem | null> {
    try {
      const now = new Date().toISOString();
      const newItem: InventoryItem = {
        id: uuidv4(),
        ...item,
        createdAt: now,
        updatedAt: now,
      };
      
      const { data, error } = await supabase
        .from('inventory')
        .insert(newItem)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating inventory item:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in createInventoryItem:', error);
      return null;
    }
  },
  
  /**
   * Update inventory item
   */
  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    try {
      // Don't allow updating certain fields
      const { id: _, componentId: __, createdAt: ___, ...allowedUpdates } = updates;
      
      // Update the updatedAt timestamp
      const updatedData = {
        ...allowedUpdates,
        updatedAt: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('inventory')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating inventory item:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateInventoryItem:', error);
      return null;
    }
  },
  
  /**
   * Delete inventory item
   */
  async deleteInventoryItem(id: string): Promise<boolean> {
    try {
      // First delete all stock adjustments for this inventory item
      const { error: adjustmentError } = await supabase
        .from('stock_adjustments')
        .delete()
        .eq('inventoryId', id);
      
      if (adjustmentError) {
        console.error('Error deleting stock adjustments:', adjustmentError);
        return false;
      }
      
      // Then delete the inventory item
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting inventory item:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteInventoryItem:', error);
      return false;
    }
  },
  
  /**
   * Get stock adjustments for an inventory item
   */
  async getStockAdjustments(inventoryId: string): Promise<StockAdjustment[]> {
    try {
      const { data, error } = await supabase
        .from('stock_adjustments')
        .select('*')
        .eq('inventoryId', inventoryId)
        .order('performedAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching stock adjustments:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getStockAdjustments:', error);
      return [];
    }
  },
  
  /**
   * Create stock adjustment
   */
  async createStockAdjustment(adjustment: Omit<StockAdjustment, 'id'>): Promise<StockAdjustment | null> {
    try {
      const newAdjustment: StockAdjustment = {
        id: uuidv4(),
        ...adjustment,
      };
      
      // Start a transaction
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('currentStock')
        .eq('id', adjustment.inventoryId)
        .single();
      
      if (inventoryError) {
        console.error('Error fetching inventory for adjustment:', inventoryError);
        return null;
      }
      
      // Calculate new stock level
      let newStock = inventoryData.currentStock;
      
      if (adjustment.adjustmentType === 'addition') {
        newStock += adjustment.quantity;
      } else if (adjustment.adjustmentType === 'reduction') {
        newStock -= adjustment.quantity;
        
        // Prevent negative stock
        if (newStock < 0) {
          console.error('Stock adjustment would result in negative stock');
          return null;
        }
      } else if (adjustment.adjustmentType === 'stocktake') {
        newStock = adjustment.quantity;
      }
      
      // Update inventory stock level
      const { error: updateError } = await supabase
        .from('inventory')
        .update({
          currentStock: newStock,
          lastStockCheck: adjustment.performedAt,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', adjustment.inventoryId);
      
      if (updateError) {
        console.error('Error updating inventory stock level:', updateError);
        return null;
      }
      
      // Create adjustment record
      const { data, error } = await supabase
        .from('stock_adjustments')
        .insert(newAdjustment)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating stock adjustment:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in createStockAdjustment:', error);
      return null;
    }
  },
  
  /**
   * Get low stock items (below reorder point)
   */
  async getLowStockItems(): Promise<InventoryItem[]> {
    try {
      // Fetch all inventory items and filter in code
      // This replaces the unsupported supabase.raw method
      const { data, error } = await supabase
        .from('inventory')
        .select('*');
      
      if (error) {
        console.error('Error fetching inventory items for low stock check:', error);
        return [];
      }
      
      // Filter items where currentStock is less than reorderPoint
      const lowStockItems = data
        .filter(item => item.currentStock < item.reorderPoint)
        .sort((a, b) => a.currentStock - b.currentStock);
      
      return lowStockItems || [];
    } catch (error) {
      console.error('Error in getLowStockItems:', error);
      return [];
    }
  },
  
  /**
   * Get inventory value summary
   */
  async getInventoryValueSummary(): Promise<{ totalItems: number; totalValue: number; averageValue: number }> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('currentStock, unitCost');
      
      if (error) {
        console.error('Error fetching inventory for value calculation:', error);
        return { totalItems: 0, totalValue: 0, averageValue: 0 };
      }
      
      const totalItems = data.length;
      let totalValue = 0;
      
      data.forEach(item => {
        totalValue += item.currentStock * item.unitCost;
      });
      
      const averageValue = totalItems > 0 ? totalValue / totalItems : 0;
      
      return {
        totalItems,
        totalValue,
        averageValue,
      };
    } catch (error) {
      console.error('Error in getInventoryValueSummary:', error);
      return { totalItems: 0, totalValue: 0, averageValue: 0 };
    }
  },
};

export default inventoryService;
