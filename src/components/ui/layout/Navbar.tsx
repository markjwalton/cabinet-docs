"use client";

/**
 * Navbar Component
 * 
 * Main navigation component for the application.
 * Handles both desktop and mobile navigation with dropdown for admin section.
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { 
  Menu as MenuIcon, 
  X as XIcon, 
  Home, 
  Package, 
  ShoppingBag, 
  ClipboardList, 
  Settings,
  FileText
} from 'lucide-react';

/**
 * Navbar component for site-wide navigation
 */
const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { navigate } = useNavigation();
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  
  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };
  
  // Handle navigation with context
  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu on navigation
    setAdminDropdownOpen(false); // Close admin dropdown on navigation
    navigate(href);
  };
  
  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle clicks outside the admin dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle admin dropdown
  const toggleAdminDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdminDropdownOpen(!adminDropdownOpen);
  };
  
  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="text-xl font-bold text-primary-600"
                onClick={(e) => handleNavigation('/', e)}
              >
                Cabinet Manager
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') && !pathname?.startsWith('/admin')
                    ? 'border-primary-500 text-secondary-900' 
                    : 'border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700'
                }`}
                onClick={(e) => handleNavigation('/', e)}
              >
                Home
              </Link>
              
              <Link 
                href="/inventory" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/inventory') 
                    ? 'border-primary-500 text-secondary-900' 
                    : 'border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700'
                }`}
                onClick={(e) => handleNavigation('/inventory', e)}
              >
                Inventory
              </Link>
              
              <Link 
                href="/products" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/products') 
                    ? 'border-primary-500 text-secondary-900' 
                    : 'border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700'
                }`}
                onClick={(e) => handleNavigation('/products', e)}
              >
                Products
              </Link>
              
              <Link 
                href="/orders" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/orders') 
                    ? 'border-primary-500 text-secondary-900' 
                    : 'border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700'
                }`}
                onClick={(e) => handleNavigation('/orders', e)}
              >
                Orders
              </Link>
              
              <div className="relative" ref={adminDropdownRef}>
                <button 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin') 
                      ? 'border-primary-500 text-secondary-900' 
                      : 'border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700'
                  }`}
                  onClick={toggleAdminDropdown}
                >
                  Admin
                </button>
                
                {/* Admin dropdown for desktop */}
                {adminDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link 
                        href="/admin/inventory" 
                        className={`block px-4 py-2 text-sm ${
                          isActive('/admin/inventory') 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                        onClick={(e) => handleNavigation('/admin/inventory', e)}
                        role="menuitem"
                      >
                        Inventory Management
                      </Link>
                      <Link 
                        href="/admin/boards" 
                        className={`block px-4 py-2 text-sm ${
                          isActive('/admin/boards') 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                        onClick={(e) => handleNavigation('/admin/boards', e)}
                        role="menuitem"
                      >
                        Board Management
                      </Link>
                      <Link 
                        href="/admin/suppliers" 
                        className={`block px-4 py-2 text-sm ${
                          isActive('/admin/suppliers') 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                        onClick={(e) => handleNavigation('/admin/suppliers', e)}
                        role="menuitem"
                      >
                        Supplier Management
                      </Link>
                      <Link 
                        href="/admin/documentation" 
                        className={`block px-4 py-2 text-sm ${
                          isActive('/admin/documentation') 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                        onClick={(e) => handleNavigation('/admin/documentation', e)}
                        role="menuitem"
                      >
                        Documentation
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') && !pathname?.startsWith('/admin')
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
              onClick={(e) => handleNavigation('/', e)}
            >
              <div className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Home
              </div>
            </Link>
            
            <Link 
              href="/inventory" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/inventory') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
              onClick={(e) => handleNavigation('/inventory', e)}
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Inventory
              </div>
            </Link>
            
            <Link 
              href="/products" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/products') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
              onClick={(e) => handleNavigation('/products', e)}
            >
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Products
              </div>
            </Link>
            
            <Link 
              href="/orders" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/orders') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
              onClick={(e) => handleNavigation('/orders', e)}
            >
              <div className="flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" />
                Orders
              </div>
            </Link>
            
            <button 
              className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
              onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
            >
              <div className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Admin
              </div>
            </button>
            
            {adminDropdownOpen && (
              <div className="pl-5 space-y-1 border-l-2 border-primary-100 ml-3">
                <Link 
                  href="/admin/inventory" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/admin/inventory') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={(e) => handleNavigation('/admin/inventory', e)}
                >
                  Inventory Management
                </Link>
                <Link 
                  href="/admin/boards" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/admin/boards') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={(e) => handleNavigation('/admin/boards', e)}
                >
                  Board Management
                </Link>
                <Link 
                  href="/admin/suppliers" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/admin/suppliers') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={(e) => handleNavigation('/admin/suppliers', e)}
                >
                  Supplier Management
                </Link>
                <Link 
                  href="/admin/documentation" 
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/admin/documentation') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={(e) => handleNavigation('/admin/documentation', e)}
                >
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
