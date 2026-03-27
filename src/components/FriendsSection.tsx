import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Search, Check, X, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { characters } from "@/data/characters";
import { toast } from "sonner";

type FriendProfile = {
  user_id: string;
  display_name: string;
  selected_character: string | null;
  current_streak: number;
  coins: number;
};

type Friendship = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
};

const FriendsSection = () => {
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendProfiles, setFriendProfiles] = useState<FriendProfile[]>([]);
  const [pendingReceived, setPendingReceived] = useState<(Friendship & { profile: FriendProfile })[]>([]);
  const [searching, setSearching] = useState(false);

  const loadFriendships = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("friendships")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!data) return;
    setFriendships(data as any);

    // Get accepted friends
    const accepted = (data as any[]).filter((f) => f.status === "accepted");
    const friendIds = accepted.map((f) =>
      f.sender_id === user.id ? f.receiver_id : f.sender_id
    );

    if (friendIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, selected_character, current_streak, coins")
        .in("user_id", friendIds);
      if (profiles) setFriendProfiles(profiles as any);
    } else {
      setFriendProfiles([]);
    }

    // Get pending received
    const pending = (data as any[]).filter(
      (f) => f.status === "pending" && f.receiver_id === user.id
    );
    if (pending.length > 0) {
      const senderIds = pending.map((f) => f.sender_id);
      const { data: senderProfiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, selected_character, current_streak, coins")
        .in("user_id", senderIds);

      setPendingReceived(
        pending.map((f) => ({
          ...f,
          profile: (senderProfiles || []).find((p: any) => p.user_id === f.sender_id) || {
            user_id: f.sender_id,
            display_name: "Hráč",
            selected_character: null,
            current_streak: 0,
            coins: 0,
          },
        })) as any
      );
    } else {
      setPendingReceived([]);
    }
  };

  useEffect(() => {
    loadFriendships();
  }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;
    setSearching(true);

    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name, selected_character, current_streak, coins")
      .ilike("display_name", `%${searchQuery}%`)
      .neq("user_id", user.id)
      .limit(10);

    setSearchResults((data as any) || []);
    setSearching(false);
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!user) return;

    const { error } = await supabase.from("friendships").insert({
      sender_id: user.id,
      receiver_id: receiverId,
      status: "pending",
    } as any);

    if (error) {
      if (error.code === "23505") {
        toast.error("Žiadosť už bola odoslaná");
      } else {
        toast.error("Chyba pri odoslaní žiadosti");
      }
      return;
    }

    toast.success("Žiadosť o priateľstvo odoslaná! 🤝");
    await loadFriendships();
  };

  const respondToRequest = async (friendshipId: string, accept: boolean) => {
    if (accept) {
      await supabase
        .from("friendships")
        .update({ status: "accepted" } as any)
        .eq("id", friendshipId);
      toast.success("Priateľstvo prijaté! 🎉");
    } else {
      await supabase.from("friendships").delete().eq("id", friendshipId);
      toast("Žiadosť odmietnutá");
    }
    await loadFriendships();
  };

  const removeFriend = async (friendshipId: string) => {
    await supabase.from("friendships").delete().eq("id", friendshipId);
    toast("Priateľ odstránený");
    await loadFriendships();
  };

  const getFriendshipStatus = (userId: string) => {
    const f = friendships.find(
      (f) =>
        (f.sender_id === user?.id && f.receiver_id === userId) ||
        (f.receiver_id === user?.id && f.sender_id === userId)
    );
    return f?.status || null;
  };

  const getFriendshipId = (userId: string) => {
    return friendships.find(
      (f) =>
        (f.sender_id === user?.id && f.receiver_id === userId) ||
        (f.receiver_id === user?.id && f.sender_id === userId)
    )?.id;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-extrabold text-foreground">Priatelia</h3>
          {friendProfiles.length > 0 && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
              {friendProfiles.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-1.5 rounded-xl bg-accent/10 px-3 py-2 text-xs font-bold text-accent hover:bg-accent/20 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Pridať
        </button>
      </div>

      {/* Pending requests */}
      {pendingReceived.length > 0 && (
        <div className="mb-3 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Žiadosti o priateľstvo</p>
          {pendingReceived.map((req) => {
            const char = characters.find((c) => c.id === req.profile.selected_character);
            return (
              <div key={req.id} className="flex items-center gap-3 rounded-2xl bg-secondary/10 border border-secondary/20 p-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {char ? (
                    <img src={char.image} alt={char.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl">🎓</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{req.profile.display_name}</p>
                  <p className="text-xs text-muted-foreground">Chce byť tvoj priateľ</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => respondToRequest(req.id, true)}
                    className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Check className="h-4 w-4 text-primary" />
                  </button>
                  <button onClick={() => respondToRequest(req.id, false)}
                    className="h-8 w-8 rounded-xl bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-3 rounded-2xl bg-card p-4 shadow-card overflow-hidden">
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Hľadaj podľa mena..."
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button onClick={handleSearch}
                className="rounded-xl gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                Hľadaj
              </button>
            </div>

            {searching && <p className="text-sm text-muted-foreground text-center py-2">Hľadám...</p>}

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchResults.map((result) => {
                  const status = getFriendshipStatus(result.user_id);
                  const char = characters.find((c) => c.id === result.selected_character);
                  return (
                    <div key={result.user_id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                      <div className="h-9 w-9 rounded-lg bg-accent/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {char ? (
                          <img src={char.image} alt={char.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg">🎓</span>
                        )}
                      </div>
                      <p className="flex-1 text-sm font-bold text-foreground truncate">{result.display_name}</p>
                      {status === "accepted" ? (
                        <span className="text-xs font-bold text-primary">Priatelia ✓</span>
                      ) : status === "pending" ? (
                        <span className="text-xs font-bold text-secondary">Čaká sa...</span>
                      ) : (
                        <button onClick={() => sendFriendRequest(result.user_id)}
                          className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/20 transition-colors">
                          + Pridať
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!searching && searchResults.length === 0 && searchQuery && (
              <p className="text-sm text-muted-foreground text-center py-2">Žiadne výsledky</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Friends list */}
      {friendProfiles.length > 0 ? (
        <div className="space-y-2">
          {friendProfiles.map((friend) => {
            const char = characters.find((c) => c.id === friend.selected_character);
            const fId = getFriendshipId(friend.user_id);
            return (
              <div key={friend.user_id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
                <div className="h-10 w-10 rounded-xl bg-accent/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {char ? (
                    <img src={char.image} alt={char.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl">🎓</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{friend.display_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>🔥 {friend.current_streak} dní</span>
                    <span>🪙 {friend.coins}</span>
                  </div>
                </div>
                <button onClick={() => fId && removeFriend(fId)}
                  className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center hover:bg-destructive/10 transition-colors"
                  title="Odstrániť priateľa">
                  <UserMinus className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-6 text-center shadow-card">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-bold text-foreground">Zatiaľ žiadni priatelia</p>
          <p className="text-xs text-muted-foreground mt-1">Použi tlačidlo „Pridať" a nájdi kamarátov</p>
        </div>
      )}
    </motion.div>
  );
};

export default FriendsSection;
