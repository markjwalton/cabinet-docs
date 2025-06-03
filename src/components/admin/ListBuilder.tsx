/**
 * ListBuilderAdapter Component with Fixed Props Interface
 * 
 * This component adapts the ListBuilder component for specific use cases.
 */

import React from 'react';
import ListBuilder from './ListBuilder';

// Define and export the props interface
export interface ListBuilderAdapterProps {
  items: { value: string; label: string }[];
  onItemsChange: (newItems: { value: string; label: string }[]) => void;
}

const ListBuilderAdapter: React.FC<ListBuilderAdapterProps> = ({
  items,
  onItemsChange
}) => {
  // Component implementation
  return (
    <ListBuilder
      items={items}
      onItemsChange={onItemsChange}
    />
  );
};

export default ListBuilderAdapter;
