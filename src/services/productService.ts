/**
 * Product Service
 * 
 * This service provides methods to interact with the products table in Supabase.
 * It handles CRUD operations and includes proper error handling and TypeScript typing.
 */

import { PostgrestError } from '@supabase/supabase-js';
import { supabaseClient, handleSupabaseError } from '@/utils/supabase';
import { Component } from './componentService';

// Types for the Product entity
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ProductComponent {
  id: string;
  product_id: string;
  component_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  component?: Component; // For joined queries
}

export type ProductCreate = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
export type ProductComponentCreate = Omit<ProductComponent, 'id' | 'created_at' | 'updated_at' | 'component'>;

/**
 * Get all products
 * @returns Promise resolving to an array of products
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch products');
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while fetching products');
  }
};

/**
 * Get a single product by ID
 * @param id The product ID
 * @returns Promise resolving to the product or null if not found
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        return null;
      }
      throw handleSupabaseError(error, `Failed to fetch product with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching product with ID: ${id}`);
  }
};

/**
 * Create a new product
 * @param product The product data to create
 * @returns Promise resolving to the created product
 */
export const createProduct = async (product: ProductCreate): Promise<Product> => {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to create product');
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while creating product');
  }
};

/**
 * Update an existing product
 * @param id The product ID to update
 * @param updates The product data to update
 * @returns Promise resolving to the updated product
 */
export const updateProduct = async (id: string, updates: ProductUpdate): Promise<Product> => {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to update product with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while updating product with ID: ${id}`);
  }
};

/**
 * Delete a product permanently
 * @param id The product ID to delete
 * @returns Promise resolving to true if successful
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to delete product with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while deleting product with ID: ${id}`);
  }
};

/**
 * Get products by category
 * @param category The category to filter by
 * @returns Promise resolving to an array of products
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('category', category)
      .order('name');
    
    if (error) {
      throw handleSupabaseError(error, `Failed to fetch products in category: ${category}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching products in category: ${category}`);
  }
};

/**
 * Get components for a product
 * @param productId The product ID
 * @returns Promise resolving to an array of product components with component details
 */
export const getProductComponents = async (productId: string): Promise<ProductComponent[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('product_components')
      .select(`
        *,
        component:components(*)
      `)
      .eq('product_id', productId);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to fetch components for product: ${productId}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching components for product: ${productId}`);
  }
};

/**
 * Add a component to a product
 * @param productComponent The product component relationship to create
 * @returns Promise resolving to the created product component
 */
export const addComponentToProduct = async (
  productComponent: ProductComponentCreate
): Promise<ProductComponent> => {
  try {
    const { data, error } = await supabaseClient
      .from('product_components')
      .insert([productComponent])
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to add component to product');
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while adding component to product');
  }
};

/**
 * Update a product component quantity
 * @param id The product component ID
 * @param quantity The new quantity
 * @returns Promise resolving to the updated product component
 */
export const updateProductComponentQuantity = async (
  id: string,
  quantity: number
): Promise<ProductComponent> => {
  try {
    const { data, error } = await supabaseClient
      .from('product_components')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to update product component quantity with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while updating product component quantity with ID: ${id}`);
  }
};

/**
 * Remove a component from a product
 * @param id The product component ID to remove
 * @returns Promise resolving to true if successful
 */
export const removeComponentFromProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('product_components')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to remove component from product with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while removing component from product with ID: ${id}`);
  }
};

/**
 * Calculate the total cost of a product based on its components
 * @param productId The product ID
 * @returns Promise resolving to the calculated cost
 */
export const calculateProductCost = async (productId: string): Promise<number> => {
  try {
    const productComponents = await getProductComponents(productId);
    
    let totalCost = 0;
    
    for (const pc of productComponents) {
      if (pc.component && pc.component.cost) {
        totalCost += pc.component.cost * pc.quantity;
      }
    }
    
    return totalCost;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `Failed to calculate cost for product: ${productId}`);
  }
};

/**
 * Search products by name or description
 * @param searchTerm The search term to look for
 * @returns Promise resolving to an array of matching products
 */
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const term = `%${searchTerm}%`;
    
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .or(`name.ilike.${term},description.ilike.${term}`)
      .order('name');
    
    if (error) {
      throw handleSupabaseError(error, `Failed to search products with term: ${searchTerm}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while searching products with term: ${searchTerm}`);
  }
};
