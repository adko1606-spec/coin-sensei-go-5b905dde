import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, Flame, BookOpen, Crown, Medal, Globe, Users, X, Shield, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { characters } from "@/data/characters";
import { ESTATE_IMAGES } from "@/data/estateAssets";
import logo from "@/assets/logo-new.png";

type LeaderboardEntry = {
  user_id: string;
  display_name: string;
  selected_character: string | null;
  coins: number;
  current_streak: number;
  total_xp: number;
  completed_lessons: number;
  rating: number;
  rank: string;
};

const RANKS = [
  { name: "Bronze", icon: "🥉", color: "text-amber-600" },
  { name: "Silver", icon: "🥈", color: "text-gray-400" },
  { name: "Gold", icon: "🥇", color: "text-yellow-400" },
  { name: "Elite", icon: "💎", color: "text-purple-400" },
];

const getRankInfo = (name: string) => RANKS.find(r => r.name === name) || RANKS[0];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-secondary" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-accent" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
};

// Player Profile Modal with estate & investment info
const PlayerProfileModal = ({ player, onClose, t }: { player: LeaderboardEntry; onClose: () => void; t: (k: string) => string }) => {
  const [livePlayer, setLivePlayer] = useState<LeaderboardEntry>(player);
  const char = characters.find((c) => c.id === livePlayer.selected_character);
  const rankInfo = getRankInfo(livePlayer.rank);
  const [equippedItems, setEquippedItems] = useState<any[]>([]);
  const [investPerf, setInvestPerf] = useState<{ total_invested: number; current_value: number; count: number; profitable: number } | null>(null);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingLive(true);
      const [profileRes, progressRes, ratingRes, ucsRes, invsRes] = await Promise.all([
        supabase.from("profiles").select("display_name, selected_character, coins, current_streak").eq("user_id", player.user_id).maybeSingle(),
        supabase.from("user_progress").select("xp_earned, completed").eq("user_id", player.user_id).eq("completed", true),
        supabase.from("player_ratings").select("rating, rank").eq("user_id", player.user_id).maybeSingle(),
        supabase.from("user_cosmetics").select("item_id").eq("user_id", player.user_id).eq("equipped", true),
        supabase.from("user_investments").select("invested_coins, current_value").eq("user_id", player.user_id).eq("is_active", true),
      ]);
      if (cancelled) return;

      // Live profile fields
      const p = profileRes.data;
      const totalXp = (progressRes.data || []).reduce((s: number, r: any) => s + Number(r.xp_earned || 0), 0);
      const completedLessons = (progressRes.data || []).length;
      setLivePlayer({
        ...player,
        display_name: p?.display_name ?? player.display_name,
        selected_character: p?.selected_character ?? player.selected_character,
        coins: p?.coins ?? player.coins,
        current_streak: p?.current_streak ?? player.current_streak,
        total_xp: totalXp,
        completed_lessons: completedLessons,
        rating: ratingRes.data?.rating ?? player.rating,
        rank: ratingRes.data?.rank ?? player.rank,
      });

      // Cosmetics
      if (ucsRes.data && ucsRes.data.length > 0) {
        const ids = ucsRes.data.map((u: any) => u.item_id);
        const { data: items } = await supabase.from("cosmetic_items").select("*").in("id", ids);
        if (!cancelled && items) setEquippedItems(items);
      } else {
        setEquippedItems([]);
      }

      // Investments
      const invs = invsRes.data || [];
      if (invs.length > 0) {
        const total_invested = invs.reduce((s: number, i: any) => s + Number(i.invested_coins), 0);
        const current_value = invs.reduce((s: number, i: any) => s + Number(i.current_value), 0);
        const profitable = invs.filter((i: any) => Number(i.current_value) > Number(i.invested_coins)).length;
        setInvestPerf({ total_invested, current_value, count: invs.length, profitable });
      } else {
        setInvestPerf(null);
      }
      setLoadingLive(false);
    };
    load();
    return () => { cancelled = true; };
  }, [player.user_id]);

  const equippedHouse = equippedItems.find((i: any) => i.category === "house");
  const equippedCar = equippedItems.find((i: any) => i.category === "car");
  const otherCosmetics = equippedItems.filter((i: any) => i.category !== "house" && i.category !== "car");
  const profitLoss = investPerf ? investPerf.current_value - investPerf.total_invested : 0;
  const profitPercent = investPerf && investPerf.total_invested > 0 ? Math.round((profitLoss / investPerf.total_invested) * 100) : 0;
  const winRate = investPerf && investPerf.count > 0 ? Math.round((investPerf.profitable / investPerf.count) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-foreground">{t("leaderboard.viewProfile")}</h3>
          <button onClick={onClose} className="text-muted-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex flex-col items-center gap-3">
          {char ? (
            <img src={char.image} alt={char.name} className="h-20 w-20 rounded-2xl object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-accent/10 flex items-center justify-center text-4xl">🎓</div>
          )}
          <h4 className="text-xl font-extrabold text-foreground">{livePlayer.display_name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-lg">{rankInfo.icon}</span>
            <span className={`text-sm font-bold ${rankInfo.color}`}>{livePlayer.rank}</span>
            <span className="text-sm text-muted-foreground">({livePlayer.rating})</span>
            {!loadingLive && <span className="ml-1 inline-flex items-center gap-1 text-[10px] font-bold text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />LIVE</span>}
          </div>
        </div>

        {/* Sekcia: Aktíva */}
        <div className="mt-5">
          <h5 className="text-xs font-extrabold text-foreground mb-2 uppercase tracking-wide">🏘️ Aktíva</h5>
          <div className="rounded-xl border border-border bg-muted/40 p-3">
            <div className="grid grid-cols-3 gap-2">
              {/* Dom */}
              <div className="rounded-lg bg-card/60 p-2 text-center">
                <div className="text-[10px] font-bold text-muted-foreground mb-1">🏠 Dom</div>
                {equippedHouse ? (
                  <>
                    {ESTATE_IMAGES[equippedHouse.id] ? (
                      <img src={ESTATE_IMAGES[equippedHouse.id]} alt={equippedHouse.name} className="h-12 w-12 object-contain mx-auto" />
                    ) : <span className="text-2xl">🏠</span>}
                    <p className="text-[9px] font-bold text-foreground mt-1 truncate">{equippedHouse.name}</p>
                  </>
                ) : (
                  <div className="h-12 flex items-center justify-center text-muted-foreground/50 text-2xl">—</div>
                )}
              </div>
              {/* Auto */}
              <div className="rounded-lg bg-card/60 p-2 text-center">
                <div className="text-[10px] font-bold text-muted-foreground mb-1">🚗 Auto</div>
                {equippedCar ? (
                  <>
                    {ESTATE_IMAGES[equippedCar.id] ? (
                      <img src={ESTATE_IMAGES[equippedCar.id]} alt={equippedCar.name} className="h-12 w-12 object-contain mx-auto" />
                    ) : <span className="text-2xl">🚗</span>}
                    <p className="text-[9px] font-bold text-foreground mt-1 truncate">{equippedCar.name}</p>
                  </>
                ) : (
                  <div className="h-12 flex items-center justify-center text-muted-foreground/50 text-2xl">—</div>
                )}
              </div>
              {/* Kozmetika */}
              <div className="rounded-lg bg-card/60 p-2 text-center">
                <div className="text-[10px] font-bold text-muted-foreground mb-1">🎨 Kozmetika</div>
                {otherCosmetics.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    {otherCosmetics.slice(0, 3).map((c: any) => (
                      <span key={c.id} className="text-xl" title={c.name}>{c.preview_emoji || c.icon || "🎨"}</span>
                    ))}
                  </div>
                ) : (
                  <div className="h-12 flex items-center justify-center text-muted-foreground/50 text-2xl">—</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sekcia: Výkonnosť investícií */}
        <div className="mt-4">
          <h5 className="text-xs font-extrabold text-foreground mb-2 uppercase tracking-wide">💰 Výkonnosť investícií</h5>
          {investPerf ? (
            <div className={`rounded-xl p-3 border ${profitLoss >= 0 ? "bg-primary/10 border-primary/30" : "bg-destructive/10 border-destructive/30"}`}>
              <div className="flex items-center gap-2 mb-1">
                {profitLoss >= 0 ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                <p className="text-xs font-bold text-foreground">Celkový zisk/strata</p>
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${profitLoss >= 0 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>
                  {profitLoss >= 0 ? "🟢 V zisku" : "🔴 V strate"}
                </span>
              </div>
              <p className={`text-xl font-extrabold ${profitLoss >= 0 ? "text-primary" : "text-destructive"}`}>
                {profitLoss >= 0 ? "+" : ""}{Math.round(profitLoss)} F ({profitPercent >= 0 ? "+" : ""}{profitPercent}%)
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-card/60 p-1.5">
                  <p className="text-[9px] text-muted-foreground">Obchody</p>
                  <p className="text-sm font-extrabold text-foreground">{investPerf.count}</p>
                </div>
                <div className="rounded-lg bg-card/60 p-1.5">
                  <p className="text-[9px] text-muted-foreground">Úspešnosť</p>
                  <p className="text-sm font-extrabold text-foreground">{winRate}%</p>
                </div>
                <div className="rounded-lg bg-card/60 p-1.5">
                  <p className="text-[9px] text-muted-foreground">Vložené</p>
                  <p className="text-sm font-extrabold text-foreground">{investPerf.total_invested}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">Hráč zatiaľ nemá žiadne aktívne investície</p>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-xp/10 p-3 text-center">
            <Zap className="h-4 w-4 text-xp mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{t("profile.totalXp")}</p>
            <p className="text-lg font-bold text-foreground">{livePlayer.total_xp}</p>
          </div>
          <div className="rounded-xl bg-streak/10 p-3 text-center">
            <Flame className="h-4 w-4 text-streak mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{t("profile.currentStreak")}</p>
            <p className="text-lg font-bold text-foreground">{livePlayer.current_streak} {t("profile.days")}</p>
          </div>
          <div className="rounded-xl bg-primary/10 p-3 text-center">
            <BookOpen className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{t("profile.completedLessons")}</p>
            <p className="text-lg font-bold text-foreground">{livePlayer.completed_lessons}</p>
          </div>
          <div className="rounded-xl bg-coin/10 p-3 text-center">
            <span className="text-sm">🪙</span>
            <p className="text-xs text-muted-foreground">{t("profile.fince")}</p>
            <p className="text-lg font-bold text-foreground">{livePlayer.coins}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Leaderboard = () => {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [metricTab, setMetricTab] = useState("xp");
  const [scope, setScope] = useState<"global" | "friends">("global");
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);

  const METRIC_TABS = [
    { id: "xp", label: t("leaderboard.xp"), icon: Zap, color: "text-xp" },
    { id: "streak", label: t("leaderboard.streak"), icon: Flame, color: "text-streak" },
    { id: "rank", label: "Rank", icon: Shield, color: "text-purple-400" },
    { id: "lessons", label: t("leaderboard.lessons"), icon: BookOpen, color: "text-primary" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const [profilesRes, progressRes, friendshipsRes, ratingsRes] = await Promise.all([
        supabase.from("profiles").select("user_id, display_name, selected_character, coins, current_streak"),
        supabase.from("user_progress").select("user_id, xp_earned, completed"),
        user
          ? supabase.from("friendships").select("sender_id, receiver_id").eq("status", "accepted").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          : Promise.resolve({ data: [] }),
        supabase.from("player_ratings").select("user_id, rating, rank"),
      ]);

      const fIds = new Set<string>();
      if (user) {
        fIds.add(user.id);
        ((friendshipsRes.data as any[]) || []).forEach((f) => {
          fIds.add(f.sender_id === user.id ? f.receiver_id : f.sender_id);
        });
      }
      setFriendIds(fIds);

      const progressMap = new Map<string, { total_xp: number; completed_lessons: number }>();
      ((progressRes.data as any[]) || []).forEach((p) => {
        const existing = progressMap.get(p.user_id) || { total_xp: 0, completed_lessons: 0 };
        existing.total_xp += p.xp_earned;
        if (p.completed) existing.completed_lessons += 1;
        progressMap.set(p.user_id, existing);
      });

      const ratingsMap = new Map<string, { rating: number; rank: string }>();
      ((ratingsRes.data as any[]) || []).forEach((r) => {
        ratingsMap.set(r.user_id, { rating: r.rating, rank: r.rank });
      });

      const combined: LeaderboardEntry[] = ((profilesRes.data as any[]) || []).map((p) => ({
        user_id: p.user_id,
        display_name: p.display_name || "Hráč",
        selected_character: p.selected_character,
        coins: p.coins,
        current_streak: p.current_streak,
        total_xp: progressMap.get(p.user_id)?.total_xp ?? 0,
        completed_lessons: progressMap.get(p.user_id)?.completed_lessons ?? 0,
        rating: ratingsMap.get(p.user_id)?.rating ?? 0,
        rank: ratingsMap.get(p.user_id)?.rank ?? "Bronze",
      }));

      setAllEntries(combined);
      setLoadingData(false);
    };

    fetchData();
  }, [user]);

  const filtered = scope === "friends" ? allEntries.filter((e) => friendIds.has(e.user_id)) : allEntries;

  const sorted = [...filtered].sort((a, b) => {
    if (metricTab === "xp") return b.total_xp - a.total_xp;
    if (metricTab === "streak") return b.current_streak - a.current_streak;
    if (metricTab === "rank") return b.rating - a.rating;
    return b.completed_lessons - a.completed_lessons;
  });

  const getValue = (entry: LeaderboardEntry) => {
    if (metricTab === "xp") return `${entry.total_xp} XP`;
    if (metricTab === "streak") return `${entry.current_streak} ${t("leaderboard.daysUnit")}`;
    if (metricTab === "rank") return `${entry.rating}`;
    return `${entry.completed_lessons} ${t("leaderboard.lessonsUnit")}`;
  };

  const myRank = sorted.findIndex((e) => e.user_id === user?.id) + 1;

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="FinLit logo" className="h-8 w-8" />
            <h1 className="text-lg font-extrabold text-primary">FinLit</h1>
          </div>
          <Trophy className="h-6 w-6 text-secondary" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 mb-4">
          <h2 className="text-2xl font-extrabold text-foreground">{t("leaderboard.title")} 🏆</h2>
          <p className="text-sm text-muted-foreground">{t("leaderboard.subtitle")}</p>
        </motion.div>

        {/* Scope toggle */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => setScope("global")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all ${scope === "global" ? "gradient-blue text-primary-foreground shadow-button" : "bg-card text-foreground shadow-card"}`}>
            <Globe className={`h-4 w-4 ${scope === "global" ? "text-primary-foreground" : "text-accent"}`} />
            {t("leaderboard.global")}
          </button>
          <button onClick={() => setScope("friends")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all ${scope === "friends" ? "gradient-blue text-primary-foreground shadow-button" : "bg-card text-foreground shadow-card"}`}>
            <Users className={`h-4 w-4 ${scope === "friends" ? "text-primary-foreground" : "text-accent"}`} />
            {t("leaderboard.friends")}
          </button>
        </div>

        {/* Metric tabs */}
        <div className="flex gap-2 mb-4">
          {METRIC_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setMetricTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 rounded-2xl py-2.5 text-xs font-bold transition-all ${metricTab === tab.id ? "gradient-primary text-primary-foreground shadow-button" : "bg-card text-foreground shadow-card"}`}>
              <tab.icon className={`h-3.5 w-3.5 ${metricTab === tab.id ? "text-primary-foreground" : tab.color}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* My rank card */}
        {myRank > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-2xl gradient-blue p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">{t("leaderboard.yourPosition")}</p>
                <p className="text-3xl font-extrabold">#{myRank}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">{t("leaderboard.score")}</p>
                <p className="text-xl font-bold">{getValue(sorted[myRank - 1])}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard list */}
        {loadingData ? (
          <div className="text-center py-8 text-muted-foreground">{t("leaderboard.loading")}</div>
        ) : (
          <div className="space-y-2">
            {sorted.map((entry, idx) => {
              const rank = idx + 1;
              const isMe = entry.user_id === user?.id;
              const char = characters.find((c) => c.id === entry.selected_character);
              const rankInfo = getRankInfo(entry.rank);

              return (
                <motion.div key={entry.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                  className={`flex items-center gap-3 rounded-2xl p-3 transition-all cursor-pointer hover:shadow-md ${isMe ? "bg-primary/10 ring-2 ring-primary" : "bg-card shadow-card"} ${rank <= 3 ? "shadow-float" : ""}`}
                  onClick={() => !isMe && setSelectedPlayer(entry)}>
                  <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(rank)}</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 overflow-hidden shrink-0">
                    {char ? <img src={char.image} alt={char.name} className="h-full w-full object-cover" /> : <span className="text-xl">🎓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                      {entry.display_name} {isMe && t("leaderboard.you")}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{rankInfo.icon}</span>
                      <span className={`text-[10px] font-bold ${rankInfo.color}`}>{entry.rank}</span>
                      <span className="text-[10px] text-muted-foreground">({entry.rating})</span>
                    </div>
                  </div>
                  <p className={`text-sm font-extrabold ${rank <= 3 ? "text-secondary" : "text-foreground"}`}>{getValue(entry)}</p>
                </motion.div>
              );
            })}

            {sorted.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {scope === "friends" ? t("leaderboard.noFriends") : t("leaderboard.noPlayers")}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Player profile modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerProfileModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} t={t} />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;
