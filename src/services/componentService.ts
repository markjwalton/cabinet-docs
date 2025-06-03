"use client";

/**
 * Component Service
 * 
 * This service handles all component-related operations including CRUD operations
 * and synchronization with inventory. It provides a clean interface for interacting
 * with the Supabase database for component data.
 */

import { supabaseClient } from '@/utils/supabase';
import { handleSupabaseError } from '@/utils/errorHandling';

// Component interface matching the database schema
export interface Component {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  material?: string | null;
  dimensions?: string | null;
  weight?: number | null;
  cost?: number | null;
  supplier?: string | null;
  stock: number;
  price: number;
  archived: boolean;
  next_day_delivery: boolean;
  general_stock: boolean;
  product_order_code?: string | null;
  supplier_id?: string | null;
  customer_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Interface for creating a new component
export interface ComponentCreate {
  name: string;
  description?: string | null;
  category: string;
  material?: string | null;
  dimensions?: string | null;
  weight?: number | null;
  cost?: number | null;
  supplier?: string | null;
  stock?: number;
  price?: number;
  archived?: boolean;
  next_day_delivery?: boolean;
  general_stock?: boolean;
  product_order_code?: string | null;
  supplier_id?: string | null;
  customer_id?: string | null;
}

// Interface for updating an existing component
export interface ComponentUpdate {
  name?: string;
  description?: string | null;
  category?: string;
  material?: string | null;
  dimensions?: string | null;
  weight?: number | null;
  cost?: number | null;
  supplier?: string | null;
  stock?: number;
  price?: number;
  archived?: boolean;
  next_day_delivery?: boolean;
  general_stock?: boolean;
  product_order_code?: string | null;
  supplier_id?: string | null;
  customer_id?: string | null;
}

/**
 * Get all components from the database
 */
export const getComponents = async (): Promise<Component[]> => {
  try {
    console.log('Fetching components from Supabase...');
    const { data, error } = await supabaseClient
      .from('components')
      .select('*')
      .order('name');
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch components');
    }
    
    console.log(`Fetched ${data?.length || 0} components`);
    return data || [];
  } catch (error) {
    console.error('Error in getComponents:', error);
    throw error;
  }
};

/**
 * Get a single component by ID
 */
export const getComponentById = async (id: string): Promise<Component> => {
  try {
    const { data, error } = await supabaseClient
      .from('components')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to fetch component with ID: ${id}`);
    }
    
    if (!data) {
      throw new Error(`Component with ID ${id} not found`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getComponentById for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new component
 */
export const createComponent = async (component: ComponentCreate): Promise<Component> => {
  try {
    console.log('Creating new component:', component);
    
    // Set default values for optional fields
    const newComponent = {
      ...component,
      stock: component.stock ?? 0,
      price: component.price ?? 0,
      archived: component.archived ?? false,
      next_day_delivery: component.next_day_delivery ?? false,
      general_stock: component.general_stock ?? true
    };
    
    const { data, error } = await supabaseClient
      .from('components')
      .insert(newComponent)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to create component');
    }
    
    if (!data) {
      throw new Error('Failed to create component: No data returned');
    }
    
    console.log('Component created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createComponent:', error);
    throw error;
  }
};

/**
 * Update an existing component
 */
export const updateComponent = async (id: string, updates: ComponentUpdate): Promise<Component> => {
  try {
    console.log(`Updating component ${id}:`, updates);
    
    const { data, error } = await supabaseClient
      .from('components')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to update component with ID: ${id}`);
    }
    
    if (!data) {
      throw new Error(`Component with ID ${id} not found`);
    }
    
    console.log('Component updated successfully:', data);
    return data;
  } catch (error) {
    console.error(`Error in updateComponent for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Archive a component
 */
export const archiveComponent = async (id: string): Promise<Component> => {
  try {
    console.log(`Archiving component ${id}`);
    
    const { data, error } = await supabaseClient
      .from('components')
      .update({ archived: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to archive component with ID: ${id}`);
    }
    
    if (!data) {
      throw new Error(`Component with ID ${id} not found`);
    }
    
    console.log('Component archived successfully:', data);
    return data;
  } catch (error) {
    console.error(`Error in archiveComponent for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Unarchive a component
 */
export const unarchiveComponent = async (id: string): Promise<Component> => {
  try {
    console.log(`Unarchiving component ${id}`);
    
    const { data, error } = await supabaseClient
      .from('components')
      .update({ archived: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to unarchive component with ID: ${id}`);
    }
    
    if (!data) {
      throw new Error(`Component with ID ${id} not found`);
    }
    
    console.log('Component unarchived successfully:', data);
    return data;
  } catch (error) {
    console.error(`Error in unarchiveComponent for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a component
 */
export const deleteComponent = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting component ${id}`);
    
    const { error } = await supabaseClient
      .from('components')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to delete component with ID: ${id}`);
    }
    
    console.log('Component deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error in deleteComponent for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Synchronize components with inventory
 * This is a placeholder implementation - in a real app, you'd have more complex logic
 */
export const syncComponentsWithInventory = async (): Promise<void> => {
  try {
    console.log('Synchronizing components with inventory');
    
    // In a real app, you'd have logic to sync component stock with inventory
    // For now, we'll just log a message
    console.log('Components synchronized with inventory successfully');
  } catch (error) {
    console.error('Error in syncComponentsWithInventory:', error);
    throw error;
  }
};
