import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Search, Check, X, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { characters } from "@/data/characters";
import CharacterAvatar from "@/components/CharacterAvatar";
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

type FriendCosmetic = {
  user_id: string;
  items: any[];
};

const FriendsSection = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendProfiles, setFriendProfiles] = useState<FriendProfile[]>([]);
  const [friendCosmetics, setFriendCosmetics] = useState<FriendCosmetic[]>([]);
  const [pendingReceived, setPendingReceived] = useState<(Friendship & { profile: FriendProfile })[]>([]);
  const [searching, setSearching] = useState(false);

  const loadFriendships = async () => {
    if (!user) return;
    const { data } = await supabase.from("friendships").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
    if (!data) return;
    setFriendships(data as any);
    const accepted = (data as any[]).filter((f) => f.status === "accepted");
    const friendIds = accepted.map((f) => f.sender_id === user.id ? f.receiver_id : f.sender_id);
    if (friendIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, selected_character, current_streak, coins").in("user_id", friendIds);
      if (profiles) setFriendProfiles(profiles as any);

      // Load friend cosmetics (equipped items)
      const { data: cosmeticsData } = await supabase
        .from("user_cosmetics")
        .select("user_id, item_id")
        .in("user_id", friendIds)
        .eq("equipped", true);
      
      if (cosmeticsData && cosmeticsData.length > 0) {
        const itemIds = [...new Set(cosmeticsData.map((c: any) => c.item_id))];
        const { data: items } = await supabase.from("cosmetic_items").select("*").in("id", itemIds);
        
        const grouped: FriendCosmetic[] = friendIds.map((fid) => {
          const equippedIds = cosmeticsData.filter((c: any) => c.user_id === fid).map((c: any) => c.item_id);
          return {
            user_id: fid,
            items: (items || []).filter((i: any) => equippedIds.includes(i.id)),
          };
        });
        setFriendCosmetics(grouped);
      }
    } else { setFriendProfiles([]); setFriendCosmetics([]); }
    const pending = (data as any[]).filter((f) => f.status === "pending" && f.receiver_id === user.id);
    if (pending.length > 0) {
      const senderIds = pending.map((f) => f.sender_id);
      const { data: senderProfiles } = await supabase.from("profiles").select("user_id, display_name, selected_character, current_streak, coins").in("user_id", senderIds);
      setPendingReceived(pending.map((f) => ({ ...f, profile: (senderProfiles || []).find((p: any) => p.user_id === f.sender_id) || { user_id: f.sender_id, display_name: t("profile.player"), selected_character: null, current_streak: 0, coins: 0 } })) as any);
    } else { setPendingReceived([]); }
  };

  useEffect(() => { loadFriendships(); }, [user]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;
    setSearching(true);
    const { data } = await supabase.from("profiles").select("user_id, display_name, selected_character, current_streak, coins").ilike("display_name", `%${searchQuery}%`).neq("user_id", user.id).limit(10);
    setSearchResults((data as any) || []);
    setSearching(false);
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!user) return;
    const { error } = await supabase.from("friendships").insert({ sender_id: user.id, receiver_id: receiverId, status: "pending" } as any);
    if (error) { toast.error(error.code === "23505" ? t("profile.requestAlreadySent") : t("profile.requestError")); return; }
    toast.success(t("profile.requestSent"));
    await loadFriendships();
  };

  const respondToRequest = async (friendshipId: string, accept: boolean) => {
    if (accept) {
      await supabase.from("friendships").update({ status: "accepted" } as any).eq("id", friendshipId);
      toast.success(t("profile.friendAccepted"));
    } else {
      await supabase.from("friendships").delete().eq("id", friendshipId);
      toast(t("profile.requestDeclined"));
    }
    await loadFriendships();
  };

  const removeFriend = async (friendshipId: string) => {
    await supabase.from("friendships").delete().eq("id", friendshipId);
    toast(t("profile.friendRemoved"));
    await loadFriendships();
  };

  const getFriendshipStatus = (userId: string) => {
    const f = friendships.find((f) => (f.sender_id === user?.id && f.receiver_id === userId) || (f.receiver_id === user?.id && f.sender_id === userId));
    return f?.status || null;
  };

  const getFriendshipId = (userId: string) => {
    return friendships.find((f) => (f.sender_id === user?.id && f.receiver_id === userId) || (f.receiver_id === user?.id && f.sender_id === userId))?.id;
  };

  const getFriendEquipped = (userId: string) => {
    return friendCosmetics.find((fc) => fc.user_id === userId)?.items || [];
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-extrabold text-foreground">{t("profile.friends")}</h3>
          {friendProfiles.length > 0 && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">{friendProfiles.length}</span>
          )}
        </div>
        <button onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-1.5 rounded-xl bg-accent/10 px-3 py-2 text-xs font-bold text-accent hover:bg-accent/20 transition-colors">
          <UserPlus className="h-4 w-4" />
          {t("profile.addFriend")}
        </button>
      </div>

      {pendingReceived.length > 0 && (
        <div className="mb-3 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("profile.friendRequests")}</p>
          {pendingReceived.map((req) => {
            const char = characters.find((c) => c.id === req.profile.selected_character);
            return (
              <div key={req.id} className="flex items-center gap-3 rounded-2xl bg-secondary/10 border border-secondary/20 p-3">
                <CharacterAvatar
                  characterId={char?.id}
                  characterImage={char?.image}
                  characterName={char?.name}
                  equippedItems={[]}
                  size="sm"
                  showEffects={false}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{req.profile.display_name}</p>
                  <p className="text-xs text-muted-foreground">{t("profile.wantsToBeFriend")}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => respondToRequest(req.id, true)} className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Check className="h-4 w-4 text-primary" />
                  </button>
                  <button onClick={() => respondToRequest(req.id, false)} className="h-8 w-8 rounded-xl bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-3 rounded-2xl bg-card p-4 shadow-card overflow-hidden">
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={t("profile.searchByName")}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
              </div>
              <button onClick={handleSearch} className="rounded-xl gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                {t("profile.search")}
              </button>
            </div>
            {searching && <p className="text-sm text-muted-foreground text-center py-2">{t("profile.searching")}</p>}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {searchResults.map((result) => {
                  const status = getFriendshipStatus(result.user_id);
                  const char = characters.find((c) => c.id === result.selected_character);
                  return (
                    <div key={result.user_id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                      <CharacterAvatar
                        characterId={char?.id}
                        characterImage={char?.image}
                        characterName={char?.name}
                        equippedItems={[]}
                        size="sm"
                        showEffects={false}
                      />
                      <p className="flex-1 text-sm font-bold text-foreground truncate">{result.display_name}</p>
                      {status === "accepted" ? (
                        <span className="text-xs font-bold text-primary">{t("profile.friendsAlready")}</span>
                      ) : status === "pending" ? (
                        <span className="text-xs font-bold text-secondary">{t("profile.pending")}</span>
                      ) : (
                        <button onClick={() => sendFriendRequest(result.user_id)}
                          className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/20 transition-colors">
                          {t("profile.addFriendBtn")}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {!searching && searchResults.length === 0 && searchQuery && (
              <p className="text-sm text-muted-foreground text-center py-2">{t("profile.noResults")}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {friendProfiles.length > 0 ? (
        <div className="space-y-2">
          {friendProfiles.map((friend) => {
            const char = characters.find((c) => c.id === friend.selected_character);
            const fId = getFriendshipId(friend.user_id);
            const equippedItems = getFriendEquipped(friend.user_id);
            return (
              <div key={friend.user_id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
                <div style={{ overflow: "visible" }}>
                  <CharacterAvatar
                    characterId={char?.id}
                    characterImage={char?.image}
                    characterName={char?.name}
                    equippedItems={equippedItems}
                    size="sm"
                    showEffects={false}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{friend.display_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>🔥 {friend.current_streak} {t("profile.days")}</span>
                    <span>🪙 {friend.coins}</span>
                  </div>
                </div>
                <button onClick={() => fId && removeFriend(fId)}
                  className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center hover:bg-destructive/10 transition-colors">
                  <UserMinus className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-6 text-center shadow-card">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-bold text-foreground">{t("profile.noFriends")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("profile.noFriendsHint")}</p>
        </div>
      )}
    </motion.div>
  );
};

export default FriendsSection;
