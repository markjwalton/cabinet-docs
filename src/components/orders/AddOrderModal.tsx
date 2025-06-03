/**
 * AddOrderModal Component with Fixed Imports
 * 
 * This component provides a modal for adding new orders.
 */

import Modal from '@/components/ui/modals/Modal';
import { useNotification } from '@/contexts/NotificationContext';
import React, { useState } from 'react';
import FormRenderer from '@/components/ui/forms/FormRenderer';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
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

const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { showNotification } = useNotification();

  // Define form fields
  const fields: FormField[] = [
    {
      id: 'customerName',
      label: 'Customer Name',
      type: 'text',
      placeholder: 'Enter customer name',
      required: true,
      order: 0,
      dbField: 'customerName'
    },
    {
      id: 'customerEmail',
      label: 'Customer Email',
      type: 'email',
      placeholder: 'Enter customer email',
      required: true,
      order: 1,
      dbField: 'customerEmail'
    },
    {
      id: 'orderType',
      label: 'Order Type',
      type: 'select',
      placeholder: 'Select order type',
      required: true,
      order: 2,
      dbField: 'orderType',
      options: [
        { value: 'standard', label: 'Standard' },
        { value: 'custom', label: 'Custom' },
        { value: 'rush', label: 'Rush' }
      ]
    },
    {
      id: 'totalAmount',
      label: 'Total Amount',
      type: 'number',
      placeholder: 'Enter total amount',
      required: true,
      order: 3,
      dbField: 'totalAmount'
    },
    {
      id: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Enter order notes',
      required: false,
      order: 4,
      dbField: 'notes'
    }
  ];

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      
      // In a real application, you would submit to an API
      // For demo purposes, just simulating a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create order object
      const order = {
        id: `order_${Date.now()}`,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        orderType: values.orderType,
        totalAmount: parseFloat(values.totalAmount as string),
        notes: values.notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Call onAdd callback
      onAdd(order);
      
      // Show success notification
      showNotification({
        title: 'Success',
        message: 'Order added successfully',
        type: 'success'
      });
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error adding order:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to add order',
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
      title="Add Order"
    >
      <FormRenderer
        formName="Add Order"
        fields={fields}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Add Order"
        cancelButtonText="Cancel"
        onCancel={onClose}
      />
    </Modal>
  );
};

export default AddOrderModal;
