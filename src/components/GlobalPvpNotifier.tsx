import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const GlobalPvpNotifier = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('global-pvp-notify-' + user.id)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'pvp_invites',
        filter: `receiver_id=eq.${user.id}`,
      }, async (payload: any) => {
        const invite = payload.new;
        if (invite.status === 'pending') {
          const { data: senderProfile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("user_id", invite.sender_id)
            .single();
          const name = senderProfile?.display_name || "Hráč";
          toast(`⚔️ ${name} ťa pozýva na PvP súboj!`, {
            duration: 8000,
            action: {
              label: "Otvoriť PvP",
              onClick: () => navigate("/pvp"),
            },
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  return null;
};

export default GlobalPvpNotifier;
