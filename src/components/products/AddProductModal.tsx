/**
 * AddProductModal Component with Fixed Imports
 * 
 * This component provides a modal for adding new products.
 */

import Modal from '@/components/ui/modals/Modal';
import { useNotification } from '@/contexts/NotificationContext';
import React, { useState } from 'react';
import FormRenderer from '@/components/ui/forms/FormRenderer';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: any) => void;
}

// Define local FormField interface to match FormRenderer's expectations
interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  order: number;
  dbField: string;
  isSystem?: boolean;
  hasData?: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { showNotification } = useNotification();

  // Define form fields
  const fields: FormField[] = [
    {
      id: 'name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name',
      required: true,
      order: 0,
      dbField: 'name'
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Select category',
      required: true,
      order: 1,
      dbField: 'category',
      options: [
        { value: 'cabinets', label: 'Cabinets' },
        { value: 'hardware', label: 'Hardware' },
        { value: 'accessories', label: 'Accessories' },
        { value: 'tools', label: 'Tools' }
      ]
    },
    {
      id: 'price',
      label: 'Price',
      type: 'number',
      placeholder: 'Enter price',
      required: true,
      order: 2,
      dbField: 'price'
    },
    {
      id: 'sku',
      label: 'SKU',
      type: 'text',
      placeholder: 'Enter SKU',
      required: true,
      order: 3,
      dbField: 'sku'
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description',
      required: false,
      order: 4,
      dbField: 'description'
    },
    {
      id: 'inStock',
      label: 'In Stock',
      type: 'checkbox',
      required: false,
      order: 5,
      dbField: 'inStock'
    }
  ];

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      
      // In a real application, you would submit to an API
      // For demo purposes, just simulating a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create product object
      const product = {
        id: `prod_${Date.now()}`,
        name: values.name,
        category: values.category,
        price: parseFloat(values.price as string),
        sku: values.sku,
        description: values.description,
        inStock: values.inStock || false,
        createdAt: new Date().toISOString()
      };
      
      // Call onAdd callback
      onAdd(product);
      
      // Show success notification
      showNotification({
        title: 'Success',
        message: 'Product added successfully',
        type: 'success'
      });
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to add product',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Product"
    >
      <FormRenderer
        formName="Add Product"
        fields={fields}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Add Product"
        cancelButtonText="Cancel"
        onCancel={onClose}
      />
    </Modal>
  );
};

export default AddProductModal;
