/**
 * Form Service
 * 
 * This service handles all form-related operations with the Supabase database.
 * It provides functions for creating, reading, updating, and deleting forms,
 * as well as checking field data status and initializing default forms.
 */

import supabase from '@/lib/supabase/client';
import { FormDefinition, FormField, TableInfo } from '@/types/forms';

// Check if a field has data
export const checkFieldHasData = async (tableName: string, fieldName: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .not(fieldName, 'is', null);
      
    if (error) throw error;
    return count !== null && count > 0;
  } catch (error) {
    console.error(`Error checking if field ${fieldName} in table ${tableName} has data:`, error);
    return false;
  }
};

// Update a field's hasData status
export const updateFieldDataStatus = async (formId: string, fieldId: string, hasData: boolean): Promise<FormDefinition> => {
  try {
    // First get the current form
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();
      
    if (formError) throw formError;
    
    // Update the field's hasData property
    const updatedFields = form.fields.map((field: FormField) => {
      if (field.id === fieldId) {
        return { ...field, hasData };
      }
      return field;
    });
    
    // Update the form with the new fields
    const { data, error } = await supabase
      .from('forms')
      .update({ fields: updatedFields })
      .eq('id', formId)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error updating field data status for form ${formId}, field ${fieldId}:`, error);
    throw new Error('Failed to update field data status');
  }
};

// Initialize default forms
export const initializeDefaultForms = async (): Promise<FormDefinition[]> => {
  try {
    // Check if forms already exist
    const { count, error: countError } = await supabase
      .from('forms')
      .select('*', { count: 'exact', head: true });
      
    if (countError) throw countError;
    
    // If forms already exist, don't initialize
    if (count && count > 0) {
      const { data, error } = await supabase
        .from('forms')
        .select('*');
        
      if (error) throw error;
      return data;
    }
    
    // Define default forms
    const defaultForms = [
      {
        name: 'Product Form',
        description: 'Form for managing products',
        table_name: 'products',
        is_system: true,
        fields: [
          {
            id: 'field_1',
            label: 'Name',
            type: 'text',
            placeholder: 'Enter product name',
            required: true,
            order: 0,
            dbField: 'name',
            isSystem: true,
            hasData: false
          },
          {
            id: 'field_2',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Enter product description',
            required: false,
            order: 1,
            dbField: 'description',
            isSystem: true,
            hasData: false
          },
          {
            id: 'field_3',
            label: 'Price',
            type: 'number',
            placeholder: 'Enter product price',
            required: true,
            order: 2,
            dbField: 'price',
            isSystem: true,
            hasData: false
          }
        ]
      },
      {
        name: 'Order Form',
        description: 'Form for managing orders',
        table_name: 'orders',
        is_system: true,
        fields: [
          {
            id: 'field_1',
            label: 'Order Number',
            type: 'text',
            placeholder: 'Enter order number',
            required: true,
            order: 0,
            dbField: 'order_number',
            isSystem: true,
            hasData: false
          },
          {
            id: 'field_2',
            label: 'Customer',
            type: 'text',
            placeholder: 'Enter customer name',
            required: true,
            order: 1,
            dbField: 'customer',
            isSystem: true,
            hasData: false
          },
          {
            id: 'field_3',
            label: 'Order Date',
            type: 'date',
            placeholder: 'Select order date',
            required: true,
            order: 2,
            dbField: 'order_date',
            isSystem: true,
            hasData: false
          }
        ]
      }
    ];
    
    // Insert default forms
    const { data, error } = await supabase
      .from('forms')
      .insert(defaultForms)
      .select();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error initializing default forms:', error);
    throw new Error('Failed to initialize default forms');
  }
};

// Get all forms
export const getForms = async (): Promise<FormDefinition[]> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*');
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting forms:', error);
    throw new Error('Failed to get forms');
  }
};

// Get a form by ID
export const getFormById = async (id: string): Promise<FormDefinition> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error getting form with ID ${id}:`, error);
    throw new Error('Failed to get form');
  }
};

// Get a form by name
export const getFormByName = async (name: string): Promise<FormDefinition> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('name', name)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error getting form with name ${name}:`, error);
    throw new Error('Failed to get form');
  }
};

// Create a new form
export const createForm = async (form: Omit<FormDefinition, 'id'>): Promise<FormDefinition> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .insert(form)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating form:', error);
    throw new Error('Failed to create form');
  }
};

// Update an existing form
export const updateForm = async (id: string, updates: Partial<Omit<FormDefinition, 'id'>>): Promise<FormDefinition> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error updating form with ID ${id}:`, error);
    throw new Error('Failed to update form');
  }
};

// Delete a form
export const deleteForm = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting form with ID ${id}:`, error);
    throw new Error('Failed to delete form');
  }
};

// Get available tables
export const getAvailableTables = async (): Promise<TableInfo[]> => {
  try {
    // This is a placeholder - in a real application, you would fetch this from your database schema
    // For now, we'll return a hardcoded list of tables
    return [
      { name: 'products', display_name: 'Products' },
      { name: 'orders', display_name: 'Orders' },
      { name: 'customers', display_name: 'Customers' },
      { name: 'components', display_name: 'Components' }
    ];
  } catch (error) {
    console.error('Error getting available tables:', error);
    throw new Error('Failed to get available tables');
  }
};

// Check if a table has data
export const checkTableHasData = async (tableName: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    return count !== null && count > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} has data:`, error);
    return false;
  }
};

// Check which fields in a form have data
export const checkFieldsWithData = async (form: FormDefinition): Promise<FormField[]> => {
  try {
    const fieldsWithData: FormField[] = [];
    
    for (const field of form.fields) {
      const hasData = await checkFieldHasData(form.table_name, field.dbField);
      if (hasData) {
        fieldsWithData.push({ ...field, hasData: true });
      }
    }
    
    return fieldsWithData;
  } catch (error) {
    console.error(`Error checking fields with data for form ${form.id}:`, error);
    return [];
  }
};

// Submit form data
export const submitFormData = async (tableName: string, data: Record<string, any>): Promise<any> => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select()
      .single();
      
    if (error) throw error;
    
    return result;
  } catch (error) {
    console.error(`Error submitting form data to table ${tableName}:`, error);
    throw new Error('Failed to submit form data');
  }
};

// Default export for backward compatibility
export default {
  getForms,
  getFormById,
  getFormByName,
  createForm,
  updateForm,
  deleteForm,
  checkTableHasData,
  checkFieldsWithData,
  submitFormData,
  getAvailableTables,
  checkFieldHasData,
  updateFieldDataStatus,
  initializeDefaultForms
};
