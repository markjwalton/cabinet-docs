/**
 * DocumentFilter Component with Shared Types
 * 
 * This component provides filtering options for documents.
 * It now uses the shared document types for consistency across the project.
 * Fixed to include searchTerm in reset filters.
 */

import Button from '@/components/ui/buttons/Button';
import Select from '@/components/ui/forms/Select';
import { DocumentFilterProps, FilterOptions } from '@/types/shared_document_types';
import React, { useState } from 'react';

const DocumentFilter: React.FC<DocumentFilterProps> = ({
  categories,
  availableTags,
  filterOptions,
  onFilterChange
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions);
  
  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalFilters({
      ...localFilters,
      category: e.target.value
    });
  };
  
  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalFilters({
      ...localFilters,
      dateRange: e.target.value
    });
  };
  
  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    const currentTags = [...localFilters.tags];
    const tagIndex = currentTags.indexOf(tag);
    
    if (tagIndex === -1) {
      // Add tag
      currentTags.push(tag);
    } else {
      // Remove tag
      currentTags.splice(tagIndex, 1);
    }
    
    setLocalFilters({
      ...localFilters,
      tags: currentTags
    });
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      category: '',
      dateRange: '',
      searchTerm: '', // Added required searchTerm property
      tags: []
    };
    
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <Select
          id="category-filter"
          label="Category" // Added required label prop
          value={localFilters.category}
          onChange={handleCategoryChange}
          options={[
            { value: '', label: 'All Categories' },
            ...categories
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date Range
        </label>
        <Select
          id="date-range-filter"
          label="Date Range" // Added required label prop
          value={localFilters.dateRange}
          onChange={handleDateRangeChange}
          options={[
            { value: '', label: 'All Time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'year', label: 'This Year' }
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <div
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                localFilters.tags.includes(tag)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button
          variant="primary"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
        <Button
          variant="secondary"
          onClick={handleResetFilters}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default DocumentFilter;
