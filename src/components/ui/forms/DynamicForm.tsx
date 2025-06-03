"use client";

/**
 * Dynamic Form Component
 * 
 * This component renders a form based on a form schema retrieved from the database.
 * It supports various field types and validation rules.
 */

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '@/components/ui/buttons/Button';
import { supabaseClient } from '@/utils/supabase';
import { useNotification } from '@/contexts/NotificationContext';
import { FormField, FormValues } from './FormField';

interface DynamicFormProps {
  formName: string;
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
}

export default function DynamicForm({
  formName,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  onCancel
}: DynamicFormProps) {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useNotification();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  });

  // Fetch form schema from database
  useEffect(() => {
    const fetchFormSchema = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabaseClient
          .from('forms')
          .select('fields')
          .eq('name', formName)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data && data.fields) {
          // Sort fields by order
          const sortedFields = Array.isArray(data.fields) 
            ? [...data.fields].sort((a, b) => a.order - b.order)
            : [];
          
          setFormFields(sortedFields);
        } else {
          // Fallback fields if form schema not found
          setFormFields([
            {
              id: 'name_field',
              label: 'Name',
              type: 'text',
              placeholder: 'Enter name',
              required: true,
              order: 0,
              dbField: 'name'
            },
            {
              id: 'description_field',
              label: 'Description',
              type: 'textarea',
              placeholder: 'Enter description',
              required: false,
              order: 1,
              dbField: 'description'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching form schema:', error);
        showError('Failed to load form', 'Please try again later');
        
        // Set minimal fallback fields
        setFormFields([
          {
            id: 'name_field',
            label: 'Name',
            type: 'text',
            placeholder: 'Enter name',
            required: true,
            order: 0,
            dbField: 'name'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormSchema();
  }, [formName, showError]);

  // Handle form submission
  const handleFormSubmit = (data: FormValues) => {
    // Transform form data to match database field names
    const transformedData: FormValues = {};
    
    formFields.forEach(field => {
      if (field.dbField && data[field.id] !== undefined) {
        transformedData[field.dbField] = data[field.id];
      }
    });
    
    onSubmit(transformedData);
  };

  // Render field based on type
  const renderField = (field: FormField) => {
    const { id, label, type, placeholder, required } = field;
    
    switch (type) {
      case 'text':
        return (
          <Controller
            key={id}
            name={id}
            control={control}
            rules={{ required: required ? `${label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={placeholder}
                  value={value || ''}
                  onChange={onChange}
                  disabled={isSubmitting}
                />
                {errors[id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
                )}
              </div>
            )}
          />
        );
        
      case 'textarea':
        return (
          <Controller
            key={id}
            name={id}
            control={control}
            rules={{ required: required ? `${label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  id={id}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={placeholder}
                  value={value || ''}
                  onChange={onChange}
                  rows={4}
                  disabled={isSubmitting}
                />
                {errors[id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
                )}
              </div>
            )}
          />
        );
        
      case 'number':
        return (
          <Controller
            key={id}
            name={id}
            control={control}
            rules={{ 
              required: required ? `${label} is required` : false,
              validate: value => !isNaN(Number(value)) || 'Must be a valid number'
            }}
            render={({ field: { onChange, value } }) => (
              <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={placeholder}
                  value={value || ''}
                  onChange={e => onChange(e.target.valueAsNumber || 0)}
                  disabled={isSubmitting}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                />
                {errors[id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
                )}
              </div>
            )}
          />
        );
        
      case 'checkbox':
        return (
          <Controller
            key={id}
            name={id}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="mb-4 flex items-center">
                <input
                  id={id}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={value || false}
                  onChange={e => onChange(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor={id} className="ml-2 block text-sm font-medium text-gray-700">
                  {label}
                </label>
              </div>
            )}
          />
        );
        
      case 'select':
        return (
          <Controller
            key={id}
            name={id}
            control={control}
            rules={{ required: required ? `${label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <select
                  id={id}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={value || ''}
                  onChange={onChange}
                  disabled={isSubmitting}
                  multiple={field.multiple}
                >
                  <option value="">Select {label}</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors[id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
                )}
              </div>
            )}
          />
        );
        
      case 'date':
        return (
          <Controller
            key={id}
            name={id}
            control={control}
            rules={{ required: required ? `${label} is required` : false }}
            render={({ field: { onChange, value } }) => (
              <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={value || ''}
                  onChange={onChange}
                  disabled={isSubmitting}
                />
                {errors[id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
                )}
              </div>
            )}
          />
        );
        
      case 'email':
        return (
          <Controller
            key={id}
            name={id}
            control={control}
            rules={{ 
              required: required ? `${label} is required` : false,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={placeholder}
                  value={value || ''}
                  onChange={onChange}
                  disabled={isSubmitting}
                />
                {errors[id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
                )}
              </div>
            )}
          />
        );
        
      case 'tel':
        return (
          <Controller
            key={id}
            name={id}
            control={control}
            rules={{ 
              required: required ? `${label} is required` : false,
              pattern: {
                value: /^[0-9+\-\s()]*$/,
                message: 'Invalid phone number'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={placeholder}
                  value={value || ''}
                  onChange={onChange}
                  disabled={isSubmitting}
                />
                {errors[id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
                )}
              </div>
            )}
          />
        );
        
      default:
        return (
          <div key={id} className="mb-4">
            <p className="text-sm text-red-600">Unknown field type: {type}</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {formFields.map(field => renderField(field))}
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelButtonText}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
