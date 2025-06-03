/**
 * DataContext
 * 
 * A context provider for managing data persistence and state throughout the application.
 * Provides methods to interact with Supabase and local storage as a fallback.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/utils/supabase';
import { getLocalStorage, removeLocalStorage } from '@/utils/storage';
import { useNotification } from './NotificationContext';
import { 
  Component, 
  ComponentCreate, 
  ComponentUpdate, 
  getComponents as fetchComponents,
  createComponent as createComponentService,
  updateComponent as updateComponentService,
  archiveComponent as archiveComponentService,
  unarchiveComponent as unarchiveComponentService,
  deleteComponent as deleteComponentService,
  syncComponentsWithInventory as syncComponentsWithInventoryService
} from '@/services/componentService';

// Define InventoryItem interface
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  lastUpdated?: string;
}

// Define InventoryItemCreate interface for adding new inventory items
export interface InventoryItemCreate {
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
}

// Define Product interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status?: string;
  archived?: boolean;
  components?: Component[];
  created_at?: string;
  updated_at?: string;
}

// Define ProductCreate interface for adding new products
export interface ProductCreate {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status?: string;
  archived?: boolean;
}

// Define BoardType interface
export interface BoardType {
  id: string;
  name: string;
  description?: string;
  thickness: number;
  in_stock: boolean;
  created_at?: string;
  updated_at?: string;
}

// Define BoardTypeCreate interface for adding new board types
export interface BoardTypeCreate {
  name: string;
  description?: string;
  thickness: number;
  in_stock: boolean;
}

// Types for the data context
type DataContextType = {
  isOnline: boolean;
  isPersisting: boolean;
  syncLocalData: () => Promise<void>;
  clearLocalData: () => void;
  // Component-related properties and methods
  components: Component[];
  addComponent: (component: ComponentCreate) => Promise<Component>;
  updateComponent: (id: string, updates: ComponentUpdate) => Promise<Component>;
  archiveComponent: (id: string) => Promise<Component>;
  unarchiveComponent: (id: string) => Promise<Component>;
  deleteComponent: (id: string) => Promise<boolean>;
  syncComponentsWithInventory: () => Promise<void>;
  // Inventory-related properties and methods
  inventory: InventoryItem[];
  adjustStock: (id: string, adjustment: number) => Promise<InventoryItem>;
  addInventoryItem: (item: InventoryItemCreate) => Promise<InventoryItem>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItemCreate>) => Promise<InventoryItem>;
  // Product-related properties and methods
  products: Product[];
  addProduct: (product: ProductCreate) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<ProductCreate>) => Promise<Product>;
  updateProductComponents: (id: string, componentIds: string[]) => Promise<Product>;
  // Board type-related properties and methods
  boardTypes: BoardType[];
  addBoardType: (boardType: BoardTypeCreate) => Promise<BoardType>;
  updateBoardType: (id: string, updates: Partial<BoardTypeCreate>) => Promise<BoardType>;
  deleteBoardType: (id: string) => Promise<boolean>;
};

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * DataProvider component
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  // IMPORTANT: All hooks must be called at the top level of the component
  // This is correct usage of the useNotification hook
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isPersisting, setIsPersisting] = useState<boolean>(false);
  const [components, setComponents] = useState<Component[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [boardTypes, setBoardTypes] = useState<BoardType[]>([]);
  
  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showSuccess('Connection restored', 'You are back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showWarning('You are offline', 'Changes will be saved locally until connection is restored');
    };

    // Set initial status
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showSuccess, showWarning]);

  // Load components on mount
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const data = await fetchComponents();
        setComponents(data);
      } catch (error) {
        console.error('Error loading components:', error);
        showError('Failed to load components', 'Please try again later');
      }
    };

    loadComponents();
  }, [showError]);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('products')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products', 'Please try again later');
      }
    };

    loadProducts();
  }, [showError]);

  // Load board types on mount
  useEffect(() => {
    const loadBoardTypes = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('board_types')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setBoardTypes(data || []);
      } catch (error) {
        console.error('Error loading board types:', error);
        showError('Failed to load board types', 'Please try again later');
      }
    };

    loadBoardTypes();
  }, [showError]);

  // Load inventory on mount (placeholder implementation)
  useEffect(() => {
    // This is a placeholder implementation - in a real app, you'd fetch from Supabase
    const loadInventory = async () => {
      try {
        // Mock data for demonstration
        const mockInventory: InventoryItem[] = [
          {
            id: '1',
            name: 'Cabinet Hinges',
            category: 'Hardware',
            currentStock: 120,
            reorderPoint: 50,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Door Handles',
            category: 'Hardware',
            currentStock: 85,
            reorderPoint: 40,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Oak Panels',
            category: 'Panels',
            currentStock: 30,
            reorderPoint: 15,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Drawer Slides',
            category: 'Hardware',
            currentStock: 45,
            reorderPoint: 50,
            lastUpdated: new Date().toISOString()
          }
        ];
        
        setInventory(mockInventory);
      } catch (error) {
        console.error('Error loading inventory:', error);
        showError('Failed to load inventory', 'Please try again later');
      }
    };

    loadInventory();
  }, [showError]);

  // Sync local data to Supabase when back online
  const syncLocalData = useCallback(async () => {
    if (!isOnline) {
      showWarning('Cannot sync', 'You are currently offline');
      return;
    }

    try {
      setIsPersisting(true);

      // Get all local storage keys that start with 'pending_'
      const pendingKeys = Object.keys(localStorage).filter(key => key.startsWith('pending_'));

      if (pendingKeys.length === 0) {
        showInfo('No pending changes', 'All data is already synchronized');
        return;
      }

      // Process each pending operation
      for (const key of pendingKeys) {
        const operation = getLocalStorage(key);
        if (!operation) continue;

        // Safely access properties with type checking
        if (typeof operation === 'object' && operation !== null) {
          const table = 'table' in operation ? String(operation.table) : '';
          const action = 'action' in operation ? String(operation.action) : '';
          const data = 'data' in operation ? operation.data : {};
          const id = 'id' in operation ? String(operation.id) : '';

          // Perform the operation on Supabase
          switch (action) {
            case 'insert':
              await supabaseClient.from(table).insert(data);
              break;
            case 'update':
              await supabaseClient.from(table).update(data).eq('id', id);
              break;
            case 'delete':
              await supabaseClient.from(table).delete().eq('id', id);
              break;
          }
        }

        // Remove the pending operation from local storage
        removeLocalStorage(key);
      }

      showSuccess('Sync complete', `${pendingKeys.length} changes synchronized`);
    } catch (error) {
      console.error('Error syncing local data:', error);
      showError('Sync failed', 'There was an error synchronizing your data');
    } finally {
      setIsPersisting(false);
    }
  }, [isOnline, showWarning, showSuccess, showError, showInfo]);

  // Clear all local data
  const clearLocalData = useCallback(() => {
    try {
      // Get all local storage keys related to our app
      const appKeys = Object.keys(localStorage).filter(
        key => key.startsWith('cabinet_') || key.startsWith('pending_')
      );

      // Remove each key
      for (const key of appKeys) {
        removeLocalStorage(key);
      }

      showSuccess('Local data cleared', 'All local data has been removed');
    } catch (error) {
      console.error('Error clearing local data:', error);
      showError('Clear failed', 'There was an error clearing your local data');
    }
  }, [showSuccess, showError]);

  // Add a component
  const addComponent = useCallback(async (component: ComponentCreate): Promise<Component> => {
    try {
      const newComponent = await createComponentService(component);
      setComponents(prev => [...prev, newComponent]);
      showSuccess('Component added', `${component.name} has been added successfully`);
      return newComponent;
    } catch (error) {
      console.error('Error adding component:', error);
      showError('Failed to add component', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Update a component
  const updateComponent = useCallback(async (id: string, updates: ComponentUpdate): Promise<Component> => {
    try {
      const updatedComponent = await updateComponentService(id, updates);
      setComponents(prev => prev.map(comp => comp.id === id ? updatedComponent : comp));
      showSuccess('Component updated', `Component has been updated successfully`);
      return updatedComponent;
    } catch (error) {
      console.error('Error updating component:', error);
      showError('Failed to update component', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Archive a component
  const archiveComponent = useCallback(async (id: string): Promise<Component> => {
    try {
      const archivedComponent = await archiveComponentService(id);
      setComponents(prev => prev.map(comp => comp.id === id ? archivedComponent : comp));
      showSuccess('Component archived', `Component has been archived successfully`);
      return archivedComponent;
    } catch (error) {
      console.error('Error archiving component:', error);
      showError('Failed to archive component', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Unarchive a component
  const unarchiveComponent = useCallback(async (id: string): Promise<Component> => {
    try {
      const unarchivedComponent = await unarchiveComponentService(id);
      setComponents(prev => prev.map(comp => comp.id === id ? unarchivedComponent : comp));
      showSuccess('Component unarchived', `Component has been unarchived successfully`);
      return unarchivedComponent;
    } catch (error) {
      console.error('Error unarchiving component:', error);
      showError('Failed to unarchive component', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Delete a component
  const deleteComponent = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await deleteComponentService(id);
      if (success) {
        setComponents(prev => prev.filter(comp => comp.id !== id));
        showSuccess('Component deleted', `Component has been deleted successfully`);
      }
      return success;
    } catch (error) {
      console.error('Error deleting component:', error);
      showError('Failed to delete component', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Sync components with inventory
  const syncComponentsWithInventory = useCallback(async (): Promise<void> => {
    try {
      await syncComponentsWithInventoryService();
      // Refresh components after sync
      const refreshedComponents = await fetchComponents();
      setComponents(refreshedComponents);
      showSuccess('Inventory synced', 'Components have been synchronized with inventory');
    } catch (error) {
      console.error('Error syncing with inventory:', error);
      showError('Sync failed', 'Failed to synchronize components with inventory');
      throw error;
    }
  }, [showSuccess, showError]);

  // Adjust inventory stock
  const adjustStock = useCallback(async (id: string, adjustment: number): Promise<InventoryItem> => {
    try {
      // Find the item
      const item = inventory.find(item => item.id === id);
      if (!item) {
        throw new Error('Inventory item not found');
      }

      // Calculate new stock level (minimum 0)
      const newStock = Math.max(0, item.currentStock + adjustment);

      // Update the item
      const updatedItem: InventoryItem = {
        ...item,
        currentStock: newStock,
        lastUpdated: new Date().toISOString()
      };

      // In a real app, you'd update Supabase here
      // await supabaseClient.from('inventory').update({ current_stock: newStock }).eq('id', id);

      // Update local state
      setInventory(prev => prev.map(i => i.id === id ? updatedItem : i));

      showSuccess('Stock adjusted', `${item.name} stock has been updated`);
      return updatedItem;
    } catch (error) {
      console.error('Error adjusting stock:', error);
      showError('Failed to adjust stock', 'Please try again later');
      throw error;
    }
  }, [inventory, showSuccess, showError]);

  // Add inventory item
  const addInventoryItem = useCallback(async (item: InventoryItemCreate): Promise<InventoryItem> => {
    try {
      // In a real app, you'd insert into Supabase and get the ID back
      // const { data, error } = await supabaseClient.from('inventory').insert(item).select().single();
      
      // Mock implementation
      const newItem: InventoryItem = {
        ...item,
        id: `inv_${Date.now()}`,
        lastUpdated: new Date().toISOString()
      };

      // Update local state
      setInventory(prev => [...prev, newItem]);

      showSuccess('Item added', `${item.name} has been added to inventory`);
      return newItem;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      showError('Failed to add item', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Update inventory item
  const updateInventoryItem = useCallback(async (id: string, updates: Partial<InventoryItemCreate>): Promise<InventoryItem> => {
    try {
      // Find the item
      const item = inventory.find(item => item.id === id);
      if (!item) {
        throw new Error('Inventory item not found');
      }

      // Update the item
      const updatedItem: InventoryItem = {
        ...item,
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      // In a real app, you'd update Supabase here
      // await supabaseClient.from('inventory').update(updates).eq('id', id);

      // Update local state
      setInventory(prev => prev.map(i => i.id === id ? updatedItem : i));

      showSuccess('Item updated', `${updatedItem.name} has been updated`);
      return updatedItem;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      showError('Failed to update item', 'Please try again later');
      throw error;
    }
  }, [inventory, showSuccess, showError]);

  // Add a product
  const addProduct = useCallback(async (product: ProductCreate): Promise<Product> => {
    try {
      // In a real app, you'd insert into Supabase and get the ID back
      const { data, error } = await supabaseClient
        .from('products')
        .insert({
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to create product');
      }

      // Update local state
      const newProduct: Product = data;
      setProducts(prev => [...prev, newProduct]);

      showSuccess('Product added', `${product.name} has been added successfully`);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      showError('Failed to add product', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Update a product
  const updateProduct = useCallback(async (id: string, updates: Partial<ProductCreate>): Promise<Product> => {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to update product');
      }

      // Update local state
      const updatedProduct: Product = data;
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));

      showSuccess('Product updated', `Product has been updated successfully`);
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      showError('Failed to update product', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Update product components
  const updateProductComponents = useCallback(async (id: string, componentIds: string[]): Promise<Product> => {
    try {
      // Find the product
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }

      // In a real app, you'd update a junction table in Supabase
      // For now, we'll just update the local state
      const selectedComponents = components.filter(c => componentIds.includes(c.id));
      
      const updatedProduct: Product = {
        ...product,
        components: selectedComponents,
        updated_at: new Date().toISOString()
      };

      // Update local state
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));

      showSuccess('Components updated', `Product components have been updated successfully`);
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product components:', error);
      showError('Failed to update components', 'Please try again later');
      throw error;
    }
  }, [products, components, showSuccess, showError]);

  // Add a board type
  const addBoardType = useCallback(async (boardType: BoardTypeCreate): Promise<BoardType> => {
    try {
      const { data, error } = await supabaseClient
        .from('board_types')
        .insert({
          ...boardType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to create board type');
      }

      // Update local state
      const newBoardType: BoardType = data;
      setBoardTypes(prev => [...prev, newBoardType]);

      showSuccess('Board type added', `${boardType.name} has been added successfully`);
      return newBoardType;
    } catch (error) {
      console.error('Error adding board type:', error);
      showError('Failed to add board type', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Update a board type
  const updateBoardType = useCallback(async (id: string, updates: Partial<BoardTypeCreate>): Promise<BoardType> => {
    try {
      const { data, error } = await supabaseClient
        .from('board_types')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to update board type');
      }

      // Update local state
      const updatedBoardType: BoardType = data;
      setBoardTypes(prev => prev.map(b => b.id === id ? updatedBoardType : b));

      showSuccess('Board type updated', `Board type has been updated successfully`);
      return updatedBoardType;
    } catch (error) {
      console.error('Error updating board type:', error);
      showError('Failed to update board type', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Delete a board type
  const deleteBoardType = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabaseClient
        .from('board_types')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }

      // Update local state
      setBoardTypes(prev => prev.filter(b => b.id !== id));

      showSuccess('Board type deleted', `Board type has been deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting board type:', error);
      showError('Failed to delete board type', 'Please try again later');
      throw error;
    }
  }, [showSuccess, showError]);

  // Provide the context value
  const contextValue: DataContextType = {
    isOnline,
    isPersisting,
    syncLocalData,
    clearLocalData,
    components,
    addComponent,
    updateComponent,
    archiveComponent,
    unarchiveComponent,
    deleteComponent,
    syncComponentsWithInventory,
    inventory,
    adjustStock,
    addInventoryItem,
    updateInventoryItem,
    products,
    addProduct,
    updateProduct,
    updateProductComponents,
    boardTypes,
    addBoardType,
    updateBoardType,
    deleteBoardType
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Custom hook to use the data context
 */
export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
