/**
 * Order Service
 * 
 * This service provides methods to interact with the orders table in Supabase.
 * It handles CRUD operations and includes proper error handling and TypeScript typing.
 */

import { PostgrestError } from '@supabase/supabase-js';
import { supabaseClient, handleSupabaseError } from '@/utils/supabase';
import { Product } from './productService';

// Types for the Order entity
export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: string;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product?: Product; // For joined queries
}

export type OrderCreate = Omit<Order, 'id' | 'created_at' | 'updated_at'>;
export type OrderUpdate = Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
export type OrderItemCreate = Omit<OrderItem, 'id' | 'created_at' | 'updated_at' | 'product'>;

/**
 * Get all orders
 * @returns Promise resolving to an array of orders
 */
export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to fetch orders');
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while fetching orders');
  }
};

/**
 * Get a single order by ID
 * @param id The order ID
 * @returns Promise resolving to the order or null if not found
 */
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        return null;
      }
      throw handleSupabaseError(error, `Failed to fetch order with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching order with ID: ${id}`);
  }
};

/**
 * Create a new order
 * @param order The order data to create
 * @returns Promise resolving to the created order
 */
export const createOrder = async (order: OrderCreate): Promise<Order> => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to create order');
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while creating order');
  }
};

/**
 * Update an existing order
 * @param id The order ID to update
 * @param updates The order data to update
 * @returns Promise resolving to the updated order
 */
export const updateOrder = async (id: string, updates: OrderUpdate): Promise<Order> => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to update order with ID: ${id}`);
    }
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while updating order with ID: ${id}`);
  }
};

/**
 * Delete an order permanently
 * @param id The order ID to delete
 * @returns Promise resolving to true if successful
 */
export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseClient
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to delete order with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while deleting order with ID: ${id}`);
  }
};

/**
 * Get orders by customer ID
 * @param customerId The customer ID to filter by
 * @returns Promise resolving to an array of orders
 */
export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
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

/**
 * Get orders by status
 * @param status The status to filter by
 * @returns Promise resolving to an array of orders
 */
export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw handleSupabaseError(error, `Failed to fetch orders with status: ${status}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching orders with status: ${status}`);
  }
};

/**
 * Get items for an order
 * @param orderId The order ID
 * @returns Promise resolving to an array of order items with product details
 */
export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  try {
    const { data, error } = await supabaseClient
      .from('order_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('order_id', orderId);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to fetch items for order: ${orderId}`);
    }
    
    return data || [];
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while fetching items for order: ${orderId}`);
  }
};

/**
 * Add an item to an order
 * @param orderItem The order item to create
 * @returns Promise resolving to the created order item
 */
export const addItemToOrder = async (orderItem: OrderItemCreate): Promise<OrderItem> => {
  try {
    const { data, error } = await supabaseClient
      .from('order_items')
      .insert([orderItem])
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to add item to order');
    }
    
    // Update the order total
    await updateOrderTotal(orderItem.order_id);
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while adding item to order');
  }
};

/**
 * Update an order item quantity
 * @param id The order item ID
 * @param quantity The new quantity
 * @param price Optional new price
 * @returns Promise resolving to the updated order item
 */
export const updateOrderItemQuantity = async (
  id: string,
  quantity: number,
  price?: number
): Promise<OrderItem> => {
  try {
    // Get the current order item to get the order_id
    const { data: currentItem, error: fetchError } = await supabaseClient
      .from('order_items')
      .select('order_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      throw handleSupabaseError(fetchError, `Failed to fetch order item with ID: ${id}`);
    }
    
    const updates: any = { quantity };
    if (price !== undefined) {
      updates.price = price;
    }
    
    const { data, error } = await supabaseClient
      .from('order_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw handleSupabaseError(error, `Failed to update order item quantity with ID: ${id}`);
    }
    
    // Update the order total
    await updateOrderTotal(currentItem.order_id);
    
    return data;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while updating order item quantity with ID: ${id}`);
  }
};

/**
 * Remove an item from an order
 * @param id The order item ID to remove
 * @returns Promise resolving to true if successful
 */
export const removeItemFromOrder = async (id: string): Promise<boolean> => {
  try {
    // Get the current order item to get the order_id
    const { data: currentItem, error: fetchError } = await supabaseClient
      .from('order_items')
      .select('order_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      throw handleSupabaseError(fetchError, `Failed to fetch order item with ID: ${id}`);
    }
    
    const { error } = await supabaseClient
      .from('order_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw handleSupabaseError(error, `Failed to remove item from order with ID: ${id}`);
    }
    
    // Update the order total
    await updateOrderTotal(currentItem.order_id);
    
    return true;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `An unexpected error occurred while removing item from order with ID: ${id}`);
  }
};

/**
 * Update the total for an order based on its items
 * @param orderId The order ID
 * @returns Promise resolving to the updated order
 */
export const updateOrderTotal = async (orderId: string): Promise<Order> => {
  try {
    // Get all items for the order
    const items = await getOrderItems(orderId);
    
    // Calculate the total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update the order with the new total
    return updateOrder(orderId, { total });
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, `Failed to update total for order: ${orderId}`);
  }
};

/**
 * Generate a unique order number
 * @returns Promise resolving to a unique order number
 */
export const generateOrderNumber = async (): Promise<string> => {
  // Get the current date
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  // Get the count of orders for today
  try {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    
    const { count, error } = await supabaseClient
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfDay)
      .lt('created_at', endOfDay);
    
    if (error) {
      throw handleSupabaseError(error, 'Failed to generate order number');
    }
    
    // Format: ORD-YY-MM-DD-XXX where XXX is the sequential number for the day
    const sequentialNumber = ((count || 0) + 1).toString().padStart(3, '0');
    return `ORD-${year}${month}${day}-${sequentialNumber}`;
  } catch (error) {
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred while generating order number');
  }
};
