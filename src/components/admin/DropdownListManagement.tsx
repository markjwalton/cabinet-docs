/**
 * DropdownListManagement Component with Fixed Notification Format
 * 
 * This component allows administrators to manage dropdown lists.
 */

import { useNotification } from '@/contexts/NotificationContext';
import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/forms/Input';
import ListBuilderAdapter from './ListBuilderAdapter';

interface DropdownList {
  id: string;
  name: string;
  items: { id: string; value: string; label: string; order: number }[];
}

const DropdownListManagement: React.FC = () => {
  const [lists, setLists] = useState<DropdownList[]>([]);
  const [selectedList, setSelectedList] = useState<DropdownList | null>(null);
  const [newListName, setNewListName] = useState<string>('');
  const [isCreatingList, setIsCreatingList] = useState<boolean>(false);
  const { showNotification } = useNotification();

  // Load lists on component mount
  useEffect(() => {
    loadLists();
  }, []);

  // Load lists from API or local storage
  const loadLists = async () => {
    try {
      // For demo purposes, using mock data
      // In a real application, you would fetch from an API
      const mockLists: DropdownList[] = [
        {
          id: '1',
          name: 'Cabinet Types',
          items: [
            { id: '1', value: 'base', label: 'Base Cabinet', order: 0 },
            { id: '2', value: 'wall', label: 'Wall Cabinet', order: 1 },
            { id: '3', value: 'tall', label: 'Tall Cabinet', order: 2 },
            { id: '4', value: 'corner', label: 'Corner Cabinet', order: 3 }
          ]
        },
        {
          id: '2',
          name: 'Door Styles',
          items: [
            { id: '1', value: 'shaker', label: 'Shaker', order: 0 },
            { id: '2', value: 'flat', label: 'Flat Panel', order: 1 },
            { id: '3', value: 'raised', label: 'Raised Panel', order: 2 },
            { id: '4', value: 'glass', label: 'Glass Front', order: 3 }
          ]
        },
        {
          id: '3',
          name: 'Finishes',
          items: [
            { id: '1', value: 'painted', label: 'Painted', order: 0 },
            { id: '2', value: 'stained', label: 'Stained', order: 1 },
            { id: '3', value: 'natural', label: 'Natural', order: 2 },
            { id: '4', value: 'laminate', label: 'Laminate', order: 3 }
          ]
        }
      ];
      
      setLists(mockLists);
    } catch (error) {
      console.error('Error loading lists:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to load dropdown lists',
        type: 'error'
      });
    }
  };

  // Save list changes
  const handleSaveList = async (items: { id: string; value: string; label: string; order: number }[]) => {
    if (!selectedList) return;
    
    try {
      // In a real application, you would save to an API
      // For demo purposes, just updating state
      
      const updatedLists = lists.map(list => 
        list.id === selectedList.id ? { ...list, items } : list
      );
      
      setLists(updatedLists);
      setSelectedList({ ...selectedList, items });
      
      showNotification({
        title: 'Success',
        message: 'List saved successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving list:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to save list',
        type: 'error'
      });
    }
  };

  // Create a new list
  const handleCreateList = async () => {
    if (!newListName.trim()) {
      showNotification({
        title: 'Error',
        message: 'Please enter a list name',
        type: 'error'
      });
      return;
    }
    
    try {
      // In a real application, you would save to an API
      // For demo purposes, just updating state
      
      const newList: DropdownList = {
        id: `list_${Date.now()}`,
        name: newListName,
        items: []
      };
      
      setLists([...lists, newList]);
      setSelectedList(newList);
      setNewListName('');
      setIsCreatingList(false);
      
      showNotification({
        title: 'Success',
        message: 'List created successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating list:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to create list',
        type: 'error'
      });
    }
  };

  // Delete a list
  const handleDeleteList = async (listId: string) => {
    try {
      // In a real application, you would delete from an API
      // For demo purposes, just updating state
      
      const updatedLists = lists.filter(list => list.id !== listId);
      setLists(updatedLists);
      
      if (selectedList && selectedList.id === listId) {
        setSelectedList(null);
      }
      
      showNotification({
        title: 'Success',
        message: 'List deleted successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting list:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to delete list',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* List Selection */}
      <div className="flex flex-wrap gap-2">
        {lists.map(list => (
          <div
            key={list.id}
            className={`px-4 py-2 rounded-md cursor-pointer ${
              selectedList?.id === list.id
                ? 'bg-primary-100 border border-primary-300'
                : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedList(list)}
          >
            <div className="flex items-center justify-between">
              <span>{list.name}</span>
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList(list.id);
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 flex items-center"
          onClick={() => setIsCreatingList(true)}
        >
          <span className="mr-1">+</span> Add List
        </button>
      </div>
      
      {/* Create New List Form */}
      {isCreatingList && (
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-4">Create New List</h3>
          <div className="flex space-x-2">
            <Input
              id="new-list-name"
              label="List Name"
              type="text"
              value={newListName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
              placeholder="Enter list name"
              required={true}
            />
            <div className="flex items-end">
              <Button
                variant="primary"
                onClick={handleCreateList}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected List Editor */}
      {selectedList && (
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-4">{selectedList.name}</h3>
          <ListBuilderAdapter
            listName={selectedList.name}
            initialItems={selectedList.items}
            onItemsChange={handleSaveList}
          />
        </div>
      )}
    </div>
  );
};

export default DropdownListManagement;
