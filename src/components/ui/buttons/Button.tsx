/**
 * Button Component
 * 
 * A reusable button component that supports:
 * - Different variants (primary, secondary, outline, danger, ghost)
 * - Different sizes (small, medium, large, sm, lg, md)
 * - Loading state
 * - Icon support
 * - Link functionality with href
 */

import React from 'react';
import Link from 'next/link';

// Types for the component
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost' | 'warning';
export type ButtonSize = 'small' | 'medium' | 'large' | 'sm' | 'lg' | 'md';

export type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Keep original type for compatibility
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  href?: string; // Added href property for link functionality
};

/**
 * Button component
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  href
}: ButtonProps) {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  // Size classes - support for both 'sm' and 'small', 'md' and 'medium', 'lg' and 'large'
  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    sm: 'px-3 py-1.5 text-xs', // Same as small
    medium: 'px-4 py-2 text-sm',
    md: 'px-4 py-2 text-sm', // Same as medium
    large: 'px-6 py-3 text-base',
    lg: 'px-6 py-3 text-base' // Same as large
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300',
    secondary: 'border-transparent text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500 disabled:text-gray-400',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    success: 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
    ghost: 'border-transparent text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-300',
    warning: 'border-transparent text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-300'
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled and loading state
  const isDisabled = disabled || isLoading;
  
  // Common content for both button and link
  const content = (
    <>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children && <span>{children}</span>}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );
  
  // Handle link click with type conversion
  const handleLinkClick = onClick 
    ? (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Convert the event type to be compatible with existing handlers
        onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    : undefined;
  
  // If href is provided, render a Next.js Link component
  if (href) {
    return (
      <Link 
        href={href}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${widthClasses}
          ${isDisabled ? 'pointer-events-none opacity-70' : ''}
          ${className}
        `}
        onClick={handleLinkClick}
      >
        {content}
      </Link>
    );
  }
  
  // Otherwise render a button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClasses}
        ${isDisabled ? 'cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {content}
    </button>
  );
}
