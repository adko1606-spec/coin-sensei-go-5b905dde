import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Flame, Zap, Trophy, Coins, Award, BookOpen, Target, ChevronRight, Check, ShoppingBag, Lock } from "lucide-react";
import CharacterAvatar from "@/components/CharacterAvatar";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import { characters, type Character } from "@/data/characters";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import FriendsSection from "@/components/FriendsSection";

const COSMETIC_CATEGORIES = [
  { id: "hat", label: "🎩 Klobúky" },
  { id: "glasses", label: "👓 Okuliare" },
  { id: "accessory", label: "💼 Doplnky" },
  { id: "color", label: "🎨 Efekty" },
];

const Profile = () => {
  const { user, profile, progress, totalXp, loading, signOut, addCoins, refreshProfile } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [cosmeticItems, setCosmeticItems] = useState<any[]>([]);
  const [userCosmetics, setUserCosmetics] = useState<any[]>([]);
  const [shopCategory, setShopCategory] = useState("hat");

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Študent";
  const coins = profile?.coins ?? 0;
  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;
  const level = Math.floor(totalXp / 50) + 1;
  const xpToNext = 50 - (totalXp % 50);
  const xpProgress = ((totalXp % 50) / 50) * 100;
  const completedLessons = progress.filter((p) => p.completed).length;
  const avgScore = progress.length > 0
    ? Math.round(progress.reduce((s, p) => s + p.score, 0) / progress.length)
    : 0;

  useEffect(() => {
    setSelectedChar(profile?.selected_character ?? null);
  }, [profile]);

  useEffect(() => {
    supabase.from("badges").select("*").then(({ data }) => {
      if (data) setBadges(data);
    });
    if (user) {
      supabase.from("user_badges").select("badge_id").eq("user_id", user.id)
        .then(({ data }) => { if (data) setUserBadges(data.map((b: any) => b.badge_id)); });

      // Load cosmetics
      supabase.from("cosmetic_items").select("*").then(({ data }) => {
        if (data) setCosmeticItems(data);
      });
      supabase.from("user_cosmetics").select("*").eq("user_id", user.id)
        .then(({ data }) => { if (data) setUserCosmetics(data); });
    }
  }, [user]);

  const handleSelectCharacter = async (charId: string) => {
    if (!user) return;
    setSelectedChar(charId);
    await supabase.from("profiles").update({ selected_character: charId } as any).eq("user_id", user.id);
    await refreshProfile();
    setShowCharacterPicker(false);
  };

  const handleBuyCosmetic = async (item: any) => {
    if (!user || !profile) return;
    if (coins < item.price) {
      toast.error("Nemáš dosť mincí!");
      return;
    }
    // Deduct coins
    const newCoins = coins - item.price;
    await supabase.from("profiles").update({ coins: newCoins } as any).eq("user_id", user.id);
    // Add cosmetic
    await supabase.from("user_cosmetics").insert({ user_id: user.id, item_id: item.id } as any);
    setUserCosmetics((prev) => [...prev, { user_id: user.id, item_id: item.id, equipped: false }]);
    await refreshProfile();
    toast.success(`${item.icon} ${item.name} zakúpené!`);
  };

  const handleToggleEquip = async (itemId: string, currentlyEquipped: boolean) => {
    if (!user) return;
    const item = cosmeticItems.find((i: any) => i.id === itemId);
    // Unequip others in same category
    if (!currentlyEquipped && item) {
      const sameCatItems = cosmeticItems.filter((i: any) => i.category === item.category).map((i: any) => i.id);
      for (const uc of userCosmetics) {
        if (sameCatItems.includes(uc.item_id) && uc.item_id !== itemId) {
          await supabase.from("user_cosmetics").update({ equipped: false } as any)
            .eq("user_id", user.id).eq("item_id", uc.item_id);
        }
      }
    }
    await supabase.from("user_cosmetics").update({ equipped: !currentlyEquipped } as any)
      .eq("user_id", user.id).eq("item_id", itemId);
    setUserCosmetics((prev) =>
      prev.map((uc) => {
        if (uc.item_id === itemId) return { ...uc, equipped: !currentlyEquipped };
        if (!currentlyEquipped && item && cosmeticItems.find((i: any) => i.id === uc.item_id)?.category === item.category) {
          return { ...uc, equipped: false };
        }
        return uc;
      })
    );
  };

  const activeCharacter = characters.find((c) => c.id === selectedChar);
  const equippedItems = userCosmetics.filter((uc) => uc.equipped);
  const equippedCosmeticItems = equippedItems
    .map((uc) => cosmeticItems.find((i: any) => i.id === uc.item_id))
    .filter(Boolean) as any[];
  const equippedIcons = equippedItems.map((uc) => cosmeticItems.find((i: any) => i.id === uc.item_id)?.icon).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">Načítavam...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FinAp logo" className="h-20 w-20" />
            <h1 className="text-2xl font-extrabold text-primary">FinAp</h1>
          </div>
          <button onClick={signOut} className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors" title="Odhlásiť sa">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCharacterPicker(true)}
              className="relative hover:ring-2 ring-accent transition-all rounded-2xl" style={{ overflow: "visible" }}>
              <CharacterAvatar
                characterId={activeCharacter?.id}
                characterImage={activeCharacter?.image}
                characterName={activeCharacter?.name}
                equippedItems={equippedCosmeticItems}
                size="md"
              />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center z-30">
                <span className="text-[10px] text-primary-foreground font-bold">{level}</span>
              </div>
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">{displayName}</h2>
              {activeCharacter && <p className="text-sm text-muted-foreground">{activeCharacter.name}</p>}
              <div className="mt-2 w-40">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-xp">Level {level}</span>
                  <span className="text-muted-foreground">{xpToNext} XP do ďalšieho</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} className="h-full rounded-full bg-xp" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Character + Shop buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 space-y-3">
          <button onClick={() => setShowCharacterPicker(true)}
            className="w-full flex items-center justify-between rounded-2xl bg-card p-4 shadow-card hover:bg-muted/50 transition-colors" style={{ overflow: "visible" }}>
            <div className="flex items-center gap-3">
              <CharacterAvatar
                characterId={activeCharacter?.id}
                characterImage={activeCharacter?.image}
                characterName={activeCharacter?.name}
                equippedItems={equippedCosmeticItems}
                size="sm"
                showEffects={false}
              />
              <div>
                <p className="text-sm font-bold text-foreground">Zmeniť postavu</p>
                <p className="text-xs text-muted-foreground">{activeCharacter?.name || "Vyber si svoju postavu"}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button onClick={() => setShowShop(true)}
            className="w-full flex items-center justify-between rounded-2xl bg-card p-4 shadow-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-secondary" />
              <div>
                <p className="text-sm font-bold text-foreground">Obchod s doplnkami</p>
                <p className="text-xs text-muted-foreground">Odomkni kozmetické prvky za mince</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 grid grid-cols-2 gap-3">
          {[
            { icon: Zap, label: "Celkové XP", value: totalXp, color: "text-xp", bg: "bg-xp/10" },
            { icon: Flame, label: "Aktuálna séria", value: `${currentStreak} dní`, color: "text-streak", bg: "bg-streak/10" },
            { icon: Trophy, label: "Najdlhšia séria", value: `${longestStreak} dní`, color: "text-level", bg: "bg-level/10" },
            { icon: Coins, label: "Mince", value: coins, color: "text-coin", bg: "bg-coin/10" },
            { icon: BookOpen, label: "Dokončené lekcie", value: completedLessons, color: "text-primary", bg: "bg-primary/10" },
            { icon: Target, label: "Priemerné skóre", value: `${avgScore}%`, color: "text-accent", bg: "bg-accent/10" },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl bg-card p-4 shadow-card">
              <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Friends */}
        <FriendsSection />

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-secondary" />
            <h3 className="text-lg font-extrabold text-foreground">Odznaky</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => {
              const earned = userBadges.includes(badge.id);
              return (
                <div key={badge.id} className={`rounded-2xl p-4 transition-all ${earned ? "bg-card shadow-card" : "bg-muted/50 opacity-50"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{badge.icon}</span>
                    {earned && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-sm font-bold text-foreground">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* Character picker modal */}
      <AnimatePresence>
        {showCharacterPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
            onClick={() => setShowCharacterPicker(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg rounded-3xl bg-card p-6 max-h-[85vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-foreground">Vyber si postavu</h3>
                <button onClick={() => setShowCharacterPicker(false)} className="text-muted-foreground text-sm font-bold">Zavrieť</button>
              </div>

              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Finančné osobnosti</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {characters.filter((c) => c.category === "real").map((char) => (
                  <button key={char.id} onClick={() => handleSelectCharacter(char.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all ${
                      selectedChar === char.id ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"
                    }`}>
                    <img src={char.image} alt={char.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                    <p className="text-sm font-bold text-foreground">{char.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">{char.description}</p>
                  </button>
                ))}
              </div>

              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Trhové symboly</p>
              <div className="grid grid-cols-2 gap-3">
                {characters.filter((c) => c.category === "symbolic").map((char) => (
                  <button key={char.id} onClick={() => handleSelectCharacter(char.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all ${
                      selectedChar === char.id ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"
                    }`}>
                    <img src={char.image} alt={char.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                    <p className="text-sm font-bold text-foreground">{char.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">{char.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shop modal */}
      <AnimatePresence>
        {showShop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
            onClick={() => setShowShop(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg rounded-3xl bg-card p-6 max-h-[85vh] overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-foreground">Obchod</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1">
                    <Coins className="h-4 w-4 text-coin" />
                    <span className="text-sm font-bold text-coin">{coins}</span>
                  </div>
                  <button onClick={() => setShowShop(false)} className="text-muted-foreground text-sm font-bold">Zavrieť</button>
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {COSMETIC_CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setShopCategory(cat.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                      shopCategory === cat.id ? "gradient-primary text-primary-foreground" : "bg-muted/50 text-foreground"
                    }`}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Items */}
              <div className="grid grid-cols-2 gap-3" style={{ overflow: "visible" }}>
                {cosmeticItems.filter((item: any) => item.category === shopCategory).map((item: any) => {
                  const owned = userCosmetics.some((uc) => uc.item_id === item.id);
                  const equipped = userCosmetics.some((uc) => uc.item_id === item.id && uc.equipped);
                    return (
                    <div key={item.id} className={`rounded-2xl p-4 pt-8 transition-all ${equipped ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50"}`} style={{ overflow: "visible" }}>
                      <div className="flex justify-center mb-2" style={{ overflow: "visible" }}>
                        {(item.category === "hat" || item.category === "glasses" || item.category === "color") ? (
                          <CharacterAvatar
                            characterId={activeCharacter?.id}
                            characterImage={activeCharacter?.image}
                            characterName={activeCharacter?.name}
                            equippedItems={[item]}
                            size="lg"
                          />
                        ) : (
                          <div className="text-center text-4xl">{item.icon}</div>
                        )}
                      </div>
                      <p className="text-sm font-bold text-foreground text-center">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground text-center mb-2">{item.description}</p>
                      {owned ? (
                        <button onClick={() => handleToggleEquip(item.id, equipped)}
                          className={`w-full rounded-xl py-2 text-xs font-bold transition-all ${
                            equipped ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent/20"
                          }`}>
                          {equipped ? "✓ Nasadené" : "Nasadiť"}
                        </button>
                      ) : (
                        <button onClick={() => handleBuyCosmetic(item)}
                          disabled={coins < item.price}
                          className={`w-full rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            coins >= item.price ? "bg-coin/20 text-coin hover:bg-coin/30" : "bg-muted text-muted-foreground cursor-not-allowed"
                          }`}>
                          {coins < item.price && <Lock className="h-3 w-3" />}
                          <Coins className="h-3 w-3" />
                          {item.price}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Profile;
