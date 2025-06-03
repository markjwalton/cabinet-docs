/**
 * FormBuilder Component with Fixed FormField Interface and Variable Name
 * 
 * This component allows users to build and customize forms.
 * The FormField interface has been updated to include the required dbField property,
 * and the variable name error in handleMoveField has been fixed.
 */

import Button from '@/components/ui/buttons/Button';
import Checkbox from '@/components/ui/forms/Checkbox';
import Input from '@/components/ui/forms/Input';
import Select from '@/components/ui/forms/Select';
import { useNotification } from '@/contexts/NotificationContext';
import React, { useState } from 'react';
// Removed unused imports: ValidationRule, FieldOption
import { FormDefinition, FormField, TableInfo } from '@/types/forms';

interface FormBuilderProps {
  form: FormDefinition;
  availableTables?: TableInfo[]; // Kept but marked as optional since it's unused
  onFieldsChange: (fields: FormField[]) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ form, onFieldsChange }) => {
  // Removed unused parameter: availableTables
  const { showNotification } = useNotification();
  const [activeField, setActiveField] = useState<FormField | null>(null);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState<FormField>({
    id: '',
    label: '',
    type: 'text',
    required: false,
    order: 0,
    options: [],
    dbField: '' // Added required dbField property
  });
  
  // Handle field selection
  const handleFieldSelect = (field: FormField) => {
    setActiveField(field);
    setShowAddField(false);
  };
  
  // Handle field update
  const handleFieldUpdate = (updatedField: FormField) => {
    const updatedFields = form.fields.map(field => 
      field.id === updatedField.id ? updatedField : field
    );
    
    onFieldsChange(updatedFields);
    showNotification({
      title: 'Success',
      message: 'Field updated successfully',
      type: 'success'
    });
  };
  
  // Handle field deletion
  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = form.fields.filter(field => field.id !== fieldId);
    onFieldsChange(updatedFields);
    setActiveField(null);
    
    showNotification({
      title: 'Success',
      message: 'Field deleted successfully',
      type: 'success'
    });
  };
  
  // Handle field reordering
  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = form.fields.findIndex(field => field.id === fieldId);
    if (fieldIndex === -1) return;
    
    // Fixed: Changed 'index' to 'fieldIndex'
    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    if (newIndex < 0 || newIndex >= form.fields.length) return;
    
    const updatedFields = [...form.fields];
    const temp = updatedFields[fieldIndex];
    updatedFields[fieldIndex] = updatedFields[newIndex];
    updatedFields[newIndex] = temp;
    
    // Update order property
    updatedFields.forEach((field, index) => {
      field.order = index;
    });
    
    onFieldsChange(updatedFields);
  };
  
  // Handle new field creation
  const handleAddField = () => {
    if (!newField.id || !newField.label) {
      showNotification({
        title: 'Error',
        message: 'Field ID and label are required',
        type: 'error'
      });
      return;
    }
    
    // Check for duplicate ID
    if (form.fields.some(field => field.id === newField.id)) {
      showNotification({
        title: 'Error',
        message: 'Field ID must be unique',
        type: 'error'
      });
      return;
    }
    
    const fieldToAdd: FormField = {
      ...newField,
      order: form.fields.length,
      dbField: newField.dbField || newField.id // Ensure dbField is set
    };
    
    const updatedFields = [...form.fields, fieldToAdd];
    onFieldsChange(updatedFields);
    
    // Reset new field form
    setNewField({
      id: '',
      label: '',
      type: 'text',
      required: false,
      order: 0,
      options: [],
      dbField: '' // Added required dbField property
    });
    
    setShowAddField(false);
    showNotification({
      title: 'Success',
      message: 'Field added successfully',
      type: 'success'
    });
  };
  
  // Handle new field option addition
  const handleAddOption = () => {
    if (!newField.options) {
      newField.options = [];
    }
    
    setNewField({
      ...newField,
      options: [
        ...newField.options,
        { value: '', label: '' }
      ]
    });
  };
  
  // Handle new field option update
  const handleOptionChange = (index: number, key: 'value' | 'label', value: string) => {
    if (!newField.options) return;
    
    const updatedOptions = [...newField.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [key]: value
    };
    
    setNewField({
      ...newField,
      options: updatedOptions
    });
  };
  
  // Handle new field option deletion
  const handleRemoveOption = (index: number) => {
    if (!newField.options) return;
    
    const updatedOptions = [...newField.options];
    updatedOptions.splice(index, 1);
    
    setNewField({
      ...newField,
      options: updatedOptions
    });
  };
  
  // Render field editor
  const renderFieldEditor = () => {
    if (!activeField) return null;
    
    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <h3 className="text-lg font-medium mb-4">Edit Field</h3>
        
        <div className="space-y-4">
          <Input
            id="edit-field-id"
            label="Field ID"
            type="text"
            value={activeField.id}
            onChange={(e) => setActiveField({
              ...activeField,
              id: e.target.value
            })}
            disabled
          />
          
          <Input
            id="edit-field-label"
            label="Field Label"
            type="text"
            value={activeField.label}
            onChange={(e) => setActiveField({
              ...activeField,
              label: e.target.value
            })}
          />
          
          <Input
            id="edit-field-dbfield"
            label="Database Field"
            type="text"
            value={activeField.dbField}
            onChange={(e) => setActiveField({
              ...activeField,
              dbField: e.target.value
            })}
          />
          
          <Select
            id="edit-field-type"
            label="Field Type"
            value={activeField.type}
            onChange={(e) => setActiveField({
              ...activeField,
              type: e.target.value as 'text' | 'select' | 'checkbox' | 'textarea'
            })}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'select', label: 'Select' },
              { value: 'checkbox', label: 'Checkbox' },
              { value: 'textarea', label: 'Text Area' }
            ]}
          />
          
          <Checkbox
            id="edit-field-required"
            label="Required"
            checked={!!activeField.required}
            onChange={(e) => setActiveField({
              ...activeField,
              required: e.target.checked
            })}
          />
          
          {(activeField.type === 'select') && (
            <div className="space-y-2">
              <h4 className="font-medium">Options</h4>
              
              {activeField.options && activeField.options.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    id={`edit-option-value-${index}`}
                    label="Value"
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const updatedOptions = [...(activeField.options || [])];
                      updatedOptions[index] = {
                        ...updatedOptions[index],
                        value: e.target.value
                      };
                      setActiveField({
                        ...activeField,
                        options: updatedOptions
                      });
                    }}
                  />
                  
                  <Input
                    id={`edit-option-label-${index}`}
                    label="Label"
                    type="text"
                    value={option.label}
                    onChange={(e) => {
                      const updatedOptions = [...(activeField.options || [])];
                      updatedOptions[index] = {
                        ...updatedOptions[index],
                        label: e.target.value
                      };
                      setActiveField({
                        ...activeField,
                        options: updatedOptions
                      });
                    }}
                  />
                  
                  <Button
                    variant="danger"
                    onClick={() => {
                      const updatedOptions = [...(activeField.options || [])];
                      updatedOptions.splice(index, 1);
                      setActiveField({
                        ...activeField,
                        options: updatedOptions
                      });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <Button
                variant="secondary"
                onClick={() => {
                  setActiveField({
                    ...activeField,
                    options: [
                      ...(activeField.options || []),
                      { value: '', label: '' }
                    ]
                  });
                }}
              >
                Add Option
              </Button>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="danger"
              onClick={() => handleFieldDelete(activeField.id)}
            >
              Delete
            </Button>
            
            <Button
              variant="primary"
              onClick={() => handleFieldUpdate(activeField)}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render new field form
  const renderNewFieldForm = () => {
    if (!showAddField) return null;
    
    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <h3 className="text-lg font-medium mb-4">Add New Field</h3>
        
        <div className="space-y-4">
          <Input
            id="new-field-id"
            label="Field ID"
            type="text"
            value={newField.id}
            onChange={(e) => setNewField({
              ...newField,
              id: e.target.value
            })}
          />
          
          <Input
            id="new-field-label"
            label="Field Label"
            type="text"
            value={newField.label}
            onChange={(e) => setNewField({
              ...newField,
              label: e.target.value
            })}
          />
          
          <Input
            id="new-field-dbfield"
            label="Database Field"
            type="text"
            value={newField.dbField}
            onChange={(e) => setNewField({
              ...newField,
              dbField: e.target.value
            })}
            placeholder={newField.id} // Use ID as placeholder for dbField
          />
          
          <Select
            id="new-field-type"
            label="Field Type"
            value={newField.type}
            onChange={(e) => setNewField({
              ...newField,
              type: e.target.value as 'text' | 'select' | 'checkbox' | 'textarea'
            })}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'select', label: 'Select' },
              { value: 'checkbox', label: 'Checkbox' },
              { value: 'textarea', label: 'Text Area' }
            ]}
          />
          
          <Checkbox
            id="new-field-required"
            label="Required"
            checked={newField.required === true} // Fixed: Ensure boolean value
            onChange={(e) => setNewField({
              ...newField,
              required: e.target.checked
            })}
          />
          
          {(newField.type === 'select') && (
            <div className="space-y-2">
              <h4 className="font-medium">Options</h4>
              
              {newField.options && newField.options.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    id={`new-option-value-${index}`}
                    label="Value"
                    type="text"
                    value={option.value}
                    onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                  />
                  
                  <Input
                    id={`new-option-label-${index}`}
                    label="Label"
                    type="text"
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                  />
                  
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <Button
                variant="secondary"
                onClick={handleAddOption}
              >
                Add Option
              </Button>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowAddField(false)}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleAddField}
            >
              Add Field
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Form Fields</h3>
            <Button
              variant="primary"
              onClick={() => {
                setShowAddField(true);
                setActiveField(null);
              }}
            >
              Add Field
            </Button>
          </div>
          
          {form.fields.length === 0 ? (
            <p className="text-gray-500">No fields added yet.</p>
          ) : (
            <ul className="space-y-2">
              {form.fields
                .sort((a, b) => a.order - b.order)
                .map(field => (
                  <li
                    key={field.id}
                    className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                      activeField?.id === field.id
                        ? 'bg-primary-100 border border-primary-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleFieldSelect(field)}
                  >
                    <div>
                      <span className="font-medium">{field.label}</span>
                      <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                      {field.required && (
                        <span className="text-sm text-red-500 ml-2">*</span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveField(field.id, 'up');
                        }}
                        disabled={field.order === 0}
                      >
                        ↑
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveField(field.id, 'down');
                        }}
                        disabled={field.order === form.fields.length - 1}
                      >
                        ↓
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="md:col-span-2">
        {renderFieldEditor()}
        {renderNewFieldForm()}
      </div>
    </div>
  );
};

export default FormBuilder;
