
-- Allow authenticated users to view all progress for leaderboard
CREATE POLICY "Authenticated users can view all progress for leaderboard"
  ON public.user_progress FOR SELECT TO authenticated
  USING (true);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
