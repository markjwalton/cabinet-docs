/**
 * Modal Component
 * 
 * A flexible modal dialog component with close functionality.
 * Includes both an X button in the corner and optional Cancel button.
 */

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';

export interface ModalProps {
  /**
   * Controls whether the modal is displayed
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal should close
   */
  onClose: () => void;
  
  /**
   * Modal title displayed in the header
   */
  title: string;
  
  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Custom footer content
   * If not provided, a default Close button will be shown
   */
  footer?: React.ReactNode;
  
  /**
   * Whether to show a Cancel button in the footer
   */
  showCancelButton?: boolean;
  
  /**
   * Label for the cancel button
   */
  cancelButtonLabel?: string;
  
  /**
   * Label for the primary action button
   */
  primaryButtonLabel?: string;
  
  /**
   * Function to call when the primary button is clicked
   */
  onPrimaryAction?: () => void;
  
  /**
   * Whether the primary button is in loading state
   */
  isPrimaryLoading?: boolean;
  
  /**
   * Modal content
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS classes for the modal content
   */
  className?: string;
}

/**
 * Modal component with customizable size and actions
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  footer,
  showCancelButton = true,
  cancelButtonLabel = 'Cancel',
  primaryButtonLabel,
  onPrimaryAction,
  isPrimaryLoading = false,
  children,
  className = '',
}) => {
  // Determine the modal width based on size prop
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all ${className}`}
              >
                {/* Header with title and close button */}
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-secondary-900"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-full p-1 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal content */}
                <div className="mt-2">
                  {children}
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end space-x-3">
                  {footer ? (
                    footer
                  ) : (
                    <>
                      {showCancelButton && (
                        <Button 
                          variant="outline" 
                          onClick={onClose}
                        >
                          {cancelButtonLabel}
                        </Button>
                      )}
                      {primaryButtonLabel && onPrimaryAction && (
                        <Button 
                          variant="primary" 
                          onClick={onPrimaryAction}
                          isLoading={isPrimaryLoading}
                        >
                          {primaryButtonLabel}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
