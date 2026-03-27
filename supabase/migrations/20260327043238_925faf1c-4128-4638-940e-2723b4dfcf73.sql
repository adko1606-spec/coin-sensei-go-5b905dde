
-- Add new columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS coins integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS selected_character text DEFAULT NULL;

-- Create badges table
CREATE TABLE public.badges (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id text NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Badges are readable by everyone (public data)
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert predefined badges
INSERT INTO public.badges (id, name, description, icon, requirement) VALUES
  ('first_steps', 'Prvé kroky', 'Dokončil si svoju prvú lekciu!', '🎓', 'complete_1_lesson'),
  ('knowledge_seeker', 'Hľadač vedomostí', 'Dokončil si 5 lekcií', '📚', 'complete_5_lessons'),
  ('finance_master', 'Finančný majster', 'Dokončil si 10 lekcií', '🏆', 'complete_10_lessons'),
  ('perfect_score', 'Perfektné skóre', 'Získal si 100% v kvíze', '⭐', 'perfect_quiz'),
  ('week_warrior', 'Týždenný bojovník', '7-dňová séria bez prerušenia', '🔥', 'streak_7'),
  ('xp_hunter', 'XP lovec', 'Získal si 500 XP', '💎', 'xp_500'),
  ('rich_mind', 'Bohatá myseľ', 'Získal si 1000 XP', '🧠', 'xp_1000'),
  ('daily_champion', 'Denný šampión', 'Splnil si 5 denných výziev', '🏅', 'daily_5'),
  ('coin_collector', 'Zberateľ mincí', 'Nazbieral si 100 mincí', '🪙', 'coins_100'),
  ('unstoppable', 'Nezastaviteľný', '30-dňová séria', '💪', 'streak_30');
