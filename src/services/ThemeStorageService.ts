'use client';

import { createClient } from '@supabase/supabase-js';
import { ThemeSettings } from '@/contexts/ThemeContext';

// Initialize Supabase client - replace with your actual Supabase URL and anon key
// In a real application, these would be environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Theme Storage Service
 * 
 * Provides methods for storing and retrieving theme settings from Supabase.
 * Falls back to localStorage if Supabase is not configured or unavailable.
 */
export class ThemeStorageService {
  // Local storage keys
  private static readonly THEME_STORAGE_KEY = 'cabinet-ui-theme';
  private static readonly CUSTOM_THEMES_STORAGE_KEY = 'cabinet-ui-custom-themes';
  
  /**
   * Get the current theme name from storage
   */
  static async getCurrentThemeName(): Promise<string | null> {
    try {
      // Try to get from Supabase first
      if (this.isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('current_theme')
          .single();
          
        if (!error && data) {
          return data.current_theme;
        }
      }
    } catch (e) {
      console.error('Error fetching theme from Supabase:', e);
    }
    
    // Fall back to localStorage
    return localStorage.getItem(this.THEME_STORAGE_KEY);
  }
  
  /**
   * Save the current theme name to storage
   */
  static async saveCurrentThemeName(themeName: string): Promise<void> {
    try {
      // Try to save to Supabase first
      if (this.isSupabaseConfigured()) {
        const { error } = await supabase
          .from('user_settings')
          .upsert({ 
            id: 'current-user', // In a real app, this would be the actual user ID
            current_theme: themeName,
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error saving theme to Supabase:', error);
        }
      }
    } catch (e) {
      console.error('Error saving theme to Supabase:', e);
    }
    
    // Always save to localStorage as backup
    localStorage.setItem(this.THEME_STORAGE_KEY, themeName);
  }
  
  /**
   * Get all custom themes from storage
   */
  static async getCustomThemes(): Promise<Record<string, ThemeSettings>> {
    try {
      // Try to get from Supabase first
      if (this.isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('custom_themes')
          .select('*');
          
        if (!error && data) {
          // Convert array to record object
          const themes: Record<string, ThemeSettings> = {};
          data.forEach(theme => {
            themes[theme.name] = theme.settings;
          });
          return themes;
        }
      }
    } catch (e) {
      console.error('Error fetching custom themes from Supabase:', e);
    }
    
    // Fall back to localStorage
    const savedThemes = localStorage.getItem(this.CUSTOM_THEMES_STORAGE_KEY);
    if (savedThemes) {
      try {
        return JSON.parse(savedThemes);
      } catch (e) {
        console.error('Failed to parse custom themes from localStorage:', e);
      }
    }
    
    return {};
  }
  
  /**
   * Save custom themes to storage
   */
  static async saveCustomThemes(themes: Record<string, ThemeSettings>): Promise<void> {
    try {
      // Try to save to Supabase first
      if (this.isSupabaseConfigured()) {
        // Convert record to array for Supabase
        const themesArray = Object.entries(themes).map(([name, settings]) => ({
          name,
          settings,
          updated_at: new Date().toISOString()
        }));
        
        // Delete existing themes first
        await supabase
          .from('custom_themes')
          .delete()
          .neq('id', 0); // Delete all records
          
        // Insert new themes
        const { error } = await supabase
          .from('custom_themes')
          .insert(themesArray);
          
        if (error) {
          console.error('Error saving custom themes to Supabase:', error);
        }
      }
    } catch (e) {
      console.error('Error saving custom themes to Supabase:', e);
    }
    
    // Always save to localStorage as backup
    localStorage.setItem(this.CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(themes));
  }
  
  /**
   * Save a single custom theme to storage
   */
  static async saveCustomTheme(name: string, theme: ThemeSettings): Promise<void> {
    try {
      // Try to save to Supabase first
      if (this.isSupabaseConfigured()) {
        const { error } = await supabase
          .from('custom_themes')
          .upsert({ 
            name,
            settings: theme,
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error saving custom theme to Supabase:', error);
        }
      }
    } catch (e) {
      console.error('Error saving custom theme to Supabase:', e);
    }
    
    // Also update localStorage
    const savedThemes = localStorage.getItem(this.CUSTOM_THEMES_STORAGE_KEY);
    let themes: Record<string, ThemeSettings> = {};
    
    if (savedThemes) {
      try {
        themes = JSON.parse(savedThemes);
      } catch (e) {
        console.error('Failed to parse custom themes from localStorage:', e);
      }
    }
    
    themes[name] = theme;
    localStorage.setItem(this.CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(themes));
  }
  
  /**
   * Check if Supabase is properly configured
   */
  private static isSupabaseConfigured(): boolean {
    return supabaseUrl !== 'https://your-project.supabase.co' && 
           supabaseAnonKey !== 'your-anon-key';
  }
}

export default ThemeStorageService;
