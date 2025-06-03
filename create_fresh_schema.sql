/**
 * Wall Mounted Cabinet Management Tool - Fresh Database Schema
 * 
 * This script creates a complete database schema for the Cabinet Management Tool.
 * It includes all necessary tables, relationships, indexes, and default data.
 * 
 * Run this in the Supabase SQL Editor after dropping all existing tables.
 */

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create components table
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
  reorder_point INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
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

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  preferred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived BOOLEAN DEFAULT FALSE
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_components_updated_at
BEFORE UPDATE ON components
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forms_updated_at
BEFORE UPDATE ON forms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_types_updated_at
BEFORE UPDATE ON board_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_components_name ON components(name);
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_components_archived ON components(archived);
CREATE INDEX IF NOT EXISTS idx_components_stock ON components(stock);
CREATE INDEX IF NOT EXISTS idx_components_reorder_point ON components(reorder_point);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_archived ON products(archived);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

CREATE INDEX IF NOT EXISTS idx_product_components_product_id ON product_components(product_id);
CREATE INDEX IF NOT EXISTS idx_product_components_component_id ON product_components(component_id);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_component_id ON order_items(component_id);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON documents(file_type);

CREATE INDEX IF NOT EXISTS idx_forms_name ON forms(name);
CREATE INDEX IF NOT EXISTS idx_forms_table_name ON forms(table_name);

CREATE INDEX IF NOT EXISTS idx_dropdown_lists_name ON dropdown_lists(name);
CREATE INDEX IF NOT EXISTS idx_dropdown_lists_archived ON dropdown_lists(archived);

CREATE INDEX IF NOT EXISTS idx_board_types_name ON board_types(name);
CREATE INDEX IF NOT EXISTS idx_board_types_in_stock ON board_types(in_stock);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_preferred ON suppliers(preferred);
CREATE INDEX IF NOT EXISTS idx_suppliers_archived ON suppliers(archived);

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
      "label": "Price (£)",
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
      "id": "reorder_point_field",
      "label": "Reorder Point",
      "type": "number",
      "placeholder": "Enter reorder point",
      "required": true,
      "order": 5,
      "dbField": "reorder_point",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "next_day_delivery_field",
      "label": "Next Day Delivery",
      "type": "checkbox",
      "required": false,
      "order": 6,
      "dbField": "next_day_delivery",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "general_stock_field",
      "label": "General Stock",
      "type": "checkbox",
      "required": false,
      "order": 7,
      "dbField": "general_stock",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "material_field",
      "label": "Material",
      "type": "text",
      "placeholder": "Enter material",
      "required": false,
      "order": 8,
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
      "order": 9,
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
      "order": 10,
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
      "order": 11,
      "dbField": "supplier",
      "isSystem": true,
      "hasData": false
    }
  ]'::JSONB
);

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
      "label": "Price (£)",
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
);

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
);

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
);

-- Add Supplier Form
INSERT INTO forms (name, description, table_name, is_system, fields)
VALUES (
  'Add Supplier',
  'Form for adding new suppliers to the system',
  'suppliers',
  TRUE,
  '[
    {
      "id": "name_field",
      "label": "Supplier Name",
      "type": "text",
      "placeholder": "Enter supplier name",
      "required": true,
      "order": 0,
      "dbField": "name",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "contact_name_field",
      "label": "Contact Name",
      "type": "text",
      "placeholder": "Enter contact name",
      "required": false,
      "order": 1,
      "dbField": "contact_name",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "email_field",
      "label": "Email",
      "type": "email",
      "placeholder": "Enter supplier email",
      "required": false,
      "order": 2,
      "dbField": "email",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "phone_field",
      "label": "Phone",
      "type": "tel",
      "placeholder": "Enter supplier phone",
      "required": false,
      "order": 3,
      "dbField": "phone",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "address_field",
      "label": "Address",
      "type": "textarea",
      "placeholder": "Enter supplier address",
      "required": false,
      "order": 4,
      "dbField": "address",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "notes_field",
      "label": "Notes",
      "type": "textarea",
      "placeholder": "Enter any notes about this supplier",
      "required": false,
      "order": 5,
      "dbField": "notes",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "preferred_field",
      "label": "Preferred Supplier",
      "type": "checkbox",
      "required": false,
      "order": 6,
      "dbField": "preferred",
      "isSystem": true,
      "hasData": false
    }
  ]'::JSONB
);

