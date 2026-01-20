-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CMS Pages Table
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB, -- Rich text content structure
  seo_title TEXT,
  meta_description TEXT,
  schema_json JSONB, -- For structured data
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CMS Categories Table
CREATE TABLE IF NOT EXISTS cms_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. CMS Products Table
CREATE TABLE IF NOT EXISTS cms_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2),
  description TEXT,
  specifications JSONB, -- Key-value pairs for specs
  category_id UUID REFERENCES cms_categories(id) ON DELETE SET NULL,
  images TEXT[], -- Array of image URLs
  seo_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. CMS Homepage Table
CREATE TABLE IF NOT EXISTS cms_homepage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE, -- e.g., 'hero', 'features', 'testimonials'
  content JSONB NOT NULL, -- Flexible structure for each section
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. CMS Settings Table
CREATE TABLE IF NOT EXISTS cms_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE, -- e.g., 'site_config'
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default Homepage sections if they don't exist
INSERT INTO cms_homepage (section_key, content)
VALUES 
  ('hero', '{"heading": "Welcome", "subheading": "Best Packaging", "cta_text": "Get Quote", "cta_link": "/contact"}'),
  ('features', '{"items": []}'),
  ('call_to_action', '{"text": "Ready to start?", "button_text": "Contact Us"}')
ON CONFLICT (section_key) DO NOTHING;

-- Insert default Settings
INSERT INTO cms_settings (key, value)
VALUES 
  ('general', '{"site_name": "Pakiging Hippo", "contact_email": "info@pakiginghippo.com"}')
ON CONFLICT (key) DO NOTHING;
