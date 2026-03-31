
-- Add DELETE policies for tables that need it for reset functionality
CREATE POLICY "Users can delete own progress" ON public.user_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.investment_transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own badges" ON public.user_badges FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cosmetics" ON public.user_cosmetics FOR DELETE TO authenticated USING (auth.uid() = user_id);
