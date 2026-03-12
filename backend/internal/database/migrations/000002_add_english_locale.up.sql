-- Add English locale columns to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en VARCHAR(255) NOT NULL DEFAULT '';

-- Add English locale columns to subcategories
ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS name_en VARCHAR(255) NOT NULL DEFAULT '';

-- Add English locale columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en VARCHAR(500) NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add English locale columns to delivery_zones
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS name_en VARCHAR(255) NOT NULL DEFAULT '';
