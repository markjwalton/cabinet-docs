/**
 * Database Scripts for Components Table
 * 
 * This file contains SQL scripts to create and initialize the components table.
 * These scripts should be run on the Supabase database to set up the necessary infrastructure.
 */

-- Create components table if it doesn't exist
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  material TEXT,
  dimensions TEXT,
  weight NUMERIC,
  cost NUMERIC,
  supplier TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  archived BOOLEAN NOT NULL DEFAULT false,
  next_day_delivery BOOLEAN NOT NULL DEFAULT false,
  general_stock BOOLEAN NOT NULL DEFAULT true,
  product_order_code TEXT,
  supplier_id UUID,
  customer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_components_updated_at
BEFORE UPDATE ON components
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies for components table
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all components
CREATE POLICY components_select_policy ON components
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert components
CREATE POLICY components_insert_policy ON components
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update components
CREATE POLICY components_update_policy ON components
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete components
CREATE POLICY components_delete_policy ON components
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create index on commonly queried columns
CREATE INDEX IF NOT EXISTS components_name_idx ON components (name);
CREATE INDEX IF NOT EXISTS components_category_idx ON components (category);
CREATE INDEX IF NOT EXISTS components_archived_idx ON components (archived);
