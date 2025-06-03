/**
 * Customer Service
 * 
 * This service provides methods to interact with the customers table in Supabase.
 * It handles CRUD operations and includes proper error handling and TypeScript typing.
 */

import { PostgrestError } from '@supabase/supabase-js';
import { supabaseClient, handleSupabaseError } from '@/utils/supabase';

// Types for the Customer entity
export interface Customer {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export type CustomerCreate = Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
export type CustomerUpdate = Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Get all customers with optional filtering for archived items
 * @param includeArchived Whether to include archived customers (default: false)
 * @returns Promise resolving to an array of customers
 */
export const getCustomers = async (includeArchived = false): Promise<Customer[]> => {
  try {
    let query = supabaseClient
      .from('customers')
      .select('*')
      .order('name');
    
    if (!includeArchived) {
      query = query.eq('archived', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch customers');
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while fetching customers');
  }
};

/**
 * Get a single customer by ID
 * @param id The customer ID
 * @returns Promise resolving to the customer or null if not found
 */
export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        return null;
      }
      throw handleSupabaseError(error, `Failed to fetch customer with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching customer with ID: ${id}`);
  }
};

/**
 * Create a new customer
 * @param customer The customer data to create
 * @returns Promise resolving to the created customer
 */
export const createCustomer = async (customer: CustomerCreate): Promise<Customer> => {
  try {
    const { data, error } = await supabaseClient
      .from('customers')
      .insert([customer])
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to create customer');
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while creating customer');
  }
};

/**
 * Update an existing customer
 * @param id The customer ID to update
 * @param updates The customer data to update
 * @returns Promise resolving to the updated customer
 */
export const updateCustomer = async (id: string, updates: CustomerUpdate): Promise<Customer> => {
  try {
    const { data, error } = await supabaseClient
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to update customer with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while updating customer with ID: ${id}`);
  }
};

/**
 * Archive a customer (soft delete)
 * @param id The customer ID to archive
 * @returns Promise resolving to the archived customer
 */
export const archiveCustomer = async (id: string): Promise<Customer> => {
  return updateCustomer(id, { archived: true });
};

/**
 * Unarchive a customer
 * @param id The customer ID to unarchive
 * @returns Promise resolving to the unarchived customer
 */
export const unarchiveCustomer = async (id: string): Promise<Customer> => {
  return updateCustomer(id, { archived: false });
};

/**
 * Delete a customer permanently
 * @param id The customer ID to delete
 * @returns Promise resolving to true if successful
 */
export const deleteCustomer = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to delete customer with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while deleting customer with ID: ${id}`);
  }
};

/**
 * Search customers by name or contact information
 * @param searchTerm The search term to look for
 * @param includeArchived Whether to include archived customers (default: false)
 * @returns Promise resolving to an array of matching customers
 */
export const searchCustomers = async (
  searchTerm: string,
  includeArchived = false
): Promise<Customer[]> => {
  try {
    const term = `%${searchTerm}%`;
    
    let query = supabaseClient
      .from('customers')
      .select('*')
      .or(`name.ilike.${term},contact_name.ilike.${term},email.ilike.${term}`)
      .order('name');
    
    if (!includeArchived) {
      query = query.eq('archived', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw handleSupabaseError(error, `Failed to search customers with term: ${searchTerm}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while searching customers with term: ${searchTerm}`);
  }
};

/**
 * Get components associated with a customer
 * @param customerId The customer ID
 * @param includeArchived Whether to include archived components (default: false)
 * @returns Promise resolving to an array of components
 */
export const getCustomerComponents = async (
  customerId: string,
  includeArchived = false
): Promise<any[]> => {
  try {
    let query = supabaseClient
      .from('components')
      .select('*')
      .eq('customer_id', customerId)
      .order('name');
    
    if (!includeArchived) {
      query = query.eq('archived', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw handleSupabaseError(error, `Failed to fetch components for customer: ${customerId}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching components for customer: ${customerId}`);
  }
};

/**
 * Get orders associated with a customer
 * @param customerId The customer ID
 * @returns Promise resolving to an array of orders
 */
export const getCustomerOrders = async (customerId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw handleSupabaseError(error, `Failed to fetch orders for customer: ${customerId}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching orders for customer: ${customerId}`);
  }
};
