/**
 * Database Migration Utility
 * 
 * This utility runs SQL migrations for the forms management system.
 * It ensures the database schema is properly set up for dynamic forms.
 */

import { supabaseClient } from '@/utils/supabase';

/**
 * Run database migrations for forms management system
 */
export const runFormsMigrations = async (): Promise<void> => {
  try {
    console.log('Running forms management system migrations...');
    
    // Read the SQL file content
    const response = await fetch('/utils/database/forms_schema.sql');
    const sqlContent = await response.text();
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabaseClient.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing SQL statement: ${error.message}`);
        console.error('Statement:', statement);
        throw error;
      }
    }
    
    console.log('Forms management system migrations completed successfully');
  } catch (error) {
    console.error('Failed to run forms management system migrations:', error);
    throw error;
  }
};

/**
 * Initialize the database with required schemas and data
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Initializing database...');
    
    // Run forms management system migrations
    await runFormsMigrations();
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};
