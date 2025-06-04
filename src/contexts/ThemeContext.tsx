'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import ThemeStorageService from '../services/ThemeStorageService';

// Define theme types
export type ThemeColors = {
  primary: string;
  secondary: string;
  danger: string;
  success: string;
  warning: string;
  text: string;
  background: string;
};

export type ThemeSettings = {
  colors: ThemeColors;
  borderRadius: string;
  fontFamily: string;
  name: string;
};

// Predefined themes
export const themes: Record<string, ThemeSettings> = {
  default: {
    name: 'Default Theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      danger: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
      text: '#1f2937',
      background: '#f9fafb',
    },
    borderRadius: '0.375rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  dark: {
    name: 'Dark Theme',
    colors: {
      primary: '#8b5cf6',
      secondary: '#6b7280',
      danger: '#f87171',
      success: '#4ade80',
      warning: '#fbbf24',
      text: '#f9fafb',
      background: '#1f2937',
    },
    borderRadius: '0.375rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  green: {
    name: 'Green Theme',
    colors: {
      primary: '#10b981',
      secondary: '#64748b',
      danger: '#ef4444',
      success: '#059669',
      warning: '#f59e0b',
      text: '#1f2937',
      background: '#ecfdf5',
    },
    borderRadius: '0.75rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  corporate: {
    name: 'Corporate Theme',
    colors: {
      primary: '#0ea5e9',
      secondary: '#475569',
      danger: '#dc2626',
      success: '#16a34a',
      warning: '#d97706',
      text: '#334155',
      background: '#f8fafc',
    },
    borderRadius: '0.125rem',
    fontFamily: 'Arial, sans-serif',
  },
  playful: {
    name: 'Playful Theme',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      danger: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
      text: '#4b5563',
      background: '#fdf2f8',
    },
    borderRadius: '1rem',
    fontFamily: 'Trebuchet MS, sans-serif',
  },
};

// Theme context type
type ThemeContextType = {
  currentTheme: ThemeSettings;
  setTheme: (themeName: string) => void;
  customizeTheme: (themeSettings: Partial<ThemeSettings>) => void;
  availableThemes: string[];
  saveCustomTheme: (name: string) => void;
  isLoading: boolean;
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: string;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'default' 
}) => {
  // Initialize state with default theme
  const [currentThemeName, setCurrentThemeName] = useState<string>(defaultTheme);
  const [customThemes, setCustomThemes] = useState<Record<string, ThemeSettings>>({});
  const [currentTheme, setCurrentTheme] = useState<ThemeSettings>(themes[defaultTheme]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load theme from storage on initial render
  useEffect(() => {
    const loadThemes = async () => {
      setIsLoading(true);
      try {
        // Load custom themes
        const savedCustomThemes = await ThemeStorageService.getCustomThemes();
        setCustomThemes(savedCustomThemes);
        
        // Load current theme name
        const savedThemeName = await ThemeStorageService.getCurrentThemeName();
        if (savedThemeName) {
          setCurrentThemeName(savedThemeName);
        }
      } catch (error) {
        console.error('Error loading themes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemes();
  }, []);
  
  // Update current theme when theme name changes
  useEffect(() => {
    const allThemes = { ...themes, ...customThemes };
    if (allThemes[currentThemeName]) {
      setCurrentTheme(allThemes[currentThemeName]);
      
      // Save current theme name to storage
      ThemeStorageService.saveCurrentThemeName(currentThemeName);
      
      // Apply CSS variables to :root
      const root = document.documentElement;
      const colors = allThemes[currentThemeName].colors;
      
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-secondary', colors.secondary);
      root.style.setProperty('--color-danger', colors.danger);
      root.style.setProperty('--color-success', colors.success);
      root.style.setProperty('--color-warning', colors.warning);
      root.style.setProperty('--color-text', colors.text);
      root.style.setProperty('--color-background', colors.background);
      root.style.setProperty('--border-radius', allThemes[currentThemeName].borderRadius);
      root.style.setProperty('--font-family', allThemes[currentThemeName].fontFamily);
    }
  }, [currentThemeName, customThemes]);
  
  // Set theme by name
  const setTheme = (themeName: string) => {
    const allThemes = { ...themes, ...customThemes };
    if (allThemes[themeName]) {
      setCurrentThemeName(themeName);
    } else {
      console.warn(`Theme "${themeName}" not found, using default theme instead.`);
      setCurrentThemeName('default');
    }
  };
  
  // Customize current theme
  const customizeTheme = (themeSettings: Partial<ThemeSettings>) => {
    setCurrentTheme(prevTheme => {
      const newTheme = {
        ...prevTheme,
        ...themeSettings,
        colors: {
          ...prevTheme.colors,
          ...(themeSettings.colors || {}),
        },
      };
      
      return newTheme;
    });
  };
  
  // Save current theme as a new custom theme
  const saveCustomTheme = async (name: string) => {
    if (!name.trim()) {
      console.error('Theme name cannot be empty');
      return;
    }
    
    const themeToSave = {
      ...currentTheme,
      name,
    };
    
    const newCustomThemes = {
      ...customThemes,
      [name]: themeToSave,
    };
    
    setCustomThemes(newCustomThemes);
    setCurrentThemeName(name);
    
    // Save to storage
    await ThemeStorageService.saveCustomTheme(name, themeToSave);
    await ThemeStorageService.saveCustomThemes(newCustomThemes);
  };
  
  // Get all available theme names
  const availableThemes = [...Object.keys(themes), ...Object.keys(customThemes)];
  
  // Context value
  const contextValue: ThemeContextType = {
    currentTheme,
    setTheme,
    customizeTheme,
    availableThemes,
    saveCustomTheme,
    isLoading,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
