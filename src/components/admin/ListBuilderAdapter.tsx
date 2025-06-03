/**
 * ListBuilderAdapter Component
 * 
 * This adapter component bridges between the old ListBuilder interface
 * (which used listName and initialItems) and the new ListBuilder interface
 * (which uses items and onItemsChange).
 */

import React, { useState } from 'react';
import ListBuilder from './ListBuilder';

interface ListBuilderAdapterProps {
  listName: string;
  initialItems: { id: string; value: string; label: string; order: number; }[];
  onItemsChange?: (items: { id: string; value: string; label: string; order: number; }[]) => void;
}

const ListBuilderAdapter: React.FC<ListBuilderAdapterProps> = ({
  listName,
  initialItems,
  onItemsChange
}) => {
  // Convert initialItems to the format expected by the new ListBuilder
  const [items, setItems] = useState<{ value: string; label: string }[]>(
    initialItems.map(item => ({
      value: item.value,
      label: item.label
    }))
  );

  // Handle changes from the new ListBuilder
  const handleItemsChange = (newItems: { value: string; label: string }[]) => {
    setItems(newItems);
    
    // Convert back to the old format for onItemsChange callback
    if (onItemsChange) {
      const convertedItems = newItems.map((item, index) => {
        // Try to find the original id for this item
        const originalItem = initialItems.find(original => original.value === item.value);
        
        return {
          id: originalItem?.id || `item_${index}`,
          value: item.value,
          label: item.label,
          order: index
        };
      });
      
      onItemsChange(convertedItems);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{listName}</h3>
      <ListBuilder
        items={items}
        onItemsChange={handleItemsChange}
      />
    </div>
  );
};

export default ListBuilderAdapter;
