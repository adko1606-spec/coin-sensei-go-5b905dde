import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Users, Zap, Trophy, ChevronLeft, Crown, Shield, Star, Timer, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/logo-new.png";
import { lessons } from "@/data/lessons";

// ═══ RANK SYSTEM ═══
const RANKS = [
  { name: "Bronze", min: 0, max: 999, icon: "🥉", color: "text-amber-600", bg: "bg-amber-600/10", dailyReward: 100 },
  { name: "Silver", min: 1000, max: 1999, icon: "🥈", color: "text-gray-400", bg: "bg-gray-400/10", dailyReward: 250 },
  { name: "Gold", min: 2000, max: 2999, icon: "🥇", color: "text-yellow-400", bg: "bg-yellow-400/10", dailyReward: 500 },
  { name: "Elite", min: 3000, max: 99999, icon: "💎", color: "text-purple-400", bg: "bg-purple-400/10", dailyReward: 1000 },
];

function getRank(rating: number) {
  return RANKS.find(r => rating >= r.min && rating <= r.max) || RANKS[0];
}

function getRankProgress(rating: number) {
  const rank = getRank(rating);
  if (rank.name === "Elite") return 100;
  const range = rank.max - rank.min + 1;
  return Math.min(100, ((rating - rank.min) / range) * 100);
}

function calcRatingChange(won: boolean, winStreak: number, allCorrect: boolean, fasterThanOpponent: boolean): number {
  if (won) {
    let base = 30;
    if (winStreak >= 4) base += 15;
    else if (winStreak >= 3) base += 10;
    else if (winStreak >= 2) base += 5;
    if (allCorrect) base += 10;
    if (fasterThanOpponent) base += 5;
    return base;
  } else {
    // Loss
    if (winStreak <= -3) return -10; // loss streak protection
    if (winStreak <= -2) return -15;
    return -20;
  }
}

// Rank protection: can't drop below rank - 100
function applyRankProtection(currentRating: number, change: number): number {
  const newRating = currentRating + change;
  if (change < 0) {
    for (const rank of RANKS) {
      if (currentRating >= rank.min && newRating < rank.min - 100) {
        return Math.max(rank.min - 100, 0);
      }
    }
  }
  return Math.max(0, newRating);
}

// Generate 5 random questions from lessons
function generateBattleQuestions() {
  const allQuestions = lessons.flatMap(l => l.questions.filter(q => q.type === "choice"));
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map(q => ({
    id: q.id,
    text: q.text,
    options: (q as any).options,
    correctIndex: (q as any).correctIndex,
    explanation: q.explanation,
  }));
}

type BattleQuestion = ReturnType<typeof generateBattleQuestions>[number];
type Screen = "lobby" | "queue" | "battle" | "result" | "rank";

