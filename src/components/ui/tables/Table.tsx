"use client";

/**
 * Table Component
 * 
 * A versatile table component with support for sorting, pagination, and row selection.
 * Provides consistent table styling and behavior.
 */

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';

/**
 * Column interface
 */
interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

/**
 * Table component props
 */
interface TableProps<T> {
  columns: Column<T>[];
  data?: T[];  // Made data optional
  keyField: keyof T;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  onRowClick?: (row: T) => void;
  className?: string;
}

/**
 * Table component
 */
function Table<T>({
  columns,
  data = [],  // Added default empty array
  keyField,
  sortable = false,
  pagination = false,
  pageSize = 10,
  selectable = false,
  onRowSelect,
  onRowClick,
  className = '',
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  
  // Handle sort
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };
  
  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);
  
  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);
  
  // Total pages
  const totalPages = React.useMemo(() => {
    if (!pagination) return 1;
    // Added null check for data
    return Math.ceil((data?.length || 0) / pageSize);
  }, [data?.length, pagination, pageSize]);  // Updated dependency array
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle row selection
  const handleRowSelection = (row: T) => {
    const isSelected = selectedRows.some(
      (selectedRow) => selectedRow[keyField] === row[keyField]
    );
    
    const newSelectedRows = isSelected
      ? selectedRows.filter((selectedRow) => selectedRow[keyField] !== row[keyField])
      : [...selectedRows, row];
    
    setSelectedRows(newSelectedRows);
    
    if (onRowSelect) {
      onRowSelect(newSelectedRows);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
      if (onRowSelect) {
        onRowSelect([]);
      }
    } else {
      setSelectedRows(paginatedData);
      if (onRowSelect) {
        onRowSelect(paginatedData);
      }
    }
  };
  
  // Check if a row is selected
  const isRowSelected = (row: T) => {
    return selectedRows.some(
      (selectedRow) => selectedRow[keyField] === row[keyField]
    );
  };
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-secondary-200">
        <thead className="bg-secondary-50">
          <tr>
            {selectable && (
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider ${
                  column.width ? column.width : ''
                } ${sortable && column.sortable ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (sortable && column.sortable) {
                    handleSort(column.key);
                  }
                }}
              >
                <div className="flex items-center">
                  {column.header}
                  
                  {sortable && column.sortable && (
                    <span className="ml-1">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <div className="h-4 w-4 opacity-0 group-hover:opacity-50">
                          <ChevronUp className="h-2 w-4" />
                          <ChevronDown className="h-2 w-4" />
                        </div>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-secondary-200">
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-4 py-8 text-center text-secondary-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            paginatedData.map((row) => (
              <tr
                key={String(row[keyField])}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-secondary-50' : ''
                } ${isRowSelected(row) ? 'bg-primary-50' : ''}`}
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(row);
                  }
                }}
              >
                {selectable && (
                  <td className="px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      checked={isRowSelected(row)}
                      onChange={() => handleRowSelection(row)}
                    />
                  </td>
                )}
                
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] || '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-secondary-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-secondary-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, data?.length || 0)}
                </span>{' '}
                of <span className="font-medium">{data?.length || 0}</span> results
              </p>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-md"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  icon={<ChevronsLeft className="h-4 w-4" />}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  icon={<ChevronLeft className="h-4 w-4" />}
                />
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  icon={<ChevronRight className="h-4 w-4" />}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-r-md"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  icon={<ChevronsRight className="h-4 w-4" />}
                />
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
