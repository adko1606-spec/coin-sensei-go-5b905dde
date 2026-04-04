import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Target, Flame, Calendar, Heart, Clock, BookOpen, GraduationCap, TrendingUp, Trophy, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
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
  const navigate = useNavigate();
  const { user, profile, progress, totalXp, loading, currentLives, nextLifeIn } = useAuth();
  const { t, language } = useI18n();
  const [tip, setTip] = useState(getTodaysTip(language));
  const [challenges, setChallenges] = useState<DailyChallenge[]>(getTodaysChallenges(language));
  const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallenge[]>(getWeeksChallenges(language));

  // Update challenges/tips when language changes
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
          </div>
        </motion.div>

        <div className="mt-6">
          <StatsBar xp={totalXp} streak={currentStreak} level={level} />
        </div>

        {/* Main action - Lessons button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
          <button
            onClick={() => navigate("/lessons")}
            className="w-full rounded-2xl gradient-primary p-5 shadow-button transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <BookOpen className="h-7 w-7 text-primary-foreground" />
            <span className="text-xl font-extrabold text-primary-foreground">{t("home.lessons")}</span>
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

      <BottomNav />
    </div>
  );
};

export default Home;
