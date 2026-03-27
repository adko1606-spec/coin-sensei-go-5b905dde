INSERT INTO cosmetic_items (id, name, category, icon, preview_emoji, price, description)
VALUES
  ('color_rainbow', 'Dúhový efekt', 'color', '🌈', '🌈', 35, 'Magická dúha žiariaca za tvojou postavou'),
  ('color_rays', 'Svetelné lúče', 'color', '☀️', '☀️', 30, 'Žiarivé lúče vyžarujúce z tvojej postavy'),
  ('color_aura', 'Anime aura', 'color', '💜', '💜', 40, 'Mystická anime aura obklopujúca tvoju postavu')
ON CONFLICT (id) DO NOTHING;