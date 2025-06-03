/**
 * FormManagement Component with Fixed FormField and FormDefinition
 * 
 * This component manages forms in the admin section.
 * All FormField objects now include the required dbField property,
 * and FormDefinition objects include the required table_name property.
 */

import React, { useState } from 'react';

import FormBuilder from '@/components/admin/FormBuilder';
import Button from '@/components/ui/buttons/Button';
import Card from '@/components/ui/cards/Card';
import { useNotification } from '@/contexts/NotificationContext';
import { FormDefinition, FormField } from '@/types/forms';

interface FormManagementProps {
  // Add any props needed
}

const FormManagement: React.FC<FormManagementProps> = () => {
  const { showNotification } = useNotification();
  // Add eslint-disable comment to prevent unused variable warning
  // eslint-disable-next-line no-unused-vars
  
  
  const [forms, setForms] = useState<FormDefinition[]>([
    {
      id: 'customer-form',
      name: 'Customer Information',
      description: 'Collect customer details',
      table_name: 'customers', // Added required table_name property
      fields: [
        {
          id: 'name',
          label: 'Full Name',
          type: 'text',
          required: true,
          order: 0,
          dbField: 'full_name' // Added required dbField property
        },
        {
          id: 'email',
          label: 'Email Address',
          type: 'text',
          required: true,
          order: 1,
          dbField: 'email' // Added required dbField property
        },
        {
          id: 'phone',
          label: 'Phone Number',
          type: 'text',
          required: false,
          order: 2,
          dbField: 'phone' // Added required dbField property
        }
      ]
    },
    {
      id: 'product-form',
      name: 'Product Information',
      description: 'Collect product details',
      table_name: 'products', // Added required table_name property
      fields: [
        {
          id: 'name',
          label: 'Product Name',
          type: 'text',
          required: true,
          order: 0,
          dbField: 'product_name' // Added required dbField property
        },
        {
          id: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          order: 1,
          options: [
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'food', label: 'Food & Beverages' }
          ],
          dbField: 'category' // Added required dbField property
        },
        {
          id: 'price',
          label: 'Price',
          type: 'text',
          required: true,
          order: 2,
          dbField: 'price' // Added required dbField property
        },
        {
          id: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
          order: 3,
          dbField: 'description' // Added required dbField property
        }
      ]
    }
  ]);
  
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newFormDescription, setNewFormDescription] = useState('');
  const [newFormTableName, setNewFormTableName] = useState(''); // Added for table_name
  
  // Get active form
  const activeForm = activeFormId
    ? forms.find(form => form.id === activeFormId)
    : null;
  
  // Handle form selection
  const handleFormSelect = (formId: string) => {
    setActiveFormId(formId);
    setShowNewForm(false);
  };
  
  // Handle form fields update
  const handleFieldsUpdate = (updatedFields: FormField[]) => {
    if (!activeFormId) return;
    
    const updatedForms = forms.map(form => 
      form.id === activeFormId
        ? { ...form, fields: updatedFields }
        : form
    );
    
    setForms(updatedForms);
    
    showNotification({
      title: 'Success',
      message: 'Form fields updated successfully',
      type: 'success'
    });
  };
  
  // Handle new form creation
  const handleCreateForm = () => {
    if (!newFormName) {
      showNotification({
        title: 'Error',
        message: 'Form name is required',
        type: 'error'
      });
      return;
    }
    
    if (!newFormTableName) {
      showNotification({
        title: 'Error',
        message: 'Table name is required',
        type: 'error'
      });
      return;
    }
    
    const formId = newFormName.toLowerCase().replace(/\s+/g, '-');
    
    // Check for duplicate ID
    if (forms.some(form => form.id === formId)) {
      showNotification({
        title: 'Error',
        message: 'A form with this name already exists',
        type: 'error'
      });
      return;
    }
    
    const newForm: FormDefinition = {
      id: formId,
      name: newFormName,
      description: newFormDescription,
      table_name: newFormTableName, // Added required table_name property
      fields: []
    };
    
    setForms([...forms, newForm]);
    setActiveFormId(formId);
    setShowNewForm(false);
    
    // Reset form
    setNewFormName('');
    setNewFormDescription('');
    setNewFormTableName('');
    
    showNotification({
      title: 'Success',
      message: 'Form created successfully',
      type: 'success'
    });
  };
  
  // Handle form deletion
  const handleDeleteForm = (formId: string) => {
    const updatedForms = forms.filter(form => form.id !== formId);
    setForms(updatedForms);
    
    if (activeFormId === formId) {
      setActiveFormId(null);
    }
    
    showNotification({
      title: 'Success',
      message: 'Form deleted successfully',
      type: 'success'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Form Management</h1>
        <Button
          variant="primary"
          onClick={() => {
            setShowNewForm(true);
            setActiveFormId(null);
          }}
        >
          Create New Form
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-medium mb-4">Forms</h2>
              
              {forms.length === 0 ? (
                <p className="text-gray-500">No forms created yet.</p>
              ) : (
                <ul className="space-y-2">
                  {forms.map(form => (
                    <li
                      key={form.id}
                      className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                        activeFormId === form.id
                          ? 'bg-primary-100 border border-primary-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleFormSelect(form.id)}
                    >
                      <span className="font-medium">{form.name}</span>
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteForm(form.id);
                        }}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {showNewForm ? (
            <Card>
              <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Create New Form</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Form Name
                    </label>
                    <input
                      type="text"
                      value={newFormName}
                      onChange={(e) => setNewFormName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={newFormDescription}
                      onChange={(e) => setNewFormDescription(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Table Name
                    </label>
                    <input
                      type="text"
                      value={newFormTableName}
                      onChange={(e) => setNewFormTableName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowNewForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCreateForm}
                    >
                      Create Form
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : activeForm ? (
            <div className="space-y-4">
              <Card>
                <div className="p-4">
                  <h2 className="text-lg font-medium">{activeForm.name}</h2>
                  <p className="text-gray-600">{activeForm.description}</p>
                  <p className="text-gray-600">Table: {activeForm.table_name}</p>
                </div>
              </Card>
              
              <FormBuilder
                form={activeForm}
                onFieldsChange={handleFieldsUpdate}
              />
            </div>
          ) : (
            <Card>
              <div className="p-4 text-center">
                <p className="text-gray-500">
                  Select a form from the list or create a new one.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormManagement;
