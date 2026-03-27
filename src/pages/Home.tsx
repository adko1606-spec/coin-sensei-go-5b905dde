import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Target, Coins, Flame, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import StatsBar from "@/components/StatsBar";
import BottomNav from "@/components/BottomNav";
import { getTodaysTip } from "@/data/dailyTips";
import { getTodaysChallenges, type DailyChallenge } from "@/data/dailyChallenges";
import logo from "@/assets/logo.png";
import mascot from "@/assets/mascot.png";
import { characters } from "@/data/characters";

const Home = () => {
  const { user, profile, progress, totalXp, loading } = useAuth();
  const [tip] = useState(getTodaysTip());
  const [challenges] = useState<DailyChallenge[]>(getTodaysChallenges());

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Študent";
  const level = Math.floor(totalXp / 50) + 1;
  const coins = (profile as any)?.coins ?? 0;
  const currentStreak = (profile as any)?.current_streak ?? 0;
  const selectedChar = characters.find((c) => c.id === (profile as any)?.selected_character);

  // Calculate challenge completion
  const challengeStatus = useMemo(() => {
    const completedLessons = progress.filter((p) => p.completed).length;
    const totalXpEarned = progress.reduce((s, p) => s + p.xp_earned, 0);
    const correctAnswers = progress.reduce((s, p) => Math.round(p.score / 100 * 12), 0); // approximate
    const hasPerfect = progress.some((p) => p.score === 100);

    return challenges.map((c) => {
      let current = 0;
      let completed = false;
      switch (c.type) {
        case "complete_lessons":
          current = completedLessons;
          completed = completedLessons >= c.target;
          break;
        case "earn_xp":
          current = totalXpEarned;
          completed = totalXpEarned >= c.target;
          break;
        case "correct_answers":
          current = correctAnswers;
          completed = correctAnswers >= c.target;
          break;
        case "perfect_quiz":
          current = hasPerfect ? 1 : 0;
          completed = hasPerfect;
          break;
      }
      return { id: c.id, current: Math.min(current, c.target), completed };
    });
  }, [progress, challenges]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">Načítavam...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FinAp logo" className="h-20 w-20" />
            <h1 className="text-2xl font-extrabold text-primary">FinAp</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1">
              <Coins className="h-4 w-4 text-coin" />
              <span className="text-sm font-bold text-coin">{coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center gap-4"
        >
          <div className="relative">
          {selectedChar ? (
              <img src={selectedChar.image} alt={selectedChar.name} className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <img src={mascot} alt="FinAp maskot" className="h-16 w-16" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Ahoj, {displayName}! 👋</h2>
            <p className="text-muted-foreground">Nauč sa ovládať svoje financie</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-6">
          <StatsBar xp={totalXp} streak={currentStreak} level={level} />
        </div>

        {/* Daily Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 rounded-2xl bg-accent/10 border border-accent/20 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/20">
              <Lightbulb className="h-4 w-4 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-accent">Tip dňa</h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{tip}</p>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-extrabold text-foreground">Denné výzvy</h3>
            <div className="ml-auto flex items-center gap-1 text-xs font-bold text-streak">
              <Flame className="h-4 w-4" />
              <span>{currentStreak} dní</span>
            </div>
          </div>

          <div className="space-y-3">
            {challenges.map((challenge, idx) => {
              const status = challengeStatus.find((s) => s.id === challenge.id);
              const isCompleted = status?.completed ?? false;
              const current = status?.current ?? 0;

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className={`flex items-center gap-3 rounded-2xl p-4 shadow-card transition-all ${
                    isCompleted ? "bg-primary/10 border-2 border-primary" : "bg-card"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                    isCompleted ? "bg-primary/20" : "bg-primary/10"
                  }`}>
                    {isCompleted ? <Check className="h-6 w-6 text-primary" /> : challenge.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isCompleted ? "text-primary line-through" : "text-foreground"}`}>
                      {challenge.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                    {/* Progress bar */}
                    {!isCompleted && (
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.min((current / challenge.target) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                    {!isCompleted && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">{current}/{challenge.target}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    {isCompleted ? (
                      <span className="text-xs font-bold text-primary">Splnené ✓</span>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-xp">+{challenge.reward.xp} XP</span>
                        <span className="text-xs font-bold text-coin">+{challenge.reward.coins} 🪙</span>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;