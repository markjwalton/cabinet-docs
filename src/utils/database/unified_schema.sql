/**
 * Unified Database Schema for Wall Mounted Cabinet Management Tool
 * 
 * This file contains the complete SQL schema that matches the application code.
 * It resolves the mismatch between database structure and application expectations.
 */

-- Create components table with fields matching componentService.ts expectations
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
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  uploaded_by TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forms table for form management system
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  table_name TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  fields JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Add Component Form
INSERT INTO forms (name, description, table_name, is_system, fields)
VALUES (
  'Add Component',
  'Form for adding new components to the system',
  'components',
  TRUE,
  '[
    {
      "id": "name_field",
      "label": "Component Name",
      "type": "text",
      "placeholder": "Enter component name",
      "required": true,
      "order": 0,
      "dbField": "name",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "category_field",
      "label": "Category",
      "type": "text",
      "placeholder": "Enter category",
      "required": true,
      "order": 1,
      "dbField": "category",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "description_field",
      "label": "Description",
      "type": "textarea",
      "placeholder": "Enter description",
      "required": false,
      "order": 2,
      "dbField": "description",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "price_field",
      "label": "Price",
      "type": "number",
      "placeholder": "Enter price",
      "required": true,
      "order": 3,
      "dbField": "price",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "stock_field",
      "label": "Stock",
      "type": "number",
      "placeholder": "Enter stock quantity",
      "required": true,
      "order": 4,
      "dbField": "stock",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "next_day_delivery_field",
      "label": "Next Day Delivery",
      "type": "checkbox",
      "required": false,
      "order": 5,
      "dbField": "next_day_delivery",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "material_field",
      "label": "Material",
      "type": "text",
      "placeholder": "Enter material",
      "required": false,
      "order": 6,
      "dbField": "material",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "dimensions_field",
      "label": "Dimensions",
      "type": "text",
      "placeholder": "Enter dimensions",
      "required": false,
      "order": 7,
      "dbField": "dimensions",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "weight_field",
      "label": "Weight",
      "type": "number",
      "placeholder": "Enter weight",
      "required": false,
      "order": 8,
      "dbField": "weight",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "supplier_field",
      "label": "Supplier",
      "type": "text",
      "placeholder": "Enter supplier",
      "required": false,
      "order": 9,
      "dbField": "supplier",
      "isSystem": true,
      "hasData": false
    }
  ]'::JSONB
) ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    table_name = EXCLUDED.table_name,
    is_system = EXCLUDED.is_system;

-- Add Product Form
INSERT INTO forms (name, description, table_name, is_system, fields)
VALUES (
  'Add Product',
  'Form for adding new products to the system',
  'products',
  TRUE,
  '[
    {
      "id": "name_field",
      "label": "Product Name",
      "type": "text",
      "placeholder": "Enter product name",
      "required": true,
      "order": 0,
      "dbField": "name",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "description_field",
      "label": "Description",
      "type": "textarea",
      "placeholder": "Enter description",
      "required": false,
      "order": 1,
      "dbField": "description",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "price_field",
      "label": "Price",
      "type": "number",
      "placeholder": "Enter price",
      "required": true,
      "order": 2,
      "dbField": "price",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "category_field",
      "label": "Category",
      "type": "text",
      "placeholder": "Enter category",
      "required": true,
      "order": 3,
      "dbField": "category",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "status_field",
      "label": "Status",
      "type": "select",
      "required": true,
      "order": 4,
      "dbField": "status",
      "isSystem": true,
      "hasData": false,
      "options": [
        {
          "value": "active",
          "label": "Active"
        },
        {
          "value": "inactive",
          "label": "Inactive"
        },
        {
          "value": "discontinued",
          "label": "Discontinued"
        }
      ]
    }
  ]'::JSONB
) ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    table_name = EXCLUDED.table_name,
    is_system = EXCLUDED.is_system;

-- Add Order Form
INSERT INTO forms (name, description, table_name, is_system, fields)
VALUES (
  'Add Order',
  'Form for adding new orders to the system',
  'orders',
  TRUE,
  '[
    {
      "id": "customer_field",
      "label": "Customer Name",
      "type": "text",
      "placeholder": "Enter customer name",
      "required": true,
      "order": 0,
      "dbField": "customer",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "email_field",
      "label": "Email",
      "type": "email",
      "placeholder": "Enter customer email",
      "required": true,
      "order": 1,
      "dbField": "email",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "phone_field",
      "label": "Phone",
      "type": "tel",
      "placeholder": "Enter customer phone",
      "required": false,
      "order": 2,
      "dbField": "phone",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "address_field",
      "label": "Delivery Address",
      "type": "textarea",
      "placeholder": "Enter delivery address",
      "required": true,
      "order": 3,
      "dbField": "address",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "delivery_date_field",
      "label": "Delivery Date",
      "type": "date",
      "required": true,
      "order": 4,
      "dbField": "delivery_date",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "notes_field",
      "label": "Order Notes",
      "type": "textarea",
      "placeholder": "Enter any special instructions or notes",
      "required": false,
      "order": 5,
      "dbField": "notes",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "priority_field",
      "label": "Priority",
      "type": "select",
      "required": true,
      "order": 6,
      "dbField": "priority",
      "isSystem": true,
      "hasData": false,
      "options": [
        {
          "value": "low",
          "label": "Low"
        },
        {
          "value": "medium",
          "label": "Medium"
        },
        {
          "value": "high",
          "label": "High"
        },
        {
          "value": "urgent",
          "label": "Urgent"
        }
      ]
    }
  ]'::JSONB
) ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    table_name = EXCLUDED.table_name,
    is_system = EXCLUDED.is_system;

-- Add Board Type Form
INSERT INTO forms (name, description, table_name, is_system, fields)
VALUES (
  'Add Board Type',
  'Form for adding new board types to the system',
  'board_types',
  TRUE,
  '[
    {
      "id": "name_field",
      "label": "Board Name",
      "type": "text",
      "placeholder": "Enter board name",
      "required": true,
      "order": 0,
      "dbField": "name",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "description_field",
      "label": "Description",
      "type": "textarea",
      "placeholder": "Enter description",
      "required": false,
      "order": 1,
      "dbField": "description",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "thickness_field",
      "label": "Thickness (mm)",
      "type": "number",
      "placeholder": "Enter thickness in mm",
      "required": true,
      "order": 2,
      "dbField": "thickness",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "in_stock_field",
      "label": "In Stock",
      "type": "checkbox",
      "required": false,
      "order": 3,
      "dbField": "in_stock",
      "isSystem": true,
      "hasData": false
    }
  ]'::JSONB
) ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    table_name = EXCLUDED.table_name,
    is_system = EXCLUDED.is_system;
