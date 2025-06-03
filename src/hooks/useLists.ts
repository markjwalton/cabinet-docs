"use client";

/**
 * useLists Hook
 * 
 * Custom hook for managing dropdown lists and their items.
 * Provides functionality for creating, updating, and deleting lists and items.
 */

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define ListItem interface directly here instead of importing
export interface ListItem {
  id: string;
  value: string;
  label: string;
  order: number;
  description?: string;
}

// Define DropdownList interface directly here instead of importing
export interface DropdownList {
  id: string;
  name: string;
  description: string;
  items: ListItem[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for dropdown lists
const initialLists: DropdownList[] = [
  {
    id: '1',
    name: 'Cabinet Categories',
    description: 'Categories of wall mounted cabinets',
    items: [
      { id: 'item-1', value: 'Kitchen', label: 'Kitchen', description: 'Kitchen wall cabinets', order: 0 },
      { id: 'item-2', value: 'Bathroom', label: 'Bathroom', description: 'Bathroom wall cabinets', order: 1 },
      { id: 'item-3', value: 'Office', label: 'Office', description: 'Office wall cabinets', order: 2 },
      { id: 'item-4', value: 'Garage', label: 'Garage', description: 'Garage wall cabinets', order: 3 },
    ],
    createdAt: '2025-05-28T10:00:00Z',
    updatedAt: '2025-05-28T10:00:00Z',
  },
  {
    id: '2',
    name: 'Material Types',
    description: 'Types of materials used in cabinet construction',
    items: [
      { id: 'item-1', value: 'Wood', label: 'Wood', description: 'Solid wood materials', order: 0 },
      { id: 'item-2', value: 'MDF', label: 'MDF', description: 'Medium-density fibreboard', order: 1 },
      { id: 'item-3', value: 'Plywood', label: 'Plywood', description: 'Engineered wood sheets', order: 2 },
      { id: 'item-4', value: 'Metal', label: 'Metal', description: 'Metal components', order: 3 },
      { id: 'item-5', value: 'Glass', label: 'Glass', description: 'Glass components', order: 4 },
    ],
    createdAt: '2025-05-28T11:30:00Z',
    updatedAt: '2025-05-28T14:15:00Z',
  },
  {
    id: '3',
    name: 'Hardware Categories',
    description: 'Categories of cabinet hardware',
    items: [
      { id: 'item-1', value: 'Hinges', label: 'Hinges', description: 'Door hinges', order: 0 },
      { id: 'item-2', value: 'Handles', label: 'Handles', description: 'Door and drawer handles', order: 1 },
      { id: 'item-3', value: 'Brackets', label: 'Brackets', description: 'Mounting brackets', order: 2 },
      { id: 'item-4', value: 'Screws', label: 'Screws', description: 'Fasteners and screws', order: 3 },
    ],
    createdAt: '2025-05-28T15:45:00Z',
    updatedAt: '2025-05-28T15:45:00Z',
  },
];

/**
 * Hook for managing dropdown lists
 */
export const useLists = () => {
  const [lists, setLists] = useState<DropdownList[]>(initialLists);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load lists from API/database
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // For now, we're using the mock data
    setLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        setLists(initialLists);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load lists');
      setLoading(false);
    }
  }, []);

  /**
   * Create a new list
   */
  const createList = (list: Omit<DropdownList, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const now = new Date().toISOString();
      const newList: DropdownList = {
        id: uuidv4(),
        ...list,
        createdAt: now,
        updatedAt: now,
      };
      
      setLists([...lists, newList]);
      setLoading(false);
      return newList;
    } catch (err) {
      setError('Failed to create list');
      setLoading(false);
      return null;
    }
  };

  /**
   * Update an existing list
   */
  const updateList = (id: string, updates: Partial<DropdownList>) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const now = new Date().toISOString();
      const updatedLists = lists.map(list => {
        if (list.id === id) {
          return {
            ...list,
            ...updates,
            updatedAt: now,
          };
        }
        return list;
      });
      
      setLists(updatedLists);
      setLoading(false);
      return updatedLists.find(list => list.id === id) || null;
    } catch (err) {
      setError('Failed to update list');
      setLoading(false);
      return null;
    }
  };

  /**
   * Delete a list
   */
  const deleteList = (id: string) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const updatedLists = lists.filter(list => list.id !== id);
      setLists(updatedLists);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to delete list');
      setLoading(false);
      return false;
    }
  };

  /**
   * Add an item to a list
   */
  const addItem = (listId: string, item: Omit<ListItem, 'id' | 'order'>) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const updatedLists = lists.map(list => {
        if (list.id === listId) {
          const newItem: ListItem = {
            id: uuidv4(),
            ...item,
            order: list.items.length,
          };
          
          return {
            ...list,
            items: [...list.items, newItem],
            updatedAt: new Date().toISOString(),
          };
        }
        return list;
      });
      
      setLists(updatedLists);
      setLoading(false);
      return updatedLists.find(list => list.id === listId)?.items.slice(-1)[0] || null;
    } catch (err) {
      setError('Failed to add item');
      setLoading(false);
      return null;
    }
  };

  /**
   * Update an item in a list
   */
  const updateItem = (listId: string, itemId: string, updates: Partial<ListItem>) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const updatedLists = lists.map(list => {
        if (list.id === listId) {
          const updatedItems = list.items.map(item => {
            if (item.id === itemId) {
              return { ...item, ...updates };
            }
            return item;
          });
          
          return {
            ...list,
            items: updatedItems,
            updatedAt: new Date().toISOString(),
          };
        }
        return list;
      });
      
      setLists(updatedLists);
      setLoading(false);
      return updatedLists.find(list => list.id === listId)?.items.find(item => item.id === itemId) || null;
    } catch (err) {
      setError('Failed to update item');
      setLoading(false);
      return null;
    }
  };

  /**
   * Delete an item from a list
   */
  const deleteItem = (listId: string, itemId: string) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const updatedLists = lists.map(list => {
        if (list.id === listId) {
          const updatedItems = list.items.filter(item => item.id !== itemId);
          
          // Update order numbers
          const reorderedItems = updatedItems.map((item, index) => ({
            ...item,
            order: index,
          }));
          
          return {
            ...list,
            items: reorderedItems,
            updatedAt: new Date().toISOString(),
          };
        }
        return list;
      });
      
      setLists(updatedLists);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to delete item');
      setLoading(false);
      return false;
    }
  };

  /**
   * Reorder items in a list
   */
  const reorderItems = (listId: string, items: ListItem[]) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would be an API call to Supabase
      const updatedLists = lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items,
            updatedAt: new Date().toISOString(),
          };
        }
        return list;
      });
      
      setLists(updatedLists);
      setLoading(false);
      return updatedLists.find(list => list.id === listId)?.items || null;
    } catch (err) {
      setError('Failed to reorder items');
      setLoading(false);
      return null;
    }
  };

  /**
   * Get list by ID
   */
  const getListById = (id: string) => {
    return lists.find(list => list.id === id) || null;
  };

  /**
   * Get list items by list ID
   */
  const getListItems = (listId: string) => {
    return lists.find(list => list.id === listId)?.items || [];
  };

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    getListById,
    getListItems,
  };
};

export default useLists;
