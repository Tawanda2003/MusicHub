-- Create images table for better image management
CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for images
CREATE POLICY "Anyone can view images" ON public.images
  FOR SELECT USING (true);

CREATE POLICY "Users can upload images" ON public.images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their images" ON public.images
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX images_post_id_idx ON public.images(post_id);
CREATE INDEX images_event_id_idx ON public.images(event_id);
CREATE INDEX images_user_id_idx ON public.images(user_id);
