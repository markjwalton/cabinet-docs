"use client";

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '', showHomeIcon = false }) => {
  return (
    <nav className={`flex text-sm text-secondary-500 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <li className="flex items-center">
                <span className="mx-2">/</span>
              </li>
            )}
            <li>
              {index === 0 && showHomeIcon ? (
                <Link 
                  href={item.href} 
                  className="flex items-center hover:text-primary-600 hover:underline"
                >
                  <Home className="w-4 h-4 mr-1" />
                  <span>{item.label}</span>
                </Link>
              ) : index === items.length - 1 ? (
                <span className="text-secondary-900 font-medium">{item.label}</span>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-primary-600 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
