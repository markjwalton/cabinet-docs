"use client";

/**
 * Card Component
 * 
 * A versatile card component for containing content with optional title, actions, and clickable state.
 * Provides consistent styling and layout for card-based UI elements.
 */

import React from 'react';

/**
 * Card component props
 */
interface CardProps {
  children: React.ReactNode;
  title?: string;
  titleAction?: React.ReactNode;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Card component
 */
const Card: React.FC<CardProps> = ({
  children,
  title,
  titleAction,
  clickable = false,
  className = '',
  onClick,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden';
  const clickableClasses = clickable ? 'cursor-pointer transition-shadow hover:shadow-md' : '';
  
  const cardClasses = [
    baseClasses,
    clickableClasses,
    className,
  ].join(' ');
  
  return (
    <div 
      className={cardClasses}
      onClick={clickable && onClick ? onClick : undefined}
    >
      {title && (
        <div className="px-4 py-3 border-b border-secondary-200 flex items-center justify-between">
          <h3 className="font-medium text-secondary-900">{title}</h3>
          {titleAction && (
            <div>{titleAction}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
