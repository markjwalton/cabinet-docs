"use client";

/**
 * Supabase Client Utility
 * 
 * This file provides a centralized Supabase client instance for the application.
 * It handles initialization and provides typed access to the Supabase client.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { handleSupabaseError } from './errorHandling';

// Environment variables should be properly set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Type to define the database schema for better type safety
export type Database = {
  public: {
    tables: {
      components: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          material: string | null;
          dimensions: string | null;
          weight: number | null;
          cost: number | null;
          supplier: string | null;
          stock: number;
          price: number;
          archived: boolean;
          next_day_delivery: boolean;
          general_stock: boolean;
          product_order_code: string | null;
          supplier_id: string | null;
          customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
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
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          price: number;
          stock: number;
          status: string;
          archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: string;
          price: number;
          stock: number;
          status?: string;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          price?: number;
          stock?: number;
          status?: string;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      board_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          thickness: number;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          thickness: number;
          in_stock: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          thickness?: number;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      forms: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          table_name: string | null;
          is_system: boolean;
          fields: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          table_name?: string | null;
          is_system?: boolean;
          fields: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          table_name?: string | null;
          is_system?: boolean;
          fields?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Initialize the Supabase client
let supabaseClientInstance: SupabaseClient<Database> | null = null;

/**
 * Initialize and return the Supabase client.
 * This function ensures we only create one instance of the client.
 */
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabaseClientInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase URL and Anon Key must be provided. Check your environment variables.'
      );
    }

    supabaseClientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClientInstance;
};

// Export a pre-initialized client for convenience
export const supabaseClient = getSupabaseClient();

// Re-export handleSupabaseError for convenience
export { handleSupabaseError };

/**
 * Run a database migration script
 * @param sql The SQL script to run
 */
export const runMigration = async (sql: string): Promise<void> => {
  try {
    console.log('Running migration script...');
    const client = getSupabaseClient();
    
    // Split the SQL script into individual statements
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      await client.rpc('exec_sql', { sql: statement });
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  }
};

/**
 * Check if a table exists in the database
 * @param tableName The name of the table to check
 */
export const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};
