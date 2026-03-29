import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  coins: number;
  current_streak: number;
  longest_streak: number;
  selected_character: string | null;
  lives: number;
  lives_updated_at: string;
  onboarding_completed: boolean;
}

interface ProgressEntry {
  lesson_id: string;
  completed: boolean;
  score: number;
  xp_earned: number;
  completed_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  progress: ProgressEntry[];
  totalXp: number;
  loading: boolean;
  currentLives: number;
  nextLifeIn: number | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  saveProgress: (lessonId: string, score: number, xpEarned: number, totalQuestions: number) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonScore: (lessonId: string) => { score: number; total: number } | null;
  addCoins: (amount: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
  loseLife: () => Promise<void>;
  completeOnboarding: (charId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

const MAX_LIVES = 6;
const LIFE_REGEN_MS = 60 * 60 * 1000; // 1 hour

function computeLives(dbLives: number, livesUpdatedAt: string): { current: number; nextLifeMs: number | null } {
  const now = Date.now();
  const lastUpdate = new Date(livesUpdatedAt).getTime();
  const elapsed = now - lastUpdate;
  const regenCount = Math.floor(elapsed / LIFE_REGEN_MS);
  const current = Math.min(dbLives + regenCount, MAX_LIVES);
  if (current >= MAX_LIVES) return { current, nextLifeMs: null };
  const timeSinceLastRegen = elapsed - regenCount * LIFE_REGEN_MS;
  return { current, nextLifeMs: LIFE_REGEN_MS - timeSinceLastRegen };
}

const BADGE_RULES: { id: string; check: (ctx: { completedLessons: number; totalXp: number; hasPerfect: boolean; coins: number; streak: number }) => boolean }[] = [
  { id: "first_steps", check: (c) => c.completedLessons >= 1 },
  { id: "knowledge_seeker", check: (c) => c.completedLessons >= 5 },
  { id: "finance_master", check: (c) => c.completedLessons >= 10 },
  { id: "perfect_score", check: (c) => c.hasPerfect },
  { id: "xp_hunter", check: (c) => c.totalXp >= 5000 },
  { id: "rich_mind", check: (c) => c.totalXp >= 10000 },
  { id: "coin_collector", check: (c) => c.coins >= 1000 },
  { id: "week_warrior", check: (c) => c.streak >= 7 },
  { id: "unstoppable", check: (c) => c.streak >= 30 },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [livesInfo, setLivesInfo] = useState<{ current: number; nextLifeMs: number | null }>({ current: MAX_LIVES, nextLifeMs: null });

  const totalXp = progress.reduce((sum, p) => sum + p.xp_earned, 0);

  // Recompute lives every 10 seconds
  useEffect(() => {
    if (!profile) return;
    const update = () => setLivesInfo(computeLives(profile.lives, profile.lives_updated_at));
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [profile?.lives, profile?.lives_updated_at]);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, coins, current_streak, longest_streak, selected_character, lives, lives_updated_at, onboarding_completed")
      .eq("user_id", userId)
      .single();
    if (data) setProfile(data as any);
  }, []);

  const loadProgress = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_progress")
      .select("lesson_id, completed, score, xp_earned, completed_at")
      .eq("user_id", userId);
    if (data) setProgress(data);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => {
            loadProfile(session.user.id);
            loadProgress(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setProgress([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
        loadProgress(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile, loadProgress]);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signInWithGoogle = async () => {
    const { lovable } = await import("@/integrations/lovable");
    await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
  };

  const signInWithApple = async () => {
    const { lovable } = await import("@/integrations/lovable");
    await lovable.auth.signInWithOAuth("apple", { redirect_uri: window.location.origin });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const addCoins = async (amount: number) => {
    if (!user || !profile) return;
    const newCoins = (profile.coins ?? 0) + amount;
    await supabase.from("profiles").update({ coins: newCoins } as any).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, coins: newCoins } : p);
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  const loseLife = async () => {
    if (!user || !profile) return;
    const { current } = computeLives(profile.lives, profile.lives_updated_at);
    if (current <= 0) return;
    const newLives = current - 1;
    const now = new Date().toISOString();
    await supabase.from("profiles").update({ lives: newLives, lives_updated_at: now } as any).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, lives: newLives, lives_updated_at: now } : p);
    toast("💔 Stratil si život!", { description: `Zostáva: ${newLives}/${MAX_LIVES}`, duration: 3000 });
  };

  const completeOnboarding = async (charId: string) => {
    if (!user) return;
    await supabase.from("profiles").update({
      onboarding_completed: true,
      selected_character: charId,
    } as any).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, onboarding_completed: true, selected_character: charId } : p);
  };

  const checkBadges = async (newProgress: ProgressEntry[], newCoins: number) => {
    if (!user) return;
    const { data: existingBadges } = await supabase.from("user_badges").select("badge_id").eq("user_id", user.id);
    const earnedIds = new Set((existingBadges || []).map((b: any) => b.badge_id));
    const completedLessons = newProgress.filter((p) => p.completed).length;
    const newTotalXp = newProgress.reduce((s, p) => s + p.xp_earned, 0);
    const hasPerfect = newProgress.some((p) => p.score === 100);
    const streak = profile?.current_streak ?? 0;
    const ctx = { completedLessons, totalXp: newTotalXp, hasPerfect, coins: newCoins, streak };

    for (const rule of BADGE_RULES) {
      if (!earnedIds.has(rule.id) && rule.check(ctx)) {
        await supabase.from("user_badges").insert({ user_id: user.id, badge_id: rule.id } as any);
        const { data: badgeInfo } = await supabase.from("badges").select("name, icon").eq("id", rule.id).single();
        if (badgeInfo) {
          toast(`${badgeInfo.icon} Nový odznak: ${badgeInfo.name}!`, { description: "Gratulujeme!", duration: 5000 });
        }
      }
    }
  };

  const saveProgress = async (lessonId: string, score: number, xpEarned: number, totalQuestions: number) => {
    if (!user) return;
    const scorePercent = Math.round((score / totalQuestions) * 100);
    const coinsEarned = Math.round(xpEarned / 2);
    const now = new Date().toISOString();

    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        score: scorePercent,
        xp_earned: xpEarned,
        completed_at: now,
      },
      { onConflict: "user_id,lesson_id" }
    );

