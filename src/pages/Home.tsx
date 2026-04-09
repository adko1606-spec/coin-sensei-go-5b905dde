import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Target, Flame, Calendar, Heart, Clock, BookOpen, GraduationCap, TrendingUp, Trophy, User, Zap, Gift, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import StatsBar from "@/components/StatsBar";
import BottomNav from "@/components/BottomNav";
import CharacterAvatar from "@/components/CharacterAvatar";
import { ChallengeCard } from "@/components/ChallengeCard";
import MarketDrama from "@/components/MarketDrama";
import TapRace from "@/components/TapRace";
import { getTodaysTip } from "@/data/dailyTips";
import { getTodaysChallenges, getWeeksChallenges, getDailyResetTime, getWeeklyResetTime, type DailyChallenge, type WeeklyChallenge } from "@/data/dailyChallenges";
import logo from "@/assets/logo-new.png";
import mascot from "@/assets/mascot.png";
import { characters } from "@/data/characters";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formatCountdown = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
};

// Player identity based on behavior
const getPlayerIdentity = (profile: any, progress: any[], totalXp: number) => {
  const completedLessons = progress.filter((p) => p.completed).length;
  const streak = profile?.current_streak ?? 0;
  
  if (streak >= 14) return "hodler";
  if (completedLessons >= 15) return "diversifier";
  if (totalXp >= 3000) return "daytrader";
  if (completedLessons >= 5 && streak >= 3) return "cautious";
  return "risktaker";
};

// Random reward check (5% chance per day)
const checkDailyRandomReward = (): number | null => {
  const today = new Date().toDateString();
  const key = `finap-random-reward-${today}`;
  if (localStorage.getItem(key)) return null;
  
  if (Math.random() < 0.05) {
    const reward = [25, 50, 75, 100][Math.floor(Math.random() * 4)];
    localStorage.setItem(key, String(reward));
    return reward;
  }
  return null;
};

