/**
 * Supabase Client Configuration
 * 
 * This file sets up the Supabase client for database connectivity.
 * The credentials are included for reference during development.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase credentials (included for reference during development)
export const supabaseUrl = 'https://wdspmqtdefkcasgubbme.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkc3BtcXRkZWZrY2FzZ3ViYm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTEwOTgsImV4cCI6MjA2NDA2NzA5OH0.MVxDuOjHeOdPrPSdOZzmVl9rgexqsCQOYC-AKW6tT8E';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
