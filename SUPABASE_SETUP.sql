-- ========================================
-- SUPABASE SETUP SQL FOR IMAGE UPLOAD
-- Run these commands in your Supabase SQL Editor
-- ========================================

-- 1. Create the photos table
CREATE TABLE IF NOT EXISTS photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_sort_order ON photos(sort_order);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Anyone can view photos
CREATE POLICY "Photos are viewable by everyone"
ON photos FOR SELECT
USING (true);

-- Authenticated users can insert photos
CREATE POLICY "Photos can be inserted by authenticated users"
ON photos FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update photos
CREATE POLICY "Photos can be updated by authenticated users"
ON photos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete photos
CREATE POLICY "Photos can be deleted by authenticated users"
ON photos FOR DELETE
TO authenticated
USING (true);

-- ========================================
-- STORAGE BUCKET SETUP
-- ========================================
-- Note: Storage bucket must be created via the Supabase Dashboard
-- Go to: Storage > Create Bucket > Name: "portfolio" > Public: Yes
-- Then add these policies:

-- Storage policies for the "portfolio" bucket
-- Run these after creating the bucket via dashboard

-- Allow public read access to portfolio bucket
CREATE POLICY "Portfolio images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload to portfolio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio')
WITH CHECK (bucket_id = 'portfolio');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio');

-- ========================================
-- OPTIONAL: Seed some test data
-- ========================================
-- Uncomment below to add sample photos (you'll need actual files in storage first)

-- INSERT INTO photos (title, category, storage_path, sort_order) VALUES
-- ('Sample Wedding Photo', 'Weddings', 'sample-wedding.jpg', 0),
-- ('Sample Portrait', 'Portraits', 'sample-portrait.jpg', 1),
-- ('Sample Event Photo', 'Events', 'sample-event.jpg', 2);
