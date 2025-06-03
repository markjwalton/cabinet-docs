/**
 * Checkbox Component
 * 
 * This component renders a checkbox with label and error message.
 */

import { CheckboxProps } from '@/types/forms';
import React from 'react';

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  className = '',
  error,
  helpText
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helpText && !error && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};

export default Checkbox;
