/**
 * Database Scripts for Forms Management System
 * 
 * This file contains SQL scripts to create and initialize the forms management system tables.
 * These scripts should be run on the Supabase database to set up the necessary infrastructure.
 */

-- Create forms table to store form schemas
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

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_forms_updated_at
BEFORE UPDATE ON forms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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

-- Create RLS policies for forms table
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all forms
CREATE POLICY forms_select_policy ON forms
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert forms
CREATE POLICY forms_insert_policy ON forms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own forms
CREATE POLICY forms_update_policy ON forms
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete their own non-system forms
CREATE POLICY forms_delete_policy ON forms
  FOR DELETE USING (auth.role() = 'authenticated' AND NOT is_system);
