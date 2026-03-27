import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Flame, Zap, Trophy, Coins, Award, BookOpen, Target, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import { characters, type Character } from "@/data/characters";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Profile = () => {
  const { user, profile, progress, totalXp, loading, signOut } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Študent";
  const coins = (profile as any)?.coins ?? 0;
  const currentStreak = (profile as any)?.current_streak ?? 0;
  const longestStreak = (profile as any)?.longest_streak ?? 0;
  const level = Math.floor(totalXp / 50) + 1;
  const xpToNext = 50 - (totalXp % 50);
  const xpProgress = ((totalXp % 50) / 50) * 100;
  const completedLessons = progress.filter((p) => p.completed).length;
  const avgScore = progress.length > 0
    ? Math.round(progress.reduce((s, p) => s + p.score, 0) / progress.length)
    : 0;

  useEffect(() => {
    setSelectedChar((profile as any)?.selected_character ?? null);
  }, [profile]);

  useEffect(() => {
    // Load badges
    supabase.from("badges").select("*").then(({ data }) => {
      if (data) setBadges(data);
    });
    if (user) {
      supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (data) setUserBadges(data.map((b: any) => b.badge_id));
        });
    }
  }, [user]);

  const handleSelectCharacter = async (charId: string) => {
    if (!user) return;
    setSelectedChar(charId);
    await supabase
      .from("profiles")
      .update({ selected_character: charId } as any)
      .eq("user_id", user.id);
    setShowCharacterPicker(false);
  };

  const activeCharacter = characters.find((c) => c.id === selectedChar);

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
          <button
            onClick={signOut}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
            title="Odhlásiť sa"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCharacterPicker(true)}
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20 text-4xl hover:ring-2 ring-accent transition-all"
            >
              {activeCharacter ? activeCharacter.emoji : "🎓"}
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-[10px] text-primary-foreground font-bold">{level}</span>
              </div>
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-foreground">{displayName}</h2>
              {activeCharacter && (
                <p className="text-sm text-muted-foreground">{activeCharacter.name}</p>
              )}
              {/* XP progress bar */}
              <div className="mt-2 w-40">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-xp">Level {level}</span>
                  <span className="text-muted-foreground">{xpToNext} XP do ďalšieho</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    className="h-full rounded-full bg-xp"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 grid grid-cols-2 gap-3"
        >
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

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-secondary" />
            <h3 className="text-lg font-extrabold text-foreground">Odznaky</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => {
              const earned = userBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4 transition-all ${
                    earned
                      ? "bg-card shadow-card"
                      : "bg-muted/50 opacity-50"
                  }`}
                >
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

        {/* Character select */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 mb-4"
        >
          <button
            onClick={() => setShowCharacterPicker(true)}
            className="w-full flex items-center justify-between rounded-2xl bg-card p-4 shadow-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeCharacter?.emoji || "🎓"}</span>
              <div>
                <p className="text-sm font-bold text-foreground">Zmeniť postavu</p>
                <p className="text-xs text-muted-foreground">
                  {activeCharacter?.name || "Vyber si svoju postavu"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </motion.div>
      </main>

      {/* Character picker modal */}
      <AnimatePresence>
        {showCharacterPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowCharacterPicker(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-lg rounded-t-3xl bg-card p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-foreground">Vyber si postavu</h3>
                <button
                  onClick={() => setShowCharacterPicker(false)}
                  className="text-muted-foreground text-sm font-bold"
                >
                  Zavrieť
                </button>
              </div>

              {/* Real characters */}
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Finančné osobnosti
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {characters.filter((c) => c.category === "real").map((char) => (
                  <button
                    key={char.id}
                    onClick={() => handleSelectCharacter(char.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all ${
                      selectedChar === char.id
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <span className="text-4xl">{char.emoji}</span>
                    <p className="text-sm font-bold text-foreground">{char.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">{char.description}</p>
                  </button>
                ))}
              </div>

              {/* Symbolic characters */}
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Trhové symboly
              </p>
              <div className="grid grid-cols-2 gap-3">
                {characters.filter((c) => c.category === "symbolic").map((char) => (
                  <button
                    key={char.id}
                    onClick={() => handleSelectCharacter(char.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all ${
                      selectedChar === char.id
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <span className="text-4xl">{char.emoji}</span>
                    <p className="text-sm font-bold text-foreground">{char.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">{char.description}</p>
                  </button>
                ))}
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
