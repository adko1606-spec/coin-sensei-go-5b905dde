
-- Player ratings table
CREATE TABLE public.player_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  rating integer NOT NULL DEFAULT 0,
  rank text NOT NULL DEFAULT 'Bronze',
  wins integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  win_streak integer NOT NULL DEFAULT 0,
  highest_rating integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.player_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON public.player_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert own rating" ON public.player_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rating" ON public.player_ratings FOR UPDATE USING (auth.uid() = user_id);

-- PvP queue
CREATE TABLE public.pvp_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  rating integer NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pvp_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view queue" ON public.pvp_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join queue" ON public.pvp_queue FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave queue" ON public.pvp_queue FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- PvP matches
CREATE TABLE public.pvp_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id uuid NOT NULL,
  player2_id uuid NOT NULL,
  player1_score integer NOT NULL DEFAULT 0,
  player2_score integer NOT NULL DEFAULT 0,
  player1_time_ms integer NOT NULL DEFAULT 0,
  player2_time_ms integer NOT NULL DEFAULT 0,
  winner_id uuid,
  player1_rating_change integer NOT NULL DEFAULT 0,
  player2_rating_change integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  questions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.pvp_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own matches" ON public.pvp_matches FOR SELECT TO authenticated USING (auth.uid() = player1_id OR auth.uid() = player2_id);
CREATE POLICY "Users can insert matches" ON public.pvp_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = player1_id);
CREATE POLICY "Users can update own matches" ON public.pvp_matches FOR UPDATE TO authenticated USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- PvP invites
CREATE TABLE public.pvp_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  match_id uuid REFERENCES public.pvp_matches(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pvp_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invites" ON public.pvp_invites FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send invites" ON public.pvp_invites FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update received invites" ON public.pvp_invites FOR UPDATE TO authenticated USING (auth.uid() = receiver_id);
CREATE POLICY "Users can delete own invites" ON public.pvp_invites FOR DELETE TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable realtime for queue and invites
ALTER PUBLICATION supabase_realtime ADD TABLE public.pvp_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pvp_invites;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pvp_matches;
