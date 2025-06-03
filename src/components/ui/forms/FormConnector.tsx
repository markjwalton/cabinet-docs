/**
 * FormConnector Component with Shared Types
 * 
 * This component connects forms to data sources.
 * Updated to use shared types from shared_document_types.ts
 */

import Button from '@/components/ui/buttons/Button';
import Modal from '@/components/ui/modals/Modal';
import React, { useState } from 'react';
import FormManager from './FormManager';
// Import FormManagerProps from shared types file

interface FormConnectorProps {
  formName: string;
  endpoint?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  initialData?: any;
  submitButtonText?: string;
  cancelButtonText?: string;
  showModal?: boolean;
  modalTitle?: string;
  modalDescription?: string;
}

const FormConnector: React.FC<FormConnectorProps> = ({
  formName,
  endpoint,
  onSuccess,
  onError,
  initialData,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  showModal = false,
  modalTitle = 'Form',
  modalDescription = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSuccess = (data: any) => {
    if (onSuccess) {
      onSuccess(data);
    }
    
    if (showModal) {
      handleCloseModal();
    }
  };
  
  const handleError = (error: any) => {
    if (onError) {
      onError(error);
    }
  };
  
  // Render form directly
  const renderForm = () => {
    return (
      <FormManager
        formName={formName}
        onSuccess={handleSuccess}
        onError={handleError}
        initialData={initialData}
        endpoint={endpoint}
        submitButtonText={submitButtonText}
        cancelButtonText={cancelButtonText}
      />
    );
  };
  
  // Render form in modal
  const renderModal = () => {
    return (
      <>
        <Button
          variant="primary"
          onClick={handleOpenModal}
        >
          Open Form
        </Button>
        
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={modalTitle}
        >
          <div className="p-4">
            {modalDescription && (
              <p className="text-gray-600 mb-4">{modalDescription}</p>
            )}
            
            {renderForm()}
          </div>
        </Modal>
      </>
    );
  };
  
  return showModal ? renderModal() : renderForm();
};

export default FormConnector;
