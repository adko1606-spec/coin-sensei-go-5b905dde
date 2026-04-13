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