    if (!error) {
      const newProgress = (() => {
        const existing = progress.findIndex((p) => p.lesson_id === lessonId);
        const entry: ProgressEntry = { lesson_id: lessonId, completed: true, score: scorePercent, xp_earned: xpEarned, completed_at: now };
        if (existing >= 0) {
          const updated = [...progress];
          updated[existing] = entry;
          return updated;
        }
        return [...progress, entry];
      })();
      setProgress(newProgress);

      // Award coins
      const newCoins = (profile?.coins ?? 0) + coinsEarned;
      await supabase.from("profiles").update({ coins: newCoins } as any).eq("user_id", user.id);
      setProfile((p) => p ? { ...p, coins: newCoins } : p);
      if (coinsEarned > 0) toast(`🪙 +${coinsEarned} mincí!`, { duration: 3000 });

      // Streak logic
      const today = new Date().toDateString();
      const alreadyPlayedToday = progress.some(
        (p) => p.completed_at && new Date(p.completed_at).toDateString() === today && p.lesson_id !== lessonId
      );

      if (!alreadyPlayedToday) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const mostRecent = progress
          .filter((p) => p.completed_at && p.lesson_id !== lessonId)
          .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0];

        let newStreak = 1;
        if (mostRecent?.completed_at) {
          const lastDate = new Date(mostRecent.completed_at).toDateString();
          if (lastDate === yesterday) newStreak = (profile?.current_streak ?? 0) + 1;
          else if (lastDate === today) newStreak = profile?.current_streak ?? 1;
        }
        const longestStreak = Math.max(newStreak, profile?.longest_streak ?? 0);
        await supabase.from("profiles").update({ current_streak: newStreak, longest_streak: longestStreak } as any).eq("user_id", user.id);
        setProfile((p) => p ? { ...p, current_streak: newStreak, longest_streak: longestStreak } : p);
        if (newStreak > 1) toast(`🔥 ${newStreak} dní streak!`, { duration: 3000 });
      }

      await checkBadges(newProgress, newCoins);
    }
  };

  const isLessonCompleted = (lessonId: string) =>
    progress.some((p) => p.lesson_id === lessonId && p.completed);

  const getLessonScore = (lessonId: string) => {
    const entry = progress.find((p) => p.lesson_id === lessonId && p.completed);
    if (!entry) return null;
    return { score: entry.score, total: 100 };
  };

  return (
    <AuthContext.Provider
      value={{
        user, session, profile, progress, totalXp, loading,
        currentLives: livesInfo.current,
        nextLifeIn: livesInfo.nextLifeMs,
        signUp, signIn, signInWithGoogle, signInWithApple, signOut,
        saveProgress, isLessonCompleted, getLessonScore, addCoins, refreshProfile,
        loseLife, completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
