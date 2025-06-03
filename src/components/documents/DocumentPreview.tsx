"use client";

/**
 * DocumentPreview Component
 * 
 * A component for previewing documents including PDFs and images.
 * Provides download functionality and metadata display.
 */

import React, { useState } from 'react';
import { Download, X, FileText } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import Card from '@/components/ui/cards/Card';

/**
 * Document interface
 */
interface Document {
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
}

/**
 * DocumentPreview component props
 */
interface DocumentPreviewProps {
  document: Document;
  onClose: () => void;
  className?: string;
}

/**
 * DocumentPreview component
 */
const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onClose,
  className = '',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Handle document download
  const handleDownload = () => {
    // In a real implementation, this would download from Supabase
    // const { data, error } = await supabase.storage
    //   .from('documents')
    //   .download(document.filename);
    
    // if (error) {
    //   console.error('Error downloading document:', error);
    //   return;
    // }
    
    // const blob = new Blob([data], { type: document.fileType });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = document.originalFilename;
    // document.body.appendChild(a);
    // a.click();
    // URL.revokeObjectURL(url);
    // document.body.removeChild(a);
    
    // For demonstration, just log the action
    console.log('Downloading document:', document.originalFilename);
  };
  
  // Determine if the document is an image
  const isImage = document.fileType.startsWith('image/');
  
  // Determine if the document is a PDF
  const isPDF = document.fileType === 'application/pdf';
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${className}`}>
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold truncate">{document.originalFilename}</h2>
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="w-5 h-5" />}
            onClick={onClose}
          />
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {isImage ? (
            <div className="flex justify-center">
              <img
                src={`/api/documents/${document.id}`} // This would be a real API endpoint in production
                alt={document.originalFilename}
                className="max-w-full max-h-[60vh] object-contain"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError('Failed to load image');
                }}
              />
            </div>
          ) : isPDF ? (
            <div className="w-full h-[60vh]">
              <iframe
                src={`/api/documents/${document.id}?inline=true`} // This would be a real API endpoint in production
                className="w-full h-full border-0"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError('Failed to load PDF');
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-secondary-400 mb-4" />
              <p className="text-lg font-medium text-secondary-700">
                Preview not available
              </p>
              <p className="text-secondary-500 mb-4">
                This file type cannot be previewed. Please download the file to view it.
              </p>
              <Button
                variant="primary"
                icon={<Download className="w-5 h-5 mr-2" />}
                onClick={handleDownload}
              >
                Download File
              </Button>
            </div>
          )}
          
          {loading && (isImage || isPDF) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center text-danger-600 py-8">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleDownload}
              >
                Download Instead
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-secondary-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-secondary-500 mb-1">File Details</h3>
              <div className="text-sm">
                <p><span className="font-medium">Size:</span> {formatFileSize(document.fileSize)}</p>
                <p><span className="font-medium">Type:</span> {document.fileType}</p>
                <p><span className="font-medium">Uploaded:</span> {new Date(document.uploadedAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-secondary-500 mb-1">Metadata</h3>
              <div className="text-sm">
                <p><span className="font-medium">Category:</span> {document.category}</p>
                {document.description && (
                  <p><span className="font-medium">Description:</span> {document.description}</p>
                )}
                {document.tags && document.tags.length > 0 && (
                  <div className="mt-1">
                    <span className="font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {document.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              icon={<Download className="w-5 h-5 mr-2" />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentPreview;
