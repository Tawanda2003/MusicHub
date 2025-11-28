-- Create hero_sliders table for storing banner images
CREATE TABLE IF NOT EXISTS public.hero_sliders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hero sliders"
  ON public.hero_sliders
  FOR SELECT
  USING (true);

-- Seed some initial hero images
INSERT INTO public.hero_sliders (title, description, image_url, order_index) VALUES
  ('Connect with Musicians', 'Share your passion and collaborate worldwide', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=500&fit=crop', 1),
  ('Discover Events', 'Find amazing music events near you', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=500&fit=crop', 2),
  ('Share Your Music', 'Create posts and connect with the community', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=500&fit=crop', 3);
