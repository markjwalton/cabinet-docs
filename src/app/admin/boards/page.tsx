"use client";

/**
 * Admin Boards Page Component
 * 
 * This page provides administrative functions for managing board types,
 * materials, and specifications.
 */

import React, { useState } from 'react';
import Breadcrumb from '@/components/ui/layout/Breadcrumb';
import Card from '@/components/ui/cards/Card';
import Button from '@/components/ui/buttons/Button';
import { Layers, Plus, Settings, X } from 'lucide-react';
// Removed unused import: import { useNavigation } from '@/contexts/NavigationContext';

interface BoardType {
  id: string;
  name: string;
  description: string;
  thickness: string;
  inStock: boolean;
}

/**
 * AdminBoardsPage component
 */
export default function AdminBoardsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  // Removed unused variable: const { navigate } = useNavigation();

  // New board form state
  const [newBoard, setNewBoard] = useState<{
    name: string;
    description: string;
    thickness: string;
    inStock: boolean;
  }>({
    name: '',
    description: '',
    thickness: '',
    inStock: true
  });

  // Sample board types for demonstration - converted to state
  const [boardTypes, setBoardTypes] = useState<BoardType[]>([
    { 
      id: '1', 
      name: 'Plywood', 
      description: 'Standard cabinet-grade plywood',
      thickness: '18mm',
      inStock: true
    },
    { 
      id: '2', 
      name: 'MDF', 
      description: 'Medium-density fiberboard for cabinet doors',
      thickness: '12mm',
      inStock: true
    },
    { 
      id: '3', 
      name: 'Particle Board', 
      description: 'Cost-effective option for non-visible components',
      thickness: '16mm',
      inStock: false
    },
    { 
      id: '4', 
      name: 'Solid Wood', 
      description: 'Premium hardwood for high-end cabinets',
      thickness: '20mm',
      inStock: true
    },
  ]);

  // Handle opening the add board modal
  const handleAddBoardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default to avoid navigation issues
    setShowAddModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    // Reset form
    setNewBoard({
      name: '',
      description: '',
      thickness: '',
      inStock: true
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewBoard(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setNewBoard(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new board object
    const newBoardObj: BoardType = {
      id: `${boardTypes.length + 1}`,
      name: newBoard.name,
      description: newBoard.description,
      thickness: newBoard.thickness,
      inStock: newBoard.inStock
    };
    
    // Add the new board to the boardTypes state
    setBoardTypes([...boardTypes, newBoardObj]);
    
    // Close the modal
    handleCloseModal();
    
    // Show confirmation
    alert(`Board type "${newBoard.name}" has been added successfully!`);
  };

  // Handle edit button click
  const handleEditClick = (board: BoardType) => {
    // In a real application, this would open an edit modal
    alert(`Edit functionality for ${board.name} will be implemented soon.`);
  };

  // Handle delete button click
  const handleDeleteClick = (boardId: string) => {
    // Confirm before deleting
    if (confirm("Are you sure you want to delete this board type?")) {
      // Filter out the board with the matching ID
      setBoardTypes(boardTypes.filter(board => board.id !== boardId));
      alert("Board type deleted successfully!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Boards', href: '/admin/boards' },
        ]}
        showHomeIcon
        className="mb-6"
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Board Management</h1>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Settings className="w-5 h-5" />}
          >
            Settings
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleAddBoardClick}
          >
            Add Board Type
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <div className="p-6">
          <p className="text-secondary-600">
            Manage board types, materials, and specifications used in cabinet construction. These settings determine the available options for cabinet designs.
          </p>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 gap-4">
        {boardTypes.map((board) => (
          <Card key={board.id} className="hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4 mt-1">
                    <Layers className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{board.name}</h2>
                    <p className="text-secondary-600 mt-1">
                      {board.description}
                    </p>
                    <div className="flex items-center mt-2 text-secondary-500">
                      <span className="mr-4">Thickness: {board.thickness}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        board.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {board.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleEditClick(board)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleDeleteClick(board.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Board Type Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Add Board Type</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={handleCloseModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Board Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={newBoard.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter board type name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  name="description"
                  value={newBoard.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Enter board description"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thickness (mm)
                </label>
                <input 
                  type="text" 
                  name="thickness"
                  value={newBoard.thickness}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 18mm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="inStock"
                    checked={newBoard.inStock}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="primary"
                >
                  Add Board Type
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