const PvpBattle = () => {
  const navigate = useNavigate();
  const { user, profile, addCoins, refreshProfile } = useAuth();
  const { t } = useI18n();

  const [screen, setScreen] = useState<Screen>("lobby");
  const [playerRating, setPlayerRating] = useState<any>(null);
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [ratingChange, setRatingChange] = useState(0);
  const [won, setWon] = useState(false);
  const [queueTime, setQueueTime] = useState(0);
  const [friends, setFriends] = useState<any[]>([]);
  const timerRef = useRef<any>(null);
  const qStartRef = useRef(Date.now());

  // Load player rating
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("player_ratings").select("*").eq("user_id", user.id).single();
      if (data) {
        setPlayerRating(data);
      } else {
        // Create initial rating
        await supabase.from("player_ratings").insert({ user_id: user.id, rating: 0, rank: "Bronze" } as any);
        setPlayerRating({ user_id: user.id, rating: 0, rank: "Bronze", wins: 0, losses: 0, win_streak: 0, highest_rating: 0 });
      }
    };
    load();
  }, [user]);

  // Load friends for invite
  useEffect(() => {
    if (!user) return;
    const loadFriends = async () => {
      const { data: friendships } = await supabase.from("friendships").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).eq("status", "accepted");
      if (!friendships || friendships.length === 0) return;
      const friendIds = friendships.map(f => f.sender_id === user.id ? f.receiver_id : f.sender_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, selected_character").in("user_id", friendIds);
      if (profiles) setFriends(profiles);
    };
    loadFriends();
  }, [user]);

  // Quick match - simulate finding opponent (since real matchmaking needs server)
  const startQuickMatch = () => {
    setScreen("queue");
    setQueueTime(0);
    const interval = setInterval(() => setQueueTime(t => t + 1), 1000);
    // Simulate finding match after 2-4 seconds
    const delay = 2000 + Math.random() * 2000;
    setTimeout(() => {
      clearInterval(interval);
      startBattle();
    }, delay);
  };

  const inviteFriend = (friendId: string) => {
    toast.success(t("pvp.inviteSent"));
    // Simulate friend accepting after delay
    setTimeout(() => startBattle(), 1500);
  };

  const startBattle = () => {
    const qs = generateBattleQuestions();
    setQuestions(qs);
    setCurrentQ(0);
    setMyScore(0);
    setOpponentScore(0);
    setTotalTimeMs(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScreen("battle");
    setTimeLeft(10);
    qStartRef.current = Date.now();
  };

  // Timer per question
  useEffect(() => {
    if (screen !== "battle" || showExplanation) return;
    setTimeLeft(10);
    qStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(-1); // timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ, screen]);

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    clearInterval(timerRef.current);
    const elapsed = Date.now() - qStartRef.current;
    setTotalTimeMs(prev => prev + elapsed);
    setSelectedAnswer(idx);
    setShowExplanation(true);

    const correct = idx === questions[currentQ].correctIndex;
    if (correct) setMyScore(s => s + 1);

    // Simulate opponent (AI with ~60% accuracy)
    const opCorrect = Math.random() < 0.6;
    if (opCorrect) setOpponentScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishBattle();
    }
  };

  const finishBattle = async () => {
    if (!user || !playerRating) return;
    const finalMyScore = myScore + (selectedAnswer === questions[currentQ]?.correctIndex ? 0 : 0); // already counted
    const finalOpScore = opponentScore;
    const didWin = finalMyScore > finalOpScore || (finalMyScore === finalOpScore && totalTimeMs < 30000);
    setWon(didWin);

    const streak = didWin ? Math.max(1, (playerRating.win_streak > 0 ? playerRating.win_streak + 1 : 1)) : Math.min(-1, (playerRating.win_streak < 0 ? playerRating.win_streak - 1 : -1));
    const allCorrect = myScore === questions.length;
    const change = calcRatingChange(didWin, streak, allCorrect, totalTimeMs < 25000);
    const newRating = applyRankProtection(playerRating.rating, change);
    setRatingChange(change);

    const newRank = getRank(newRating);
    const updates: any = {
      rating: newRating,
      rank: newRank.name,
      wins: playerRating.wins + (didWin ? 1 : 0),
      losses: playerRating.losses + (didWin ? 0 : 1),
      win_streak: streak,
      highest_rating: Math.max(playerRating.highest_rating, newRating),
    };

    await supabase.from("player_ratings").update(updates).eq("user_id", user.id);
    setPlayerRating({ ...playerRating, ...updates });

    // Award coins for win
    if (didWin) {
      await addCoins(50);
      toast.success(`🏆 +50 Fince!`);
    }

    setScreen("result");
  };

  const rank = playerRating ? getRank(playerRating.rating) : RANKS[0];
  const rankProgress = playerRating ? getRankProgress(playerRating.rating) : 0;

  if (!user || !playerRating) {
    return <div className="min-h-screen gradient-hero flex items-center justify-center"><div className="animate-pulse text-primary font-bold">{t("common.loading")}</div></div>;
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-2 text-muted-foreground hover:bg-muted"><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="FinAp" className="h-7 w-7" />
            <h1 className="text-lg font-extrabold text-primary">{t("pvp.title")}</h1>
          </div>
          <div className="w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 mt-4">
        <AnimatePresence mode="wait">
          {/* ═══ LOBBY ═══ */}
          {screen === "lobby" && (
            <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Rank card */}
              <div className={`rounded-2xl ${rank.bg} border border-border p-5 mb-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{rank.icon}</span>
                  <div>
                    <h2 className={`text-xl font-extrabold ${rank.color}`}>{rank.name}</h2>
                    <p className="text-sm text-muted-foreground">{playerRating.rating} {t("pvp.rating")}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-muted-foreground">{t("pvp.wins")}: {playerRating.wins}</p>
                    <p className="text-xs text-muted-foreground">{t("pvp.losses")}: {playerRating.losses}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${rankProgress}%` }}
                    className={`h-full rounded-full ${rank.name === "Bronze" ? "bg-amber-500" : rank.name === "Silver" ? "bg-gray-400" : rank.name === "Gold" ? "bg-yellow-400" : "bg-purple-500"}`}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>{rank.min}</span>
                  <span>{rank.name === "Elite" ? "∞" : rank.max + 1}</span>
                </div>
              </div>

              {/* Season rewards preview */}
              <div className="rounded-2xl bg-card p-4 shadow-card mb-4">
                <h3 className="text-sm font-bold text-foreground mb-2">{t("pvp.dailyReward")}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🪙</span>
                  <span className="text-lg font-extrabold text-coin">+{rank.dailyReward} Fince</span>
                  <span className="text-xs text-muted-foreground ml-auto">{t("pvp.perDay")}</span>
                </div>
              </div>

              {/* Battle buttons */}
              <button onClick={startQuickMatch}
                className="w-full rounded-2xl gradient-primary p-4 shadow-button mb-3 flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all">
                <Zap className="h-6 w-6 text-primary-foreground" />
                <span className="text-lg font-extrabold text-primary-foreground">{t("pvp.quickMatch")}</span>
              </button>

              {/* Invite friends */}
              {friends.length > 0 && (
                <div className="rounded-2xl bg-card p-4 shadow-card">
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" /> {t("pvp.inviteFriend")}
                  </h3>
                  <div className="space-y-2">
                    {friends.slice(0, 5).map(f => (
                      <button key={f.user_id} onClick={() => inviteFriend(f.user_id)}
                        className="w-full flex items-center justify-between rounded-xl bg-muted/50 p-3 hover:bg-muted transition-colors">
                        <span className="text-sm font-bold text-foreground">{f.display_name || t("profile.player")}</span>
                        <Swords className="h-4 w-4 text-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-card p-3 text-center shadow-card">
                  <p className="text-xs text-muted-foreground">{t("pvp.winRate")}</p>
                  <p className="text-lg font-extrabold text-foreground">
                    {playerRating.wins + playerRating.losses > 0
                      ? Math.round((playerRating.wins / (playerRating.wins + playerRating.losses)) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="rounded-xl bg-card p-3 text-center shadow-card">
                  <p className="text-xs text-muted-foreground">{t("pvp.streak")}</p>
                  <p className="text-lg font-extrabold text-foreground">
                    {playerRating.win_streak > 0 ? `🔥 ${playerRating.win_streak}` : playerRating.win_streak < 0 ? `💀 ${Math.abs(playerRating.win_streak)}` : "0"}
                  </p>
                </div>
                <div className="rounded-xl bg-card p-3 text-center shadow-card">
                  <p className="text-xs text-muted-foreground">{t("pvp.best")}</p>
                  <p className="text-lg font-extrabold text-foreground">{playerRating.highest_rating}</p>
                </div>
              </div>

              {/* Rank ladder */}
              <div className="mt-4 rounded-2xl bg-card p-4 shadow-card">
                <h3 className="text-sm font-bold text-foreground mb-3">{t("pvp.rankLadder")}</h3>
                {RANKS.map(r => (
                  <div key={r.name} className={`flex items-center gap-3 py-2 ${r.name === rank.name ? "opacity-100" : "opacity-50"}`}>
                    <span className="text-xl">{r.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${r.name === rank.name ? r.color : "text-foreground"}`}>{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">{r.min} - {r.name === "Elite" ? "∞" : r.max}</p>
                    </div>
                    {r.name === rank.name && <Shield className={`h-4 w-4 ${r.color}`} />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ QUEUE ═══ */}
          {screen === "queue" && (
            <motion.div key="queue" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Swords className="h-16 w-16 text-primary" />
              </motion.div>
              <h2 className="mt-6 text-xl font-extrabold text-foreground">{t("pvp.searching")}</h2>
              <p className="text-muted-foreground mt-2">{queueTime}s</p>
              <p className="text-xs text-muted-foreground mt-1">{t("pvp.matchRange")}: ±{queueTime > 5 ? 400 : 200}</p>
              <button onClick={() => setScreen("lobby")} className="mt-6 rounded-xl bg-muted px-6 py-2 text-sm font-bold text-foreground">
                {t("common.close")}
              </button>
            </motion.div>
          )}

          {/* ═══ BATTLE ═══ */}
          {screen === "battle" && questions.length > 0 && (
            <motion.div key="battle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 rounded-xl bg-card p-3 shadow-card">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t("pvp.you")}</p>
                  <p className="text-2xl font-extrabold text-primary">{myScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{currentQ + 1}/{questions.length}</p>
                  <div className={`text-lg font-extrabold ${timeLeft <= 3 ? "text-destructive animate-pulse" : "text-foreground"}`}>
                    {timeLeft}s
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t("pvp.opponent")}</p>
                  <p className="text-2xl font-extrabold text-destructive">{opponentScore}</p>
                </div>
              </div>

              {/* Question */}
              <div className="rounded-2xl bg-card p-5 shadow-card mb-4">
                <p className="text-base font-bold text-foreground leading-relaxed">{questions[currentQ].text}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQ].options.map((opt: string, idx: number) => {
                  const isCorrect = idx === questions[currentQ].correctIndex;
                  const isSelected = selectedAnswer === idx;
                  let cls = "rounded-xl p-4 text-left font-bold transition-all border ";
                  if (showExplanation) {
                    if (isCorrect) cls += "bg-primary/10 border-primary text-primary";
                    else if (isSelected && !isCorrect) cls += "bg-destructive/10 border-destructive text-destructive";
                    else cls += "bg-muted/50 border-border text-muted-foreground";
                  } else {
                    cls += "bg-card border-border text-foreground hover:bg-muted/50 active:scale-[0.98]";
                  }
                  return (
                    <motion.button key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null} className={`w-full ${cls}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{opt}</span>
                        {showExplanation && isCorrect && <Check className="h-5 w-5 ml-auto text-primary" />}
                        {showExplanation && isSelected && !isCorrect && <X className="h-5 w-5 ml-auto text-destructive" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation + Next */}
              {showExplanation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <div className="rounded-xl bg-accent/10 border border-accent/20 p-3 mb-3">
                    <p className="text-xs text-foreground">{questions[currentQ].explanation}</p>
                  </div>
                  <button onClick={nextQuestion}
                    className="w-full rounded-xl gradient-primary py-3 text-center font-bold text-primary-foreground">
                    {currentQ < questions.length - 1 ? t("lessons.nextQuestion") : t("lessons.finish")}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══ RESULT ═══ */}
          {screen === "result" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                {won ? <Crown className="h-20 w-20 text-yellow-400" /> : <Shield className="h-20 w-20 text-muted-foreground" />}
              </motion.div>
              <h2 className={`mt-4 text-2xl font-extrabold ${won ? "text-primary" : "text-destructive"}`}>
                {won ? t("pvp.victory") : t("pvp.defeat")}
              </h2>
              <p className="text-muted-foreground mt-1">{myScore}/{questions.length} {t("pvp.correct")}</p>

              {/* Rating change animation */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className={`mt-6 rounded-2xl p-4 ${won ? "bg-primary/10" : "bg-destructive/10"} flex items-center gap-3`}>
                <span className="text-3xl">{rank.icon}</span>
                <div>
                  <p className={`text-2xl font-extrabold ${ratingChange >= 0 ? "text-primary" : "text-destructive"}`}>
                    {ratingChange >= 0 ? "+" : ""}{ratingChange}
                  </p>
                  <p className="text-xs text-muted-foreground">{playerRating.rating} {t("pvp.rating")}</p>
                </div>
                {playerRating.win_streak > 1 && (
                  <span className="ml-auto text-xs font-bold text-accent">🔥 {t("pvp.winStreak")} ×{playerRating.win_streak}</span>
                )}
              </motion.div>

              {/* Psychological nudge */}
              {!won && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="mt-3 text-xs text-muted-foreground italic">
                  {t("pvp.almostThere")}
                </motion.p>
              )}

              <div className="mt-6 w-full space-y-3">
                <button onClick={startQuickMatch}
                  className="w-full rounded-xl gradient-primary py-3 font-bold text-primary-foreground">
                  {t("pvp.playAgain")}
                </button>
                <button onClick={() => setScreen("lobby")}
                  className="w-full rounded-xl bg-muted py-3 font-bold text-foreground">
                  {t("pvp.backToLobby")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default PvpBattle;
