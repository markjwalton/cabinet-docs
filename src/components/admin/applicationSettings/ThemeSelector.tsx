'use client';

import React, { useState } from 'react';
import { useTheme, ThemeSettings, themes } from '@/contexts/ThemeContext';
import Button from '@/components/ui/buttons/Button';
import Card from '@/components/ui/cards/Card';
import Input from '@/components/ui/forms/Input';
import Checkbox from '@/components/ui/forms/Checkbox';

/**
 * ThemeSelector Component
 * 
 * A standalone component for selecting and customizing themes.
 * Can be integrated into any admin area.
 */
const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, customizeTheme, availableThemes, saveCustomTheme } = useTheme();
  const [customThemeName, setCustomThemeName] = useState('');
  const [activeTab, setActiveTab] = useState<'select' | 'customize'>('select');
  const [showPreview, setShowPreview] = useState(true);
  const [checkboxState, setCheckboxState] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Handle theme selection
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };
  
  // Handle color change
  const handleColorChange = (colorKey: keyof ThemeSettings['colors'], value: string) => {
    // Create a complete colors object with all existing colors plus the changed one
    const updatedColors = {
      ...currentTheme.colors,
      [colorKey]: value
    };
    
    customizeTheme({
      colors: updatedColors
    });
  };
  
  // Handle border radius change
  const handleBorderRadiusChange = (value: string) => {
    customizeTheme({
      borderRadius: value
    });
  };
  
  // Handle font family change
  const handleFontFamilyChange = (value: string) => {
    customizeTheme({
      fontFamily: value
    });
  };
  
  // Handle save custom theme
  const handleSaveTheme = () => {
    if (customThemeName.trim()) {
      saveCustomTheme(customThemeName);
      setCustomThemeName('');
      setActiveTab('select');
    }
  };
  
  // Border radius options
  const borderRadiusOptions = [
    { value: '0', label: 'None (0)' },
    { value: '0.125rem', label: 'Extra Small (2px)' },
    { value: '0.25rem', label: 'Small (4px)' },
    { value: '0.375rem', label: 'Medium (6px)' },
    { value: '0.5rem', label: 'Large (8px)' },
    { value: '0.75rem', label: 'Extra Large (12px)' },
    { value: '1rem', label: 'XXL (16px)' },
    { value: '9999px', label: 'Full (Pill)' },
  ];
  
  // Font family options
  const fontFamilyOptions = [
    { value: 'system-ui, -apple-system, sans-serif', label: 'System UI' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Courier New, monospace', label: 'Courier New' },
  ];
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Theme Settings</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-[var(--color-secondary)] mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'select' 
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' 
              : 'text-[var(--color-text)]'
          }`}
          onClick={() => setActiveTab('select')}
        >
          Select Theme
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'customize' 
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' 
              : 'text-[var(--color-text)]'
          }`}
          onClick={() => setActiveTab('customize')}
        >
          Customize Theme
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme Controls */}
        <div>
          {activeTab === 'select' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Select Theme
              </label>
              <select
                value={currentTheme.name}
                onChange={handleThemeChange}
                className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)] bg-white"
              >
                {availableThemes.map(themeName => (
                  <option key={themeName} value={themeName}>
                    {themes[themeName]?.name || themeName}
                  </option>
                ))}
              </select>
              
              <div className="mt-4">
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('customize')}
                >
                  Customize Current Theme
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-medium text-[var(--color-text)] mb-4">Customize Theme</h2>
              
              {/* Color Pickers */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={currentTheme.colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-10 h-10 rounded-[var(--border-radius)] mr-2"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={currentTheme.colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-10 h-10 rounded-[var(--border-radius)] mr-2"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Danger Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={currentTheme.colors.danger}
                      onChange={(e) => handleColorChange('danger', e.target.value)}
                      className="w-10 h-10 rounded-[var(--border-radius)] mr-2"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.danger}
                      onChange={(e) => handleColorChange('danger', e.target.value)}
                      className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Success Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={currentTheme.colors.success}
                      onChange={(e) => handleColorChange('success', e.target.value)}
                      className="w-10 h-10 rounded-[var(--border-radius)] mr-2"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.success}
                      onChange={(e) => handleColorChange('success', e.target.value)}
                      className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Warning Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={currentTheme.colors.warning}
                      onChange={(e) => handleColorChange('warning', e.target.value)}
                      className="w-10 h-10 rounded-[var(--border-radius)] mr-2"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.warning}
                      onChange={(e) => handleColorChange('warning', e.target.value)}
                      className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={currentTheme.colors.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="w-10 h-10 rounded-[var(--border-radius)] mr-2"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={currentTheme.colors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-10 h-10 rounded-[var(--border-radius)] mr-2"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Border Radius */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Border Radius
                </label>
                <select
                  value={currentTheme.borderRadius}
                  onChange={(e) => handleBorderRadiusChange(e.target.value)}
                  className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)] bg-white"
                >
                  {borderRadiusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Font Family */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Font Family
                </label>
                <select
                  value={currentTheme.fontFamily}
                  onChange={(e) => handleFontFamilyChange(e.target.value)}
                  className="w-full p-2 border border-[var(--color-secondary)] rounded-[var(--border-radius)] bg-white"
                >
                  {fontFamilyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Save Theme */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Save as New Theme
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                    placeholder="Enter theme name"
                    className="flex-1 p-2 border border-[var(--color-secondary)] rounded-l-[var(--border-radius)]"
                  />
                  <Button
                    variant="primary"
                    onClick={handleSaveTheme}
                    disabled={!customThemeName.trim()}
                    className="rounded-l-none"
                  >
                    Save Theme
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('select')}
                >
                  Back to Theme Selection
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Preview */}
        {(showPreview || activeTab === 'select') && (
          <div className="bg-[var(--color-background)] p-6 rounded-[var(--border-radius)] border border-[var(--color-secondary)]">
            <h2 className="text-lg font-medium text-[var(--color-text)] mb-4">Component Preview</h2>
            
            {/* Buttons */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-2">Buttons</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            
            {/* Card */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-2">Card</h3>
              <Card title="Example Card">
                <div className="p-4">
                  <p className="text-[var(--color-text)] mb-4">
                    This is an example card with the current theme applied.
                  </p>
                  <Button variant="primary">Card Action</Button>
                </div>
              </Card>
            </div>
            
            {/* Form Controls */}
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-2">Form Controls</h3>
              <Input
                id="example-input"
                label="Example Input"
                placeholder="Enter some text"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Checkbox
                id="example-checkbox"
                label="Example Checkbox"
                checked={checkboxState}
                onChange={() => setCheckboxState(!checkboxState)}
              />
            </div>
            
            {/* Theme Variables */}
            <div className="mt-6 p-3 bg-white rounded-[var(--border-radius)] border border-[var(--color-secondary)]">
              <h3 className="text-sm font-medium text-[var(--color-text)] mb-2">Current Theme Variables</h3>
              <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded-[var(--border-radius)]">
                {JSON.stringify(currentTheme, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
