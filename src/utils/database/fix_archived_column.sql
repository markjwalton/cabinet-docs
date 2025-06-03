/**
 * Fix for "column 'archived' does not exist" error
 * 
 * This script provides targeted fixes for the components table
 * to ensure it has the 'archived' column and all other required columns
 * that match the application's expectations.
 */

-- Check if components table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'components') THEN
        -- Add archived column if it doesn't exist
        BEGIN
            ALTER TABLE components ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
        
        -- Add other potentially missing columns with proper snake_case naming
        BEGIN
            ALTER TABLE components ADD COLUMN IF NOT EXISTS material TEXT;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
        
        BEGIN
            ALTER TABLE components ADD COLUMN IF NOT EXISTS dimensions TEXT;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
        
        BEGIN
            ALTER TABLE components ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
        
        BEGIN
            ALTER TABLE components ADD COLUMN IF NOT EXISTS next_day_delivery BOOLEAN DEFAULT false;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
        
        BEGIN
            ALTER TABLE components ADD COLUMN IF NOT EXISTS general_stock BOOLEAN DEFAULT true;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
        
        BEGIN
            ALTER TABLE components ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
        
        -- Rename any camelCase columns to snake_case if they exist
        -- Check if camelCase columns exist and rename them
        
        -- materialType to material
        DO $$
        BEGIN
            IF EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'components' AND column_name = 'materialtype') THEN
                ALTER TABLE components RENAME COLUMN materialtype TO material;
            END IF;
        END $$;
        
        -- defaultQty to stock
        DO $$
        BEGIN
            IF EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'components' AND column_name = 'defaultqty') THEN
                ALTER TABLE components RENAME COLUMN defaultqty TO stock;
            END IF;
        END $$;
        
        -- size to dimensions
        DO $$
        BEGIN
            IF EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'components' AND column_name = 'size') THEN
                ALTER TABLE components RENAME COLUMN size TO dimensions;
            END IF;
        END $$;
        
        -- createdAt to created_at
        DO $$
        BEGIN
            IF EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'components' AND column_name = 'createdat') THEN
                ALTER TABLE components RENAME COLUMN createdat TO created_at;
            END IF;
        END $$;
        
        -- updatedAt to updated_at
        DO $$
        BEGIN
            IF EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'components' AND column_name = 'updatedat') THEN
                ALTER TABLE components RENAME COLUMN updatedat TO updated_at;
            END IF;
        END $$;
        
        -- Create trigger for updated_at if it doesn't exist
        DO $$
        BEGIN
            -- First create the function if it doesn't exist
            IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
                CREATE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                  NEW.updated_at = NOW();
                  RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            END IF;
            
            -- Then create the trigger if it doesn't exist
            IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_components_updated_at') THEN
                CREATE TRIGGER update_components_updated_at
                BEFORE UPDATE ON components
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            END IF;
        END $$;
        
        -- Create indexes if they don't exist
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_components_archived') THEN
                CREATE INDEX idx_components_archived ON components(archived);
            END IF;
        END $$;
        
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_components_name') THEN
                CREATE INDEX idx_components_name ON components(name);
            END IF;
        END $$;
        
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_components_category') THEN
                CREATE INDEX idx_components_category ON components(category);
            END IF;
        END $$;
        
    ELSE
        -- If components table doesn't exist, create it with all required columns
        CREATE TABLE components (
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
        
        -- Create function to update the updated_at timestamp if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
            CREATE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        END IF;
        
        -- Create trigger to automatically update the updated_at column for components
        CREATE TRIGGER update_components_updated_at
        BEFORE UPDATE ON components
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        -- Create indexes for better performance
        CREATE INDEX idx_components_name ON components(name);
        CREATE INDEX idx_components_category ON components(category);
        CREATE INDEX idx_components_archived ON components(archived);
    END IF;
END $$;

-- Output the current structure of the components table for verification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'components'
ORDER BY ordinal_position;
