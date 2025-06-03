"use client";

/**
 * Tabs Component
 * 
 * A tabbed interface component for organizing content into separate views.
 * Provides accessible tab navigation with keyboard support.
 */

import React, { createContext, useContext, useState } from 'react';

// Context for tab state
const TabsContext = createContext<{
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}>({
  selectedTab: '',
  setSelectedTab: () => {},
});

/**
 * Tabs component props
 */
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * TabsList component props
 */
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TabsTrigger component props
 */
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * TabsContent component props
 */
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tabs component
 */
export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = '' }) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={`tabs ${className}`} role="tablist">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

/**
 * TabsList component
 */
export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-1 border-b border-secondary-200 ${className}`}>
      {children}
    </div>
  );
};

/**
 * TabsTrigger component
 */
export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  const { selectedTab, setSelectedTab } = useContext(TabsContext);
  const isSelected = selectedTab === value;
  
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      onClick={() => setSelectedTab(value)}
      className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        isSelected
          ? 'text-primary-700 bg-white border-l border-t border-r border-secondary-200 border-b-white -mb-px'
          : 'text-secondary-600 hover:text-primary-700 hover:bg-secondary-50'
      } ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * TabsContent component
 */
export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const { selectedTab } = useContext(TabsContext);
  
  if (selectedTab !== value) {
    return null;
  }
  
  return (
    <div
      role="tabpanel"
      className={`tab-content ${className}`}
    >
      {children}
    </div>
  );
};
