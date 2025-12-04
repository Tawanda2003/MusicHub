-- Insert sample hero slider images
INSERT INTO hero_sliders (title, description, image_url, order_index) VALUES
  ('Welcome to MusiansHub', 'Connect with musicians worldwide', '/music-hero.jpg', 1),
  ('Create & Share Your Music', 'Post your tracks and collaborate', '/music-hero.jpg', 2),
  ('Join Live Events', 'Attend concerts and networking sessions', '/music-hero.jpg', 3)
ON CONFLICT DO NOTHING;
