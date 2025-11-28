-- Insert sample hero slider images
INSERT INTO hero_sliders (title, description, image_url, order_index) VALUES
  ('Welcome to MusiansHub', 'Connect with musicians worldwide', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=500&fit=crop', 0),
  ('Create & Share Your Music', 'Post your tracks and collaborate', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=500&fit=crop', 1),
  ('Join Live Events', 'Attend concerts and networking sessions', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=500&fit=crop', 2)
ON CONFLICT DO NOTHING;
