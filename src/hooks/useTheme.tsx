'use client';

/**
 * useTheme Hook
 * 
 * This hook provides access to the theme context throughout the application.
 * It's a simple re-export of the useTheme hook from ThemeContext for easier imports.
 * 
 * Usage example:
 * ```tsx
 * import { useTheme } from '@/hooks/useTheme';
 * 
 * // Inside your component:
 * const { currentTheme, setTheme } = useTheme();
 *   
 * // Access theme properties
 * const primaryColor = currentTheme.colors.primary;
 * 
 * // Switch themes
 * const handleThemeChange = () => setTheme('dark');
 * ```
 */

import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

// Re-export the hook for easier imports
export const useTheme = useThemeContext;

// Export as default for flexibility
export default useTheme;
