-- Allow sender to also delete invites (for cancellation)
CREATE POLICY "Sender can delete own invites"
ON public.pvp_invites
FOR DELETE
TO authenticated
USING (auth.uid() = sender_id);

-- Allow player1 to delete pending matches (for cancellation)
CREATE POLICY "Player can delete pending matches"
ON public.pvp_matches
FOR DELETE
TO authenticated
USING (auth.uid() = player1_id AND status = 'pending');
