/**
 * Updated formService.ts
 * 
 * This service handles all form-related operations with Supabase.
 * It includes functions for retrieving, creating, updating, and deleting forms,
 * as well as checking field data status and initializing default forms.
 */

import supabase from '@/lib/supabase/client';
import { FormDefinition, FormField } from '@/types/forms';

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
    console.error(`Error checking if field ${fieldName} has data:`, error);
    return false;
  }
};

// Update field data status
export const updateFieldDataStatus = async (
  formId: string,
  fieldId: string,
  hasData: boolean
): Promise<FormDefinition> => {
  try {
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();
      
    if (formError) throw formError;
    
    const updatedFields = form.fields.map((field: FormField) => {
      if (field.id === fieldId) {
        return { ...field, hasData };
      }
      return field;
    });
    
    const { data, error } = await supabase
      .from('forms')
      .update({ fields: updatedFields })
      .eq('id', formId)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error updating field data status:`, error);
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
    
    if (count && count > 0) {
      return []; // Forms already exist
    }
    
    // Default forms to create
    const defaultForms: Omit<FormDefinition, 'id'>[] = [
      {
        name: 'Product Form',
        description: 'Form for managing product information',
        table_name: 'products',
        is_system: true,
        fields: [
          {
            id: `field_${Date.now()}_1`,
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
            id: `field_${Date.now()}_2`,
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
            id: `field_${Date.now()}_3`,
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
        name: 'Component Form',
        description: 'Form for managing component information',
        table_name: 'components',
        is_system: true,
        fields: [
          {
            id: `field_${Date.now()}_4`,
            label: 'Name',
            type: 'text',
            placeholder: 'Enter component name',
            required: true,
            order: 0,
            dbField: 'name',
            isSystem: true,
            hasData: false
          },
          {
            id: `field_${Date.now()}_5`,
            label: 'Type',
            type: 'select',
            placeholder: 'Select component type',
            required: true,
            order: 1,
            dbField: 'type',
            isSystem: true,
            hasData: false,
            options: [
              { value: 'hardware', label: 'Hardware' },
              { value: 'door', label: 'Door' },
              { value: 'shelf', label: 'Shelf' },
              { value: 'panel', label: 'Panel' }
            ]
          },
          {
            id: `field_${Date.now()}_6`,
            label: 'Cost',
            type: 'number',
            placeholder: 'Enter component cost',
            required: true,
            order: 2,
            dbField: 'cost',
            isSystem: true,
            hasData: false
          }
        ]
      }
    ];
    
    // Insert default forms
    const createdForms: FormDefinition[] = [];
    
    for (const form of defaultForms) {
      const { data, error } = await supabase
        .from('forms')
        .insert(form)
        .select()
        .single();
        
      if (error) throw error;
      createdForms.push(data);
    }
    
    return createdForms;
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
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching forms:', error);
    return [];
  }
};

// Get form by ID
export const getFormById = async (id: string): Promise<FormDefinition | null> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error fetching form with ID ${id}:`, error);
    return null;
  }
};

// Get form by name
export const getFormByName = async (name: string): Promise<FormDefinition | null> => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('name', name)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error fetching form with name ${name}:`, error);
    return null;
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
export const updateForm = async (
  id: string, 
  updates: Partial<Omit<FormDefinition, 'id'>>
): Promise<FormDefinition> => {
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
export const getAvailableTables = async (): Promise<{ value: string; label: string }[]> => {
  // In a real application, this would fetch tables from the database
  // For now, we'll return a static list
  return [
    { value: 'products', label: 'Products' },
    { value: 'components', label: 'Components' },
    { value: 'orders', label: 'Orders' },
    { value: 'customers', label: 'Customers' },
    { value: 'documents', label: 'Documents' }
  ];
};

// Check if table has data
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

// Check which fields have data
export const checkFieldsWithData = async (
  tableName: string,
  fields: FormField[]
): Promise<FormField[]> => {
  try {
    const updatedFields = [...fields];
    
    for (let i = 0; i < updatedFields.length; i++) {
      const field = updatedFields[i];
      const hasData = await checkFieldHasData(tableName, field.dbField);
      updatedFields[i] = { ...field, hasData };
    }
    
    return updatedFields;
  } catch (error) {
    console.error(`Error checking fields with data:`, error);
    return fields;
  }
};

// Submit form data
export const submitFormData = async (
  tableName: string,
  data: Record<string, any>,
  id?: string
): Promise<Record<string, any>> => {
  try {
    if (id) {
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return updatedData;
    } else {
      // Insert new record
      const { data: newData, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
        
      if (error) throw error;
      
      return newData;
    }
  } catch (error) {
    console.error(`Error submitting form data:`, error);
    throw new Error('Failed to submit form data');
  }
};

// For backward compatibility
export interface Form extends FormDefinition {}

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