-- Add Document Form
INSERT INTO forms (name, description, table_name, is_system, fields)
VALUES (
  'Add Document',
  'Form for adding new documents to the system',
  'documents',
  TRUE,
  '[
    {
      "id": "original_filename_field",
      "label": "File",
      "type": "file",
      "required": true,
      "order": 0,
      "dbField": "original_filename",
      "isSystem": true,
      "hasData": false
    },
    {
      "id": "category_field",
      "label": "Category",
      "type": "text",
      "placeholder": "Enter document category",
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
      "placeholder": "Enter document description",
      "required": false,
      "order": 2,
      "dbField": "description",
      "isSystem": true,
      "hasData": false
    }
  ]'::JSONB
);

-- Create default dropdown lists
INSERT INTO dropdown_lists (name, description, items)
VALUES (
  'Component Categories',
  'Categories for components',
  '[
    {"id": "hardware", "label": "Hardware", "value": "hardware"},
    {"id": "board", "label": "Board", "value": "board"},
    {"id": "fitting", "label": "Fitting", "value": "fitting"},
    {"id": "accessory", "label": "Accessory", "value": "accessory"},
    {"id": "finish", "label": "Finish", "value": "finish"}
  ]'::JSONB
);

INSERT INTO dropdown_lists (name, description, items)
VALUES (
  'Product Categories',
  'Categories for products',
  '[
    {"id": "wall_cabinet", "label": "Wall Cabinet", "value": "wall_cabinet"},
    {"id": "base_cabinet", "label": "Base Cabinet", "value": "base_cabinet"},
    {"id": "tall_cabinet", "label": "Tall Cabinet", "value": "tall_cabinet"},
    {"id": "corner_cabinet", "label": "Corner Cabinet", "value": "corner_cabinet"},
    {"id": "custom", "label": "Custom", "value": "custom"}
  ]'::JSONB
);

INSERT INTO dropdown_lists (name, description, items)
VALUES (
  'Order Priorities',
  'Priority levels for orders',
  '[
    {"id": "low", "label": "Low", "value": "low"},
    {"id": "medium", "label": "Medium", "value": "medium"},
    {"id": "high", "label": "High", "value": "high"},
    {"id": "urgent", "label": "Urgent", "value": "urgent"}
  ]'::JSONB
);

INSERT INTO dropdown_lists (name, description, items)
VALUES (
  'Order Statuses',
  'Status options for orders',
  '[
    {"id": "pending", "label": "Pending", "value": "pending"},
    {"id": "processing", "label": "Processing", "value": "processing"},
    {"id": "ready", "label": "Ready for Delivery", "value": "ready"},
    {"id": "delivered", "label": "Delivered", "value": "delivered"},
    {"id": "cancelled", "label": "Cancelled", "value": "cancelled"}
  ]'::JSONB
);

INSERT INTO dropdown_lists (name, description, items)
VALUES (
  'Document Categories',
  'Categories for documents',
  '[
    {"id": "installation", "label": "Installation Guide", "value": "installation"},
    {"id": "maintenance", "label": "Maintenance Manual", "value": "maintenance"},
    {"id": "specification", "label": "Technical Specification", "value": "specification"},
    {"id": "warranty", "label": "Warranty Information", "value": "warranty"},
    {"id": "other", "label": "Other", "value": "other"}
  ]'::JSONB
);

-- Output success message
DO $$ 
BEGIN
    RAISE NOTICE 'Database schema created successfully.';
END $$;
