/**
 * Supplier Service
 * 
 * This service provides methods to interact with the suppliers table in Supabase.
 * It handles CRUD operations and includes proper error handling and TypeScript typing.
 */

import { PostgrestError } from '@supabase/supabase-js';
import { supabaseClient, handleSupabaseError } from '@/utils/supabase';

// Types for the Supplier entity
export interface Supplier {
  id: string;
  name: string;
  building_name: string | null;
  street: string;
  town: string | null;
  city: string;
  post_code: string;
  telephone: string | null;
  contact_name: string | null;
  mobile: string | null;
  email: string | null;
  is_archived: boolean;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type SupplierCreate = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;
export type SupplierUpdate = Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Get all suppliers with optional filtering for archived items
 * @param includeArchived Whether to include archived suppliers (default: false)
 * @returns Promise resolving to an array of suppliers
 */
export const getSuppliers = async (includeArchived = false): Promise<Supplier[]> => {
  try {
    let query = supabaseClient
      .from('suppliers')
      .select('*')
      .order('name');
    
    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch suppliers');
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while fetching suppliers');
  }
};

/**
 * Get a single supplier by ID
 * @param id The supplier ID
 * @returns Promise resolving to the supplier or null if not found
 */
export const getSupplierById = async (id: string): Promise<Supplier | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        return null;
      }
      throw handleSupabaseError(error, `Failed to fetch supplier with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching supplier with ID: ${id}`);
  }
};

/**
 * Create a new supplier
 * @param supplier The supplier data to create
 * @returns Promise resolving to the created supplier
 */
export const createSupplier = async (supplier: SupplierCreate): Promise<Supplier> => {
  try {
    // If address is not provided, generate it from the address components
    if (!supplier.address) {
      supplier.address = [
        supplier.building_name,
        supplier.street,
        supplier.town,
        supplier.city,
        supplier.post_code
      ].filter(Boolean).join(', ');
    }
    
    const { data, error } = await supabaseClient
      .from('suppliers')
      .insert([supplier])
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to create supplier');
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while creating supplier');
  }
};

/**
 * Update an existing supplier
 * @param id The supplier ID to update
 * @param updates The supplier data to update
 * @returns Promise resolving to the updated supplier
 */
export const updateSupplier = async (id: string, updates: SupplierUpdate): Promise<Supplier> => {
  try {
    // If any address components are updated, update the combined address field
    if (updates.building_name !== undefined || 
        updates.street !== undefined || 
        updates.town !== undefined || 
        updates.city !== undefined || 
        updates.post_code !== undefined) {
      
      // Get the current supplier to combine with updates
      const currentSupplier = await getSupplierById(id);
      if (!currentSupplier) {
        throw new Error(`Supplier with ID ${id} not found`);
      }
      
      // Create a merged supplier object with updates applied
      const mergedSupplier = {
        ...currentSupplier,
        ...updates
      };
      
      // Generate the new address field
      updates.address = [
        mergedSupplier.building_name,
        mergedSupplier.street,
        mergedSupplier.town,
        mergedSupplier.city,
        mergedSupplier.post_code
      ].filter(Boolean).join(', ');
    }
    
    const { data, error } = await supabaseClient
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to update supplier with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while updating supplier with ID: ${id}`);
  }
};

/**
 * Archive a supplier (soft delete)
 * @param id The supplier ID to archive
 * @returns Promise resolving to the archived supplier
 */
export const archiveSupplier = async (id: string): Promise<Supplier> => {
  return updateSupplier(id, { is_archived: true });
};

/**
 * Unarchive a supplier
 * @param id The supplier ID to unarchive
 * @returns Promise resolving to the unarchived supplier
 */
export const unarchiveSupplier = async (id: string): Promise<Supplier> => {
  return updateSupplier(id, { is_archived: false });
};

/**
 * Delete a supplier permanently
 * @param id The supplier ID to delete
 * @returns Promise resolving to true if successful
 */
export const deleteSupplier = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('suppliers')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to delete supplier with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while deleting supplier with ID: ${id}`);
  }
};

/**
 * Search suppliers by name or contact information
 * @param searchTerm The search term to look for
 * @param includeArchived Whether to include archived suppliers (default: false)
 * @returns Promise resolving to an array of matching suppliers
 */
export const searchSuppliers = async (
  searchTerm: string,
  includeArchived = false
): Promise<Supplier[]> => {
  try {
    const term = `%${searchTerm}%`;
    
    let query = supabaseClient
      .from('suppliers')
      .select('*')
      .or(`name.ilike.${term},contact_name.ilike.${term},email.ilike.${term}`)
      .order('name');
    
    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw handleSupabaseError(error, `Failed to search suppliers with term: ${searchTerm}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while searching suppliers with term: ${searchTerm}`);
  }
};
