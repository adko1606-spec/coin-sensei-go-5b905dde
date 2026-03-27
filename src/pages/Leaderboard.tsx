import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Zap, Flame, BookOpen, Crown, Medal } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { characters } from "@/data/characters";
import logo from "@/assets/logo.png";

type LeaderboardEntry = {
  user_id: string;
  display_name: string;
  selected_character: string | null;
  coins: number;
  current_streak: number;
  total_xp: number;
  completed_lessons: number;
};

const TABS = [
  { id: "xp", label: "XP", icon: Zap, color: "text-xp" },
  { id: "streak", label: "Séria", icon: Flame, color: "text-streak" },
  { id: "lessons", label: "Lekcie", icon: BookOpen, color: "text-primary" },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
};

const Leaderboard = () => {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("xp");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingData(true);

      // Get all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, selected_character, coins, current_streak");

      if (!profiles) { setLoadingData(false); return; }

      // Get all progress
      const { data: allProgress } = await supabase
        .from("user_progress")
        .select("user_id, xp_earned, completed");

      const progressMap = new Map<string, { total_xp: number; completed_lessons: number }>();
      (allProgress || []).forEach((p: any) => {
        const existing = progressMap.get(p.user_id) || { total_xp: 0, completed_lessons: 0 };
        existing.total_xp += p.xp_earned;
        if (p.completed) existing.completed_lessons += 1;
        progressMap.set(p.user_id, existing);
      });

      const combined: LeaderboardEntry[] = profiles.map((p: any) => ({
        user_id: p.user_id,
        display_name: p.display_name || "Hráč",
        selected_character: p.selected_character,
        coins: p.coins,
        current_streak: p.current_streak,
        total_xp: progressMap.get(p.user_id)?.total_xp ?? 0,
        completed_lessons: progressMap.get(p.user_id)?.completed_lessons ?? 0,
      }));

      setEntries(combined);
      setLoadingData(false);
    };

    fetchLeaderboard();
  }, []);

  const sorted = [...entries].sort((a, b) => {
    if (tab === "xp") return b.total_xp - a.total_xp;
    if (tab === "streak") return b.current_streak - a.current_streak;
    return b.completed_lessons - a.completed_lessons;
  });

  const getValue = (entry: LeaderboardEntry) => {
    if (tab === "xp") return `${entry.total_xp} XP`;
    if (tab === "streak") return `${entry.current_streak} dní`;
    return `${entry.completed_lessons} lekcií`;
  };

  const myRank = sorted.findIndex((e) => e.user_id === user?.id) + 1;

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
          <Trophy className="h-6 w-6 text-secondary" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 mb-4">
          <h2 className="text-2xl font-extrabold text-foreground">Rebríček 🏆</h2>
          <p className="text-sm text-muted-foreground">Súťaž s ostatnými hráčmi</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition-all ${
                tab === t.id ? "gradient-primary text-primary-foreground shadow-button" : "bg-card text-foreground shadow-card"
              }`}
            >
              <t.icon className={`h-4 w-4 ${tab === t.id ? "text-primary-foreground" : t.color}`} />
              {t.label}
            </button>
          ))}
        </div>

        {/* My rank card */}
        {myRank > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-2xl gradient-blue p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Tvoja pozícia</p>
                <p className="text-3xl font-extrabold">#{myRank}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Skóre</p>
                <p className="text-xl font-bold">{getValue(sorted[myRank - 1])}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard list */}
        {loadingData ? (
          <div className="text-center py-8 text-muted-foreground">Načítavam rebríček...</div>
        ) : (
          <div className="space-y-2">
            {sorted.map((entry, idx) => {
              const rank = idx + 1;
              const isMe = entry.user_id === user?.id;
              const char = characters.find((c) => c.id === entry.selected_character);

              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex items-center gap-3 rounded-2xl p-3 transition-all ${
                    isMe ? "bg-primary/10 ring-2 ring-primary" : "bg-card shadow-card"
                  } ${rank <= 3 ? "shadow-float" : ""}`}
                >
                  <div className="flex h-8 w-8 items-center justify-center">
                    {getRankIcon(rank)}
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 overflow-hidden shrink-0">
                    {char ? (
                      <img src={char.image} alt={char.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl">🎓</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                      {entry.display_name} {isMe && "(ty)"}
                    </p>
                    <p className="text-xs text-muted-foreground">Level {Math.floor(entry.total_xp / 50) + 1}</p>
                  </div>

                  <p className={`text-sm font-extrabold ${rank <= 3 ? "text-secondary" : "text-foreground"}`}>
                    {getValue(entry)}
                  </p>
                </motion.div>
              );
            })}

            {sorted.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Zatiaľ žiadni hráči v rebríčku
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;
