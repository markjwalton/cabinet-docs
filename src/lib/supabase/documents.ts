/**
 * Document Service
 * 
 * Service for managing document uploads, downloads, and metadata.
 * Integrates with Supabase storage for document management.
 */

import { v4 as uuidv4 } from 'uuid';
import supabase from './client';

/**
 * Document metadata interface
 */
export interface Document {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  fileType: string;
  category: string;
  description?: string;
  tags?: string[];
  uploadedBy?: string;
  uploadedAt: string;
  lastModifiedAt: string;
  url?: string;
}

/**
 * Document upload options
 */
export interface DocumentUploadOptions {
  file: File;
  category: string;
  description?: string;
  tags?: string[];
  uploadedBy?: string;
}

/**
 * Document service for managing documents in Supabase
 */
const documentService = {
  /**
   * Upload a document to Supabase storage
   */
  async uploadDocument(options: DocumentUploadOptions): Promise<Document | null> {
    try {
      const { file, category, description, tags, uploadedBy } = options;
      
      // Generate a unique filename to avoid collisions
      const fileExtension = file.name.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${category}/${uniqueFilename}`, file);
      
      if (uploadError) {
        console.error('Error uploading document:', uploadError);
        return null;
      }
      
      // Create document metadata
      const now = new Date().toISOString();
      const document: Document = {
        id: uuidv4(),
        filename: uniqueFilename,
        originalFilename: file.name,
        fileSize: file.size,
        fileType: file.type,
        category,
        description,
        tags,
        uploadedBy,
        uploadedAt: now,
        lastModifiedAt: now,
      };
      
      // Store document metadata in Supabase database
      const { error: metadataError } = await supabase
        .from('documents')
        .insert(document);
      
      if (metadataError) {
        console.error('Error storing document metadata:', metadataError);
        
        // Clean up the uploaded file if metadata storage fails
        await supabase.storage
          .from('documents')
          .remove([`${category}/${uniqueFilename}`]);
        
        return null;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(`${category}/${uniqueFilename}`);
      
      return {
        ...document,
        url: urlData?.publicUrl,
      };
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      return null;
    }
  },
  
  /**
   * Get all documents
   */
  async getDocuments(): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploadedAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching documents:', error);
        return [];
      }
      
      // Add public URLs to documents
      const documentsWithUrls = await Promise.all(
        data.map(async (doc) => {
          const { data: urlData } = await supabase.storage
            .from('documents')
            .getPublicUrl(`${doc.category}/${doc.filename}`);
          
          return {
            ...doc,
            url: urlData?.publicUrl,
          };
        })
      );
      
      return documentsWithUrls;
    } catch (error) {
      console.error('Error in getDocuments:', error);
      return [];
    }
  },
  
  /**
   * Get documents by category
   */
  async getDocumentsByCategory(category: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('category', category)
        .order('uploadedAt', { ascending: false });
      
      if (error) {
        console.error('Error fetching documents by category:', error);
        return [];
      }
      
      // Add public URLs to documents
      const documentsWithUrls = await Promise.all(
        data.map(async (doc) => {
          const { data: urlData } = await supabase.storage
            .from('documents')
            .getPublicUrl(`${doc.category}/${doc.filename}`);
          
          return {
            ...doc,
            url: urlData?.publicUrl,
          };
        })
      );
      
      return documentsWithUrls;
    } catch (error) {
      console.error('Error in getDocumentsByCategory:', error);
      return [];
    }
  },
  
  /**
   * Get a document by ID
   */
  async getDocumentById(id: string): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching document by ID:', error);
        return null;
      }
      
      // Get the public URL for the document
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(`${data.category}/${data.filename}`);
      
      return {
        ...data,
        url: urlData?.publicUrl,
      };
    } catch (error) {
      console.error('Error in getDocumentById:', error);
      return null;
    }
  },
  
  /**
   * Update document metadata
   */
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    try {
      // Don't allow updating certain fields
      const { id: _, filename: __, originalFilename: ___, fileSize: ____, fileType: _____, uploadedAt: ______, ...allowedUpdates } = updates;
      
      // Update the lastModifiedAt timestamp
      const now = new Date().toISOString();
      const updatedData = {
        ...allowedUpdates,
        lastModifiedAt: now,
      };
      
      const { data, error } = await supabase
        .from('documents')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating document:', error);
        return null;
      }
      
      // Get the public URL for the document
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(`${data.category}/${data.filename}`);
      
      return {
        ...data,
        url: urlData?.publicUrl,
      };
    } catch (error) {
      console.error('Error in updateDocument:', error);
      return null;
    }
  },
  
  /**
   * Delete a document
   */
  async deleteDocument(id: string): Promise<boolean> {
    try {
      // First, get the document to know the filename and category
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching document for deletion:', fetchError);
        return false;
      }
      
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([`${document.category}/${document.filename}`]);
      
      if (storageError) {
        console.error('Error deleting document file:', storageError);
        return false;
      }
      
      // Delete the metadata from the database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (dbError) {
        console.error('Error deleting document metadata:', dbError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteDocument:', error);
      return false;
    }
  },
  
  /**
   * Search documents by text
   */
  async searchDocuments(query: string): Promise<Document[]> {
    try {
      // Search in filename, description, and tags
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .or(`originalFilename.ilike.%${query}%,description.ilike.%${query}%`)
        .order('uploadedAt', { ascending: false });
      
      if (error) {
        console.error('Error searching documents:', error);
        return [];
      }
      
      // Also search in tags (array contains)
      const { data: tagData, error: tagError } = await supabase
        .from('documents')
        .select('*')
        .contains('tags', [query])
        .order('uploadedAt', { ascending: false });
      
      if (tagError) {
        console.error('Error searching documents by tags:', tagError);
      }
      
      // Combine and deduplicate results
      const allResults = [...(data || []), ...(tagData || [])];
      const uniqueResults = Array.from(
        new Map(allResults.map(item => [item.id, item])).values()
      );
      
      // Add public URLs to documents
      const documentsWithUrls = await Promise.all(
        uniqueResults.map(async (doc) => {
          const { data: urlData } = await supabase.storage
            .from('documents')
            .getPublicUrl(`${doc.category}/${doc.filename}`);
          
          return {
            ...doc,
            url: urlData?.publicUrl,
          };
        })
      );
      
      return documentsWithUrls;
    } catch (error) {
      console.error('Error in searchDocuments:', error);
      return [];
    }
  },
};

export default documentService;
