import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Target, Coins, Flame, Calendar, Heart, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import StatsBar from "@/components/StatsBar";
import BottomNav from "@/components/BottomNav";
import CharacterAvatar from "@/components/CharacterAvatar";
import { ChallengeCard } from "@/components/ChallengeCard";
import { getTodaysTip } from "@/data/dailyTips";
import { getTodaysChallenges, getWeeksChallenges, getDailyResetTime, getWeeklyResetTime, type DailyChallenge, type WeeklyChallenge } from "@/data/dailyChallenges";
import logo from "@/assets/logo-new.png";
import mascot from "@/assets/mascot.png";
import { characters } from "@/data/characters";
import { supabase } from "@/integrations/supabase/client";

const formatCountdown = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
};

const Home = () => {
  const { user, profile, progress, totalXp, loading, currentLives, nextLifeIn } = useAuth();
  const [tip] = useState(getTodaysTip());
  const [challenges] = useState<DailyChallenge[]>(getTodaysChallenges());
  const [weeklyChallenges] = useState<WeeklyChallenge[]>(getWeeksChallenges());
  const [dailyReset, setDailyReset] = useState("");
  const [weeklyReset, setWeeklyReset] = useState("");

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Študent";
  const level = Math.floor(totalXp / 500) + 1;
  const coins = (profile as any)?.coins ?? 0;
  const currentStreak = (profile as any)?.current_streak ?? 0;
  const selectedChar = characters.find((c) => c.id === (profile as any)?.selected_character);
  const [equippedCosmeticItems, setEquippedCosmeticItems] = useState<any[]>([]);

  // Update reset timers
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

  // Filter progress by today for daily challenges
  const todayStr = new Date().toDateString();
  const todayProgress = progress.filter((p) => p.completed_at && new Date(p.completed_at).toDateString() === todayStr);

  // Filter progress by current week (Monday-Sunday) for weekly
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
          <div className="flex items-center gap-2">
            {/* Lives */}
            <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1">
              <Heart className="h-4 w-4 text-destructive fill-destructive" />
              <span className="text-sm font-bold text-destructive">{currentLives}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1">
              <Coins className="h-4 w-4 text-coin" />
              <span className="text-sm font-bold text-coin">{coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        {/* Lives regeneration */}
        {currentLives < 6 && nextLifeIn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 flex items-center gap-2 rounded-xl bg-destructive/5 border border-destructive/20 px-3 py-2 text-sm">
            <Clock className="h-4 w-4 text-destructive" />
            <span className="text-muted-foreground">Ďalší život za <strong className="text-foreground">{formatCountdown(nextLifeIn)}</strong></span>
          </motion.div>
        )}

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
            <h2 className="text-2xl font-extrabold text-foreground">Ahoj, {displayName}! 👋</h2>
            <p className="text-muted-foreground">Nauč sa ovládať svoje financie</p>
          </div>
        </motion.div>

        <div className="mt-6">
          <StatsBar xp={totalXp} streak={currentStreak} level={level} />
        </div>

        {/* Daily Tip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mt-6 rounded-2xl bg-accent/10 border border-accent/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/20">
              <Lightbulb className="h-4 w-4 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-accent">Tip dňa</h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{tip}</p>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-extrabold text-foreground">Denné výzvy</h3>
            <div className="ml-auto flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Reset: {dailyReset}</span>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-extrabold text-foreground">Týždenné výzvy</h3>
            <div className="ml-auto flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Reset: {weeklyReset}</span>
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

      <BottomNav />
    </div>
  );
};

export default Home;