const Home = () => {
  const navigate = useNavigate();
  const { user, profile, progress, totalXp, loading, currentLives, nextLifeIn, refreshProfile, addCoins } = useAuth();
  const { t, language } = useI18n();
  const [tip, setTip] = useState(getTodaysTip(language));
  const [challenges, setChallenges] = useState<DailyChallenge[]>(getTodaysChallenges(language));
  const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallenge[]>(getWeeksChallenges(language));
  const [showTapRace, setShowTapRace] = useState(false);

  useEffect(() => {
    setTip(getTodaysTip(language));
    setChallenges(getTodaysChallenges(language));
    setWeeklyChallenges(getWeeksChallenges(language));
  }, [language]);

  const [dailyReset, setDailyReset] = useState("");
  const [weeklyReset, setWeeklyReset] = useState("");

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Študent";
  const level = Math.floor(totalXp / 500) + 1;
  const coins = (profile as any)?.coins ?? 0;
  const currentStreak = (profile as any)?.current_streak ?? 0;
  const selectedChar = characters.find((c) => c.id === (profile as any)?.selected_character);
  const [equippedCosmeticItems, setEquippedCosmeticItems] = useState<any[]>([]);

  const playerIdentity = useMemo(() => getPlayerIdentity(profile, progress, totalXp), [profile, progress, totalXp]);

  // Check for random reward on mount
  useEffect(() => {
    if (!user) return;
    const reward = checkDailyRandomReward();
    if (reward) {
      setTimeout(() => {
        toast.success(`${t("game.secretReward")} +${reward} Fince! 🪙`, { duration: 5000 });
        supabase.from("profiles").select("coins").eq("user_id", user.id).single().then(({ data }) => {
          if (data) {
            supabase.from("profiles").update({ coins: (data as any).coins + reward } as any).eq("user_id", user.id).then(() => refreshProfile());
          }
        });
      }, 2000);
    }
  }, [user]);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      setDailyReset(formatCountdown(getDailyResetTime().getTime() - now));
      setWeeklyReset(formatCountdown(getWeeklyResetTime().getTime() - now));
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!user) return;
    const loadEquipped = async () => {
      const { data: userCosmetics } = await supabase.from("user_cosmetics").select("item_id").eq("user_id", user.id).eq("equipped", true);
      if (userCosmetics && userCosmetics.length > 0) {
        const itemIds = userCosmetics.map((uc) => uc.item_id);
        const { data: items } = await supabase.from("cosmetic_items").select("*").in("id", itemIds);
        if (items) setEquippedCosmeticItems(items);
      }
    };
    loadEquipped();
  }, [user]);

  const todayStr = new Date().toDateString();
  const todayProgress = progress.filter((p) => p.completed_at && new Date(p.completed_at).toDateString() === todayStr);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
  const weekProgress = progress.filter((p) => p.completed_at && new Date(p.completed_at) >= monday);

  const calcStatus = (list: (DailyChallenge | WeeklyChallenge)[], relevantProgress: typeof progress) => {
    const completedLessons = relevantProgress.filter((p) => p.completed).length;
    const totalXpEarned = relevantProgress.reduce((s, p) => s + p.xp_earned, 0);
    const correctAnswers = relevantProgress.reduce((s, p) => Math.round(p.score / 100 * 12), 0);
    const perfectCount = relevantProgress.filter((p) => p.score === 100).length;

    return list.map((c) => {
      let current = 0;
      switch (c.type) {
        case "complete_lessons": current = completedLessons; break;
        case "earn_xp": current = totalXpEarned; break;
        case "correct_answers": current = correctAnswers; break;
        case "perfect_quiz": current = perfectCount; break;
      }
      return { id: c.id, current: Math.min(current, c.target), completed: current >= c.target };
    });
  };

  const challengeStatus = useMemo(() => calcStatus(challenges, todayProgress), [progress, challenges]);
  const weeklyStatus = useMemo(() => calcStatus(weeklyChallenges, weekProgress), [progress, weeklyChallenges]);

  // Challenge reward claiming
  useEffect(() => {
    if (!user) return;
    const todayKey = `finap-challenges-claimed-${new Date().toDateString()}`;
    const weekKey = `finap-weekly-claimed-${monday.toDateString()}`;
    const claimedDaily = JSON.parse(localStorage.getItem(todayKey) || "[]");
    const claimedWeekly = JSON.parse(localStorage.getItem(weekKey) || "[]");

    let totalCoinsReward = 0;
    let totalXpReward = 0;

    challengeStatus.forEach((s) => {
      if (s.completed && !claimedDaily.includes(s.id)) {
        const ch = challenges.find((c) => c.id === s.id);
        if (ch) { totalCoinsReward += ch.reward.coins; totalXpReward += ch.reward.xp; claimedDaily.push(s.id); }
      }
    });

    weeklyStatus.forEach((s) => {
      if (s.completed && !claimedWeekly.includes(s.id)) {
        const ch = weeklyChallenges.find((c) => c.id === s.id);
        if (ch) { totalCoinsReward += ch.reward.coins; totalXpReward += ch.reward.xp; claimedWeekly.push(s.id); }
      }
    });

    if (totalCoinsReward > 0 || totalXpReward > 0) {
      localStorage.setItem(todayKey, JSON.stringify(claimedDaily));
      localStorage.setItem(weekKey, JSON.stringify(claimedWeekly));
      addCoins(totalCoinsReward).then(() => refreshProfile());
      toast.success(`🏆 ${t("challenge.rewardClaimed")}: +${totalCoinsReward} Fince, +${totalXpReward} XP!`, { duration: 5000 });
    }
  }, [challengeStatus, weeklyStatus, user]);

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
            <img src={logo} alt="FinAp logo" className="h-8 w-8" />
            <h1 className="text-lg font-extrabold text-primary">FinAp</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 relative group">
              <Heart className="h-4 w-4 text-destructive fill-destructive" />
              <span className="text-sm font-bold text-destructive">{currentLives}</span>
              {currentLives < 6 && nextLifeIn && (
                <span className="text-[9px] text-destructive/70 ml-0.5">
                  {formatCountdown(nextLifeIn)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1">
              <span className="text-sm">🪙</span>
              <span className="text-sm font-bold text-coin">{coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-4">
          <div className="relative" style={{ overflow: "visible" }}>
            {selectedChar ? (
              <CharacterAvatar characterId={selectedChar.id} characterImage={selectedChar.image} characterName={selectedChar.name} equippedItems={equippedCosmeticItems} size="md" />
            ) : (
              <img src={mascot} alt="FinAp maskot" className="h-16 w-16" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">{t("home.hello")}, {displayName}! 👋</h2>
            <p className="text-muted-foreground">{t("home.subtitle")}</p>
            {/* Player identity badge */}
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5">
              <span className="text-[10px] font-bold text-accent">{t(`game.${playerIdentity}`)}</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-6">
          <StatsBar xp={totalXp} streak={currentStreak} level={level} />
        </div>

        {/* Streak warning */}
        {currentStreak > 0 && todayProgress.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-accent/10 border border-accent/20 p-3">
            <p className="text-xs font-bold text-accent">{t("game.streakWarning")}</p>
          </motion.div>
        )}

        {/* Main action buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 flex gap-2">
          <button
            onClick={() => navigate("/lessons")}
            className="flex-1 rounded-2xl gradient-primary p-4 shadow-button transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <BookOpen className="h-6 w-6 text-primary-foreground" />
            <span className="text-lg font-extrabold text-primary-foreground">{t("home.lessons")}</span>
          </button>
          <button
            onClick={() => setShowTapRace(true)}
            className="rounded-2xl bg-accent/10 border border-accent/20 p-4 transition-all hover:bg-accent/20 active:scale-[0.98] flex flex-col items-center justify-center gap-1"
          >
            <Zap className="h-5 w-5 text-accent" />
            <span className="text-[10px] font-bold text-accent">{t("game.quickBattle")}</span>
          </button>
          <button
            onClick={() => navigate("/pvp")}
            className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 transition-all hover:bg-destructive/20 active:scale-[0.98] flex flex-col items-center justify-center gap-1"
          >
            <Swords className="h-5 w-5 text-destructive" />
            <span className="text-[10px] font-bold text-destructive">PvP</span>
          </button>
        </motion.div>

        {/* Quick nav grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-4 grid grid-cols-4 gap-2">
          {[
            { path: "/study", icon: GraduationCap, label: t("home.studyMaterial"), color: "text-accent" },
            { path: "/invest", icon: TrendingUp, label: t("home.investments"), color: "text-primary" },
            { path: "/leaderboard", icon: Trophy, label: t("home.leaderboard"), color: "text-level" },
            { path: "/profile", icon: User, label: t("home.profile"), color: "text-secondary" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-3 shadow-card hover:bg-muted/50 transition-all active:scale-95"
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
              <span className="text-[11px] font-bold text-foreground">{item.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Market Drama - Top gainers/losers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }} className="mt-6">
          <MarketDrama />
        </motion.div>

        {/* Daily Tip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-6 rounded-2xl bg-accent/10 border border-accent/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/20">
              <Lightbulb className="h-4 w-4 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-accent">{t("home.dailyTip")}</h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{tip}</p>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-extrabold text-foreground">{t("home.dailyChallenges")}</h3>
            <div className="ml-auto flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{t("home.reset")}: {dailyReset}</span>
            </div>
          </div>
          <div className="space-y-3">
            {challenges.map((challenge, idx) => (
              <ChallengeCard key={challenge.id} challenge={challenge}
                status={challengeStatus.find((s) => s.id === challenge.id) ?? { current: 0, completed: false }} index={idx} />
            ))}
          </div>
        </motion.div>

        {/* Weekly Challenges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-extrabold text-foreground">{t("home.weeklyChallenges")}</h3>
            <div className="ml-auto flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{t("home.reset")}: {weeklyReset}</span>
            </div>
          </div>
          <div className="space-y-3">
            {weeklyChallenges.map((challenge, idx) => (
              <ChallengeCard key={challenge.id} challenge={challenge}
                status={weeklyStatus.find((s) => s.id === challenge.id) ?? { current: 0, completed: false }} index={idx} delayBase={0.5} />
            ))}
          </div>
        </motion.div>
      </main>

      {showTapRace && <TapRace onClose={() => setShowTapRace(false)} />}

      <BottomNav />
    </div>
  );
};

export default Home;
