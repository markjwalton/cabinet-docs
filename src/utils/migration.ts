/**
 * Data Migration Script
 * 
 * This script migrates data from localStorage to Supabase.
 * It handles all entities and ensures data integrity during migration.
 */

import { supabaseClient } from './supabase';
import { getLocalStorage, removeLocalStorage } from './storage';

// Types for the migration process
export type MigrationProgress = {
  entity: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  total: number;
  processed: number;
  message?: string;
};

export type MigrationResult = {
  success: boolean;
  entitiesProcessed: number;
  totalRecords: number;
  migratedRecords: number;
  errors: Record<string, string>;
  details: Record<string, any>;
};

// List of entities to migrate
const ENTITIES_TO_MIGRATE = [
  'components',
  'suppliers',
  'customers',
  'products',
  'product_components',
  'orders',
  'order_items',
  'boards',
  'documents',
  'stock_adjustments'
];

/**
 * Migrate a single entity from localStorage to Supabase
 * @param entity The entity name
 * @param onProgress Callback for progress updates
 * @returns Promise resolving to the migration result for this entity
 */
export const migrateEntity = async (
  entity: string,
  onProgress?: (progress: MigrationProgress) => void
): Promise<{
  success: boolean;
  total: number;
  migrated: number;
  error?: string;
  details?: any;
}> => {
  try {
    // Get data from localStorage
    const key = `cabinet_${entity}`;
    const data = getLocalStorage<any[]>(key);
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { success: true, total: 0, migrated: 0, details: { message: 'No data to migrate' } };
    }
    
    // Report initial progress
    if (onProgress) {
      onProgress({
        entity,
        status: 'in_progress',
        total: data.length,
        processed: 0
      });
    }
    
    // Prepare data for migration
    // Add created_at and updated_at if missing
    const now = new Date().toISOString();
    const preparedData = data.map(item => ({
      ...item,
      created_at: item.created_at || now,
      updated_at: item.updated_at || now
    }));
    
    // Insert data into Supabase
    const { data: insertedData, error } = await supabaseClient
      .from(entity)
      .insert(preparedData)
      .select();
    
    if (error) {
      if (onProgress) {
        onProgress({
          entity,
          status: 'error',
          total: data.length,
          processed: 0,
          message: error.message
        });
      }
      
      return {
        success: false,
        total: data.length,
        migrated: 0,
        error: error.message,
        details: { error }
      };
    }
    
    // Report completion
    if (onProgress) {
      onProgress({
        entity,
        status: 'completed',
        total: data.length,
        processed: data.length
      });
    }
    
    // Remove data from localStorage after successful migration
    removeLocalStorage(key);
    
    return {
      success: true,
      total: data.length,
      migrated: insertedData?.length || data.length,
      details: { insertedData }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (onProgress) {
      onProgress({
        entity,
        status: 'error',
        total: 0,
        processed: 0,
        message: errorMessage
      });
    }
    
    return {
      success: false,
      total: 0,
      migrated: 0,
      error: errorMessage,
      details: { error }
    };
  }
};

/**
 * Migrate all entities from localStorage to Supabase
 * @param entities Optional list of entities to migrate (defaults to all)
 * @param onProgress Callback for progress updates
 * @returns Promise resolving to the overall migration result
 */
export const migrateAllData = async (
  entities: string[] = ENTITIES_TO_MIGRATE,
  onProgress?: (progress: MigrationProgress) => void
): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    entitiesProcessed: 0,
    totalRecords: 0,
    migratedRecords: 0,
    errors: {},
    details: {}
  };
  
  // Process each entity
  for (const entity of entities) {
    // Report pending status
    if (onProgress) {
      onProgress({
        entity,
        status: 'pending',
        total: 0,
        processed: 0
      });
    }
    
    // Migrate the entity
    const entityResult = await migrateEntity(entity, onProgress);
    
    // Update overall result
    result.entitiesProcessed++;
    result.totalRecords += entityResult.total;
    result.migratedRecords += entityResult.migrated;
    result.details[entity] = entityResult;
    
    if (!entityResult.success) {
      result.success = false;
      result.errors[entity] = entityResult.error || 'Unknown error';
    }
  }
  
  return result;
};

/**
 * Check if there is data in localStorage that needs migration
 * @returns Promise resolving to an object with counts of records to migrate
 */
export const checkMigrationNeeded = async (): Promise<{
  needed: boolean;
  entities: Record<string, number>;
  totalRecords: number;
}> => {
  const result: {
    needed: boolean;
    entities: Record<string, number>;
    totalRecords: number;
  } = {
    needed: false,
    entities: {},
    totalRecords: 0
  };
  
  // Check each entity
  for (const entity of ENTITIES_TO_MIGRATE) {
    const key = `cabinet_${entity}`;
    const data = getLocalStorage<any[]>(key);
    
    if (data && Array.isArray(data) && data.length > 0) {
      result.needed = true;
      result.entities[entity] = data.length;
      result.totalRecords += data.length;
    } else {
      result.entities[entity] = 0;
    }
  }
  
  return result;
};

/**
 * Validate Supabase connection before migration
 * @returns Promise resolving to true if connection is valid
 */
export const validateSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabaseClient.from('components').select('count', { count: 'exact', head: true });
    
    return !error;
  } catch (error) {
    return false;
  }
};
