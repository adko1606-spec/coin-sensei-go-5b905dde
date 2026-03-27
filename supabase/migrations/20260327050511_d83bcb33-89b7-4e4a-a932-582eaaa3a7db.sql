
-- Cosmetic items table
CREATE TABLE public.cosmetic_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL, -- 'hat', 'glasses', 'color', 'accessory'
  price integer NOT NULL DEFAULT 10,
  preview_emoji text NOT NULL DEFAULT '🎨',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.cosmetic_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cosmetic items"
  ON public.cosmetic_items FOR SELECT TO public
  USING (true);

-- User purchased cosmetics
CREATE TABLE public.user_cosmetics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  item_id text NOT NULL REFERENCES public.cosmetic_items(id),
  equipped boolean NOT NULL DEFAULT false,
  purchased_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.user_cosmetics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cosmetics"
  ON public.user_cosmetics FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cosmetics"
  ON public.user_cosmetics FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cosmetics"
  ON public.user_cosmetics FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Seed cosmetic items
INSERT INTO public.cosmetic_items (id, name, description, icon, category, price, preview_emoji) VALUES
  ('hat_tophat', 'Cylinder', 'Elegantný klobúk pre finančníka', '🎩', 'hat', 15, '🎩'),
  ('hat_crown', 'Koruna', 'Kráľ investícií!', '👑', 'hat', 30, '👑'),
  ('hat_cap', 'Šiltovka', 'Neformálny štýl tradera', '🧢', 'hat', 10, '🧢'),
  ('hat_cowboy', 'Kovbojský klobúk', 'Divoký západ Wall Street', '🤠', 'hat', 20, '🤠'),
  ('glasses_sun', 'Slnečné okuliare', 'Cool investor look', '🕶️', 'glasses', 10, '🕶️'),
  ('glasses_nerd', 'Nerd okuliare', 'Pre analytika', '🤓', 'glasses', 12, '🤓'),
  ('glasses_monocle', 'Monokl', 'Starosvetský šarm', '🧐', 'glasses', 25, '🧐'),
  ('acc_diamond', 'Diamantový prsteň', 'Diamond hands forever', '💍', 'accessory', 35, '💍'),
  ('acc_watch', 'Luxusné hodinky', 'Čas sú peniaze', '⌚', 'accessory', 20, '⌚'),
  ('acc_briefcase', 'Kufrík', 'Plný peňazí... alebo dokumentov', '💼', 'accessory', 15, '💼'),
  ('acc_rocket', 'Raketa', 'To the moon! 🚀', '🚀', 'accessory', 40, '🚀'),
  ('color_gold', 'Zlatý rámček', 'Zlatá aura okolo postavy', '✨', 'color', 25, '✨'),
  ('color_fire', 'Ohnivý efekt', 'Horúci investor', '🔥', 'color', 30, '🔥'),
  ('color_ice', 'Ľadový efekt', 'Cool as ice', '❄️', 'color', 30, '❄️');
