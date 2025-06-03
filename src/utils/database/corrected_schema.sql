/**
 * Corrected Database Schema for Wall Mounted Cabinet Management Tool
 * 
 * This file contains the corrected SQL schema that properly aligns with the application code.
 * It resolves the naming inconsistencies and field mismatches between the database and application.
 */

-- Create components table with fields matching componentService.ts expectations
-- Note: Using snake_case for column names and matching all expected fields
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  material TEXT, -- Changed from materialType
  dimensions TEXT, -- Changed from size
  weight NUMERIC,
  cost NUMERIC,
  supplier TEXT,
  stock INTEGER NOT NULL DEFAULT 0, -- Changed from defaultQty
  price NUMERIC NOT NULL DEFAULT 0,
  archived BOOLEAN NOT NULL DEFAULT false,
  next_day_delivery BOOLEAN NOT NULL DEFAULT false, -- Added missing field
  general_stock BOOLEAN NOT NULL DEFAULT true, -- Added missing field
  product_order_code TEXT,
  supplier_id UUID,
  customer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Changed from createdAt
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Changed from updatedAt
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column for components
CREATE TRIGGER update_components_updated_at
BEFORE UPDATE ON components
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create products table matching Product interface in DataContext.tsx
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to automatically update the updated_at column for products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create product_components junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS product_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, component_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  notes TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to automatically update the updated_at column for orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  component_id UUID REFERENCES components(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL, -- Changed from originalFilename
  file_size INTEGER NOT NULL, -- Changed from fileSize
  file_type TEXT NOT NULL, -- Changed from fileType
  category TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  uploaded_by TEXT, -- Changed from uploadedBy
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Changed from uploadedAt
  last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Changed from lastModifiedAt
);

-- Create forms table for form management system
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  table_name TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  fields JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Changed from createdAt
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Changed from updatedAt
);

-- Create trigger to automatically update the updated_at column for forms
CREATE TRIGGER update_forms_updated_at
BEFORE UPDATE ON forms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create dropdown_lists table for list management
CREATE TABLE IF NOT EXISTS dropdown_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Changed from createdAt
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Changed from updatedAt
  archived BOOLEAN DEFAULT FALSE
);

-- Create board_types table for board management
CREATE TABLE IF NOT EXISTS board_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  thickness INTEGER NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to automatically update the updated_at column for board_types
CREATE TRIGGER update_board_types_updated_at
BEFORE UPDATE ON board_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_components_name ON components(name);
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_components_archived ON components(archived);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_archived ON products(archived);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_forms_name ON forms(name);
CREATE INDEX IF NOT EXISTS idx_board_types_name ON board_types(name);

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

-- Apply similar RLS policies to other tables
-- (Repeat for products, orders, documents, forms, etc.)

-- Initialize default form schemas for existing forms
-- (These are included in the forms_schema.sql file)
