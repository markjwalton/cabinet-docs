/**
 * useDocuments Hook
 * 
 * Custom hook for managing documents with Supabase integration.
 * Provides functionality for uploading, fetching, updating, and deleting documents.
 */

import { useState, useEffect } from 'react';
import documentService, { Document, DocumentUploadOptions } from '../lib/supabase/documents';

/**
 * Hook for managing documents
 */
export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all documents
  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  /**
   * Upload a document
   */
  const uploadDocument = async (options: DocumentUploadOptions) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await documentService.uploadDocument(options);
      
      if (result) {
        setDocuments(prev => [result, ...prev]);
        return result;
      } else {
        setError('Failed to upload document');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get documents by category
   */
  const getDocumentsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const docs = await documentService.getDocumentsByCategory(category);
      return docs;
    } catch (err) {
      setError('Failed to load documents by category');
      console.error('Error loading documents by category:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a document by ID
   */
  const getDocumentById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const doc = await documentService.getDocumentById(id);
      return doc;
    } catch (err) {
      setError('Failed to load document');
      console.error('Error loading document:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update document metadata
   */
  const updateDocument = async (id: string, updates: Partial<Document>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await documentService.updateDocument(id, updates);
      
      if (result) {
        setDocuments(prev => 
          prev.map(doc => doc.id === id ? result : doc)
        );
        return result;
      } else {
        setError('Failed to update document');
        return null;
      }
    } catch (err) {
      setError('Failed to update document');
      console.error('Error updating document:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a document
   */
  const deleteDocument = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await documentService.deleteDocument(id);
      
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        return true;
      } else {
        setError('Failed to delete document');
        return false;
      }
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search documents
   */
  const searchDocuments = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await documentService.searchDocuments(query);
      return results;
    } catch (err) {
      setError('Failed to search documents');
      console.error('Error searching documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    loading,
    error,
    loadDocuments,
    uploadDocument,
    getDocumentsByCategory,
    getDocumentById,
    updateDocument,
    deleteDocument,
    searchDocuments,
  };
};

export default useDocuments;
