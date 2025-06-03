/**
 * Component Service
 * 
 * Service for managing cabinet components with Supabase integration.
 * Provides CRUD operations for component data.
 */

import { v4 as uuidv4 } from 'uuid';
import supabase from './client';

/**
 * Component interface
 */
export interface Component {
  id: string;
  name: string;
  category: string;
  materialType: string;
  size: string;
  cost: number;
  defaultQty: number;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

/**
 * Component creation options
 */
export interface ComponentCreateOptions {
  name: string;
  category: string;
  materialType: string;
  size: string;
  cost: number;
  defaultQty: number;
  archived?: boolean;
}

/**
 * Component service for managing cabinet components in Supabase
 */
const componentService = {
  /**
   * Get all components
   */
  async getComponents(includeArchived: boolean = false): Promise<Component[]> {
    try {
      let query = supabase
        .from('components')
        .select('*')
        .order('name');
      
      if (!includeArchived) {
        query = query.eq('archived', false);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching components:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getComponents:', error);
      return [];
    }
  },
  
  /**
   * Get components by category
   */
  async getComponentsByCategory(category: string, includeArchived: boolean = false): Promise<Component[]> {
    try {
      let query = supabase
        .from('components')
        .select('*')
        .eq('category', category)
        .order('name');
      
      if (!includeArchived) {
        query = query.eq('archived', false);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching components by category:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getComponentsByCategory:', error);
      return [];
    }
  },
  
  /**
   * Get a component by ID
   */
  async getComponentById(id: string): Promise<Component | null> {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching component by ID:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getComponentById:', error);
      return null;
    }
  },
  
  /**
   * Create a new component
   */
  async createComponent(options: ComponentCreateOptions): Promise<Component | null> {
    try {
      const now = new Date().toISOString();
      const component: Component = {
        id: uuidv4(),
        ...options,
        createdAt: now,
        updatedAt: now,
      };
      
      const { data, error } = await supabase
        .from('components')
        .insert(component)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating component:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in createComponent:', error);
      return null;
    }
  },
  
  /**
   * Update a component
   */
  async updateComponent(id: string, updates: Partial<Component>): Promise<Component | null> {
    try {
      // Don't allow updating certain fields
      const { id: _, createdAt: __, ...allowedUpdates } = updates;
      
      // Update the lastModifiedAt timestamp
      const updatedData = {
        ...allowedUpdates,
        updatedAt: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('components')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating component:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateComponent:', error);
      return null;
    }
  },
  
  /**
   * Archive a component
   */
  async archiveComponent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('components')
        .update({
          archived: true,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error archiving component:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in archiveComponent:', error);
      return false;
    }
  },
  
  /**
   * Unarchive a component
   */
  async unarchiveComponent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('components')
        .update({
          archived: false,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error unarchiving component:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in unarchiveComponent:', error);
      return false;
    }
  },
  
  /**
   * Delete a component
   */
  async deleteComponent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting component:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteComponent:', error);
      return false;
    }
  },
  
  /**
   * Search components
   */
  async searchComponents(query: string, includeArchived: boolean = false): Promise<Component[]> {
    try {
      let baseQuery = supabase
        .from('components')
        .select('*');
      
      if (!includeArchived) {
        baseQuery = baseQuery.eq('archived', false);
      }
      
      // Search in name, category, and materialType
      const { data, error } = await baseQuery
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,materialType.ilike.%${query}%`)
        .order('name');
      
      if (error) {
        console.error('Error searching components:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in searchComponents:', error);
      return [];
    }
  },
};

export default componentService;
