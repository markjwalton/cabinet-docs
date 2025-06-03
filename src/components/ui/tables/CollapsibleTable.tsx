/**
 * CollapsibleTable Component
 * 
 * A reusable table component that supports:
 * - Minimalist main view with configurable columns
 * - Expandable detail sections with gradient backgrounds
 * - Mobile responsiveness
 * - Consistent date formatting
 */

import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// Types for the component
export type ColumnDefinition<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  width?: string;
  mobileVisible?: boolean; // Whether this column should be visible on mobile
};

export type ActionDefinition<T> = {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
  showInMobile?: boolean; // Whether this action should be visible on mobile
  condition?: (item: T) => boolean; // Optional condition to show/hide the action
};

export type ExpandedContentRenderer<T> = (item: T) => React.ReactNode;

type CollapsibleTableProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  actions?: ActionDefinition<T>[];
  keyField: keyof T;
  expandedContent?: ExpandedContentRenderer<T>;
  emptyMessage?: string;
  className?: string;
  isLoading?: boolean;
};

/**
 * Format a date string to "21 January 2034" format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * CollapsibleTable component
 */
export default function CollapsibleTable<T>({
  data,
  columns,
  actions = [],
  keyField,
  expandedContent,
  emptyMessage = 'No data available',
  className = '',
  isLoading = false
}: CollapsibleTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Toggle row expansion
  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get cell content based on accessor (string key or function)
  const getCellContent = (item: T, accessor: ColumnDefinition<T>['accessor']): ReactNode => {
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    
    const value = item[accessor];
    
    // Format dates if the value looks like a date string
    if (typeof value === 'string' && 
        (value.includes('T') || value.match(/^\d{4}-\d{2}-\d{2}/)) && 
        !isNaN(Date.parse(value))) {
      return formatDate(value);
    }
    
    return value as ReactNode;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // Render empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  // Filter columns for mobile view
  const mobileColumns = columns.filter(col => col.mobileVisible !== false);
  const mobileActions = actions.filter(action => action.showInMobile !== false);

  return (
    <div className={`w-full bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {expandedContent && <th className="w-10"></th>}
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
              const id = String(item[keyField]);
              const isExpanded = expandedRows[id] || false;
              
              return (
                <React.Fragment key={id}>
                  <tr className="hover:bg-gray-50">
                    {expandedContent && (
                      <td className="px-2">
                        <button
                          onClick={() => toggleRow(id)}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </td>
                    )}
                    
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                      >
                        {getCellContent(item, column.accessor)}
                      </td>
                    ))}
                    
                    {actions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {actions.map((action, actionIndex) => (
                          (!action.condition || action.condition(item)) && (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={`text-indigo-600 hover:text-indigo-900 ${action.className || ''}`}
                            >
                              {action.icon ? (
                                <span className="flex items-center">
                                  {action.icon}
                                  <span className="ml-1">{action.label}</span>
                                </span>
                              ) : (
                                action.label
                              )}
                            </button>
                          )
                        ))}
                      </td>
                    )}
                  </tr>
                  
                  {expandedContent && isExpanded && (
                    <tr>
                      <td colSpan={columns.length + (actions.length > 0 ? 2 : 1)} className="px-6 py-4">
                        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100">
                          {expandedContent(item)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden">
        {data.map((item) => {
          const id = String(item[keyField]);
          const isExpanded = expandedRows[id] || false;
          
          return (
            <div key={id} className="border-b border-gray-200 last:border-b-0">
              <div className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  {mobileColumns.map((column, colIndex) => (
                    <div key={colIndex} className="mb-1 last:mb-0">
                      {colIndex === 0 ? (
                        <div className="font-medium">
                          {getCellContent(item, column.accessor)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 flex">
                          <span className="font-medium mr-2">{column.header}:</span>
                          <span>{getCellContent(item, column.accessor)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  {mobileActions.map((action, actionIndex) => (
                    (!action.condition || action.condition(item)) && (
                      <button
                        key={actionIndex}
                        onClick={() => action.onClick(item)}
                        className={`p-2 text-indigo-600 ${action.className || ''}`}
                      >
                        {action.icon || action.label.charAt(0)}
                      </button>
                    )
                  ))}
                  
                  {expandedContent && (
                    <button
                      onClick={() => toggleRow(id)}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {expandedContent && isExpanded && (
                <div className="px-4 pb-4">
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100">
                    {expandedContent(item)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
