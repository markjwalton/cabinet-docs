/**
 * AddComponentModal Component with Fixed Imports
 * 
 * This component provides a modal for adding new cabinet components.
 */

import Modal from '@/components/ui/modals/Modal';
import { useNotification } from '@/contexts/NotificationContext';
import React, { useState } from 'react';
import FormRenderer from '@/components/ui/forms/FormRenderer';

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (component: any) => void;
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

const AddComponentModal: React.FC<AddComponentModalProps> = ({
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
      label: 'Component Name',
      type: 'text',
      placeholder: 'Enter component name',
      required: true,
      order: 0,
      dbField: 'name'
    },
    {
      id: 'type',
      label: 'Component Type',
      type: 'select',
      placeholder: 'Select component type',
      required: true,
      order: 1,
      dbField: 'type',
      options: [
        { value: 'door', label: 'Door' },
        { value: 'drawer', label: 'Drawer' },
        { value: 'shelf', label: 'Shelf' },
        { value: 'hinge', label: 'Hinge' },
        { value: 'handle', label: 'Handle' }
      ]
    },
    {
      id: 'material',
      label: 'Material',
      type: 'select',
      placeholder: 'Select material',
      required: true,
      order: 2,
      dbField: 'material',
      options: [
        { value: 'wood', label: 'Wood' },
        { value: 'metal', label: 'Metal' },
        { value: 'plastic', label: 'Plastic' },
        { value: 'glass', label: 'Glass' },
        { value: 'composite', label: 'Composite' }
      ]
    },
    {
      id: 'price',
      label: 'Price',
      type: 'number',
      placeholder: 'Enter price',
      required: true,
      order: 3,
      dbField: 'price'
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description',
      required: false,
      order: 4,
      dbField: 'description'
    }
  ];

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      
      // In a real application, you would submit to an API
      // For demo purposes, just simulating a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create component object
      const component = {
        id: `comp_${Date.now()}`,
        name: values.name,
        type: values.type,
        material: values.material,
        price: parseFloat(values.price as string),
        description: values.description,
        createdAt: new Date().toISOString()
      };
      
      // Call onAdd callback
      onAdd(component);
      
      // Show success notification
      showNotification({
        title: 'Success',
        message: 'Component added successfully',
        type: 'success'
      });
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error adding component:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to add component',
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
      title="Add Component"
    >
      <FormRenderer
        formName="Add Component"
        fields={fields}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Add Component"
        cancelButtonText="Cancel"
        onCancel={onClose}
      />
    </Modal>
  );
};

export default AddComponentModal;
