import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Flame, Zap, Trophy, Coins, Award, BookOpen, Target, ChevronRight, Check, ShoppingBag, Lock, Settings, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CharacterAvatar from "@/components/CharacterAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import BottomNav from "@/components/BottomNav";
import { characters, type Character } from "@/data/characters";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-new.png";
import { toast } from "sonner";
import FriendsSection from "@/components/FriendsSection";

const COSMETIC_CATEGORIES = [
  { id: "hat", labelKey: "profile.hats" },
  { id: "accessory", labelKey: "profile.accessories" },
  { id: "color", labelKey: "profile.effects" },
];

// Daily discount: 20% off 5 random items across ALL categories, seeded by today's date
function getDailyDiscountIds(items: any[]): string[] {
  const today = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash |= 0;
  }
  // Shuffle ALL items (not filtered by category)
  const shuffled = [...items].sort((a, b) => {
    const ha = ((hash * 31 + a.id.charCodeAt(0)) | 0) - ((hash * 31 + b.id.charCodeAt(0)) | 0);
    return ha;
  });
  return shuffled.slice(0, 5).map((i: any) => i.id);
}

const Profile = () => {
  const { user, profile, progress, totalXp, loading, signOut, addCoins, refreshProfile, currentLives } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [cosmeticItems, setCosmeticItems] = useState<any[]>([]);
  const [userCosmetics, setUserCosmetics] = useState<any[]>([]);
  const [shopCategory, setShopCategory] = useState("hat");
  const [effectScale, setEffectScale] = useState(1.6);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Študent";
  const coins = profile?.coins ?? 0;
  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;
  const level = Math.floor(totalXp / 500) + 1;
  const xpToNext = 500 - (totalXp % 500);
  const xpProgress = ((totalXp % 500) / 500) * 100;
  const completedLessons = progress.filter((p) => p.completed).length;
  const avgScore = progress.length > 0 ? Math.round(progress.reduce((s, p) => s + p.score, 0) / progress.length) : 0;

  useEffect(() => { setSelectedChar(profile?.selected_character ?? null); }, [profile]);

  useEffect(() => {
    supabase.from("badges").select("*").then(({ data }) => { if (data) setBadges(data); });
    if (user) {
      supabase.from("user_badges").select("badge_id").eq("user_id", user.id).then(({ data }) => { if (data) setUserBadges(data.map((b: any) => b.badge_id)); });
      supabase.from("cosmetic_items").select("*").then(({ data }) => { if (data) setCosmeticItems(data); });
      supabase.from("user_cosmetics").select("*").eq("user_id", user.id).then(({ data }) => { if (data) setUserCosmetics(data); });
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
    if (coins < item.price) { toast.error(t("profile.notEnoughFince")); return; }
    const newCoins = coins - item.price;
    await supabase.from("profiles").update({ coins: newCoins } as any).eq("user_id", user.id);
    await supabase.from("user_cosmetics").insert({ user_id: user.id, item_id: item.id } as any);
    setUserCosmetics((prev) => [...prev, { user_id: user.id, item_id: item.id, equipped: false }]);
    await refreshProfile();
    toast.success(`${item.icon} ${item.name} ${t("profile.purchased")}`);
  };

  const handleToggleEquip = async (itemId: string, currentlyEquipped: boolean) => {
    if (!user) return;
    const item = cosmeticItems.find((i: any) => i.id === itemId);
    if (!currentlyEquipped && item) {
      const sameCatItems = cosmeticItems.filter((i: any) => i.category === item.category).map((i: any) => i.id);
      for (const uc of userCosmetics) {
        if (sameCatItems.includes(uc.item_id) && uc.item_id !== itemId) {
          await supabase.from("user_cosmetics").update({ equipped: false } as any).eq("user_id", user.id).eq("item_id", uc.item_id);
        }
      }
    }
    await supabase.from("user_cosmetics").update({ equipped: !currentlyEquipped } as any).eq("user_id", user.id).eq("item_id", itemId);
    setUserCosmetics((prev) =>
      prev.map((uc) => {
        if (uc.item_id === itemId) return { ...uc, equipped: !currentlyEquipped };
        if (!currentlyEquipped && item && cosmeticItems.find((i: any) => i.id === uc.item_id)?.category === item.category) return { ...uc, equipped: false };
        return uc;
      })
    );
  };

  const activeCharacter = characters.find((c) => c.id === selectedChar);
  const equippedItems = userCosmetics.filter((uc) => uc.equipped);
  const equippedCosmeticItems = equippedItems.map((uc) => cosmeticItems.find((i: any) => i.id === uc.item_id)).filter(Boolean) as any[];

  // Compute daily discount IDs from ALL cosmetic items (not filtered by category)
  const discountIds = getDailyDiscountIds(cosmeticItems);

  if (loading) {
    return (<div className="min-h-screen gradient-hero flex items-center justify-center"><div className="animate-pulse text-primary font-bold text-xl">{t("common.loading")}</div></div>);
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="FinAp logo" className="h-8 w-8" />
            <h1 className="text-lg font-extrabold text-primary">FinAp</h1>
          </div>
          <button onClick={() => navigate("/settings")} className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors" title={t("settings.title")}>
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCharacterPicker(true)} className="relative hover:ring-2 ring-accent transition-all rounded-2xl" style={{ overflow: "visible" }}>
              <CharacterAvatar characterId={activeCharacter?.id} characterImage={activeCharacter?.image} characterName={activeCharacter?.name} equippedItems={equippedCosmeticItems} size="md" effectScale={effectScale} />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center z-30">
                <span className="text-[10px] text-primary-foreground font-bold">{level}</span>
              </div>
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">{displayName}</h2>
              {activeCharacter && <p className="text-sm text-muted-foreground">{activeCharacter.name}</p>}
              <div className="mt-2 w-40">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-xp">{t("common.level")} {level}</span>
                  <span className="text-muted-foreground">{xpToNext} {t("common.toNextLevel")}</span>
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
              <CharacterAvatar characterId={activeCharacter?.id} characterImage={activeCharacter?.image} characterName={activeCharacter?.name} equippedItems={equippedCosmeticItems} size="sm" showEffects={false} />
              <div><p className="text-sm font-bold text-foreground">{t("profile.changeName")}</p><p className="text-xs text-muted-foreground">{activeCharacter?.name || t("profile.chooseYourCharacter")}</p></div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button onClick={() => setShowShop(true)} className="w-full flex items-center justify-between rounded-2xl bg-card p-4 shadow-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3"><ShoppingBag className="h-6 w-6 text-secondary" /><div><p className="text-sm font-bold text-foreground">{t("profile.shop")}</p><p className="text-xs text-muted-foreground">{t("profile.unlockCosmetics")}</p></div></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 grid grid-cols-2 gap-3">
          {[
            { icon: Zap, label: t("profile.totalXp"), value: totalXp, color: "text-xp", bg: "bg-xp/10" },
            { icon: Flame, label: t("profile.currentStreak"), value: `${currentStreak} ${t("profile.days")}`, color: "text-streak", bg: "bg-streak/10" },
            { icon: Trophy, label: t("profile.longestStreak"), value: `${longestStreak} ${t("profile.days")}`, color: "text-level", bg: "bg-level/10" },
            { icon: Coins, label: t("profile.fince"), value: coins, color: "text-coin", bg: "bg-coin/10" },
            { icon: Heart, label: t("profile.lives"), value: `${currentLives}/6`, color: "text-destructive", bg: "bg-destructive/10" },
            { icon: BookOpen, label: t("profile.completedLessons"), value: completedLessons, color: "text-primary", bg: "bg-primary/10" },
            { icon: Target, label: t("profile.avgScore"), value: `${avgScore}%`, color: "text-accent", bg: "bg-accent/10" },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl bg-card p-4 shadow-card">
              <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}><stat.icon className={`h-5 w-5 ${stat.color}`} /></div>
              <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        <FriendsSection />

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 mb-4">
          <div className="flex items-center gap-2 mb-3"><Award className="h-5 w-5 text-secondary" /><h3 className="text-lg font-extrabold text-foreground">{t("profile.badges")}</h3></div>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => {
              const earned = userBadges.includes(badge.id);
              return (
                <div key={badge.id} className={`rounded-2xl p-4 transition-all ${earned ? "bg-card shadow-card" : "bg-muted/50 opacity-50"}`}>
                  <div className="flex items-center gap-2 mb-1"><span className="text-2xl">{badge.icon}</span>{earned && <Check className="h-4 w-4 text-primary" />}</div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setShowCharacterPicker(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg rounded-3xl bg-card p-6 max-h-[85vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-foreground">{t("profile.selectCharacter")}</h3>
                <button onClick={() => setShowCharacterPicker(false)} className="text-muted-foreground text-sm font-bold">{t("common.close")}</button>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("profile.financialPersonalities")}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {characters.filter((c) => c.category === "real").map((char) => (
                  <button key={char.id} onClick={() => handleSelectCharacter(char.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all ${selectedChar === char.id ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"}`}>
                    <img src={char.image} alt={char.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                    <p className="text-sm font-bold text-foreground">{char.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">{char.description}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("profile.marketSymbols")}</p>
              <div className="grid grid-cols-2 gap-3">
                {characters.filter((c) => c.category === "symbolic").map((char) => (
                  <button key={char.id} onClick={() => handleSelectCharacter(char.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all ${selectedChar === char.id ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"}`}>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setShowShop(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg rounded-3xl bg-card p-6 max-h-[85vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-foreground">{t("profile.shopTitle")}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1"><Coins className="h-4 w-4 text-coin" /><span className="text-sm font-bold text-coin">{coins}</span></div>
                  <button onClick={() => setShowShop(false)} className="text-muted-foreground text-sm font-bold">{t("common.close")}</button>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {COSMETIC_CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setShopCategory(cat.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${shopCategory === cat.id ? "gradient-primary text-primary-foreground" : "bg-muted/50 text-foreground"}`}>
                    {t(cat.labelKey)}
                  </button>
                ))}
              </div>
              {/* Daily discount banner */}
              <div className="rounded-xl bg-accent/10 border border-accent/20 p-3 mb-4">
                <p className="text-xs font-bold text-accent">🏷️ {t("profile.dailyDiscount")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3" style={{ overflow: "visible" }}>
                {cosmeticItems.filter((item: any) => item.category === shopCategory).map((item: any) => {
                  const owned = userCosmetics.some((uc) => uc.item_id === item.id);
                  const equipped = userCosmetics.some((uc) => uc.item_id === item.id && uc.equipped);
                  const hasDiscount = !owned && discountIds.includes(item.id);
                  const finalPrice = hasDiscount ? Math.round(item.price * 0.8) : item.price;
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className={`rounded-2xl transition-all relative ${equipped ? "bg-primary/10 ring-2 ring-primary shadow-lg" : owned ? "bg-card border border-border shadow-sm" : "bg-muted/40 border border-border/50"}`}
                      style={{ overflow: "visible" }}>
                      {equipped && (<div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow">✓ Active</div>)}
                      {owned && !equipped && (<div className="absolute -top-2 -right-2 z-10 bg-muted text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border shadow-sm">Owned</div>)}
                      {hasDiscount && !owned && (<div className="absolute -top-2 -left-2 z-10 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow">-20%</div>)}
                      <div className="p-4 pt-6" style={{ overflow: "visible" }}>
                        <div className="flex justify-center mb-3" style={{ overflow: "visible" }}>
                          {(item.category === "hat" || item.category === "color") ? (
                            <CharacterAvatar characterId={activeCharacter?.id} characterImage={activeCharacter?.image} characterName={activeCharacter?.name} equippedItems={[item]} size="lg" effectScale={item.category === "color" ? effectScale : undefined} />
                          ) : (
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-3xl shadow-inner">{item.icon}</div>
                          )}
                        </div>
                        <p className="text-sm font-bold text-foreground text-center">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground text-center mb-3 leading-relaxed">{item.description}</p>
                        {owned ? (
                          <button onClick={() => handleToggleEquip(item.id, equipped)}
                            className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all ${equipped ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-foreground hover:bg-accent/20"}`}>
                            {equipped ? "Unequip" : "Equip"}
                          </button>
                        ) : (
                          <button onClick={() => handleBuyCosmetic({ ...item, price: finalPrice })} disabled={coins < finalPrice}
                            className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${coins >= finalPrice ? "bg-gradient-to-r from-coin/20 to-coin/10 text-coin hover:from-coin/30 hover:to-coin/20 border border-coin/20" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
                            {coins < finalPrice && <Lock className="h-3 w-3" />}
                            <Coins className="h-3.5 w-3.5" />
                            {hasDiscount ? (
                              <span><span className="line-through text-muted-foreground mr-1">{item.price}</span>{finalPrice}</span>
                            ) : (
                              <span>{finalPrice}</span>
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
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
