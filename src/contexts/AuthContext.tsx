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
}

interface ProgressEntry {
  lesson_id: string;
  completed: boolean;
  score: number;
  xp_earned: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  progress: ProgressEntry[];
  totalXp: number;
  loading: boolean;
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
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

// Badge checking logic
const BADGE_RULES: { id: string; check: (ctx: { completedLessons: number; totalXp: number; hasPerfect: boolean; coins: number; streak: number }) => boolean }[] = [
  { id: "first_steps", check: (c) => c.completedLessons >= 1 },
  { id: "knowledge_seeker", check: (c) => c.completedLessons >= 5 },
  { id: "finance_master", check: (c) => c.completedLessons >= 10 },
  { id: "perfect_score", check: (c) => c.hasPerfect },
  { id: "xp_hunter", check: (c) => c.totalXp >= 500 },
  { id: "rich_mind", check: (c) => c.totalXp >= 1000 },
  { id: "coin_collector", check: (c) => c.coins >= 100 },
  { id: "week_warrior", check: (c) => c.streak >= 7 },
  { id: "unstoppable", check: (c) => c.streak >= 30 },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const totalXp = progress.reduce((sum, p) => sum + p.xp_earned, 0);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, coins, current_streak, longest_streak, selected_character")
      .eq("user_id", userId)
      .single();
    if (data) setProfile(data as any);
  }, []);

  const loadProgress = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("user_progress")
      .select("lesson_id, completed, score, xp_earned")
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
    await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
  };

  const signInWithApple = async () => {
    const { lovable } = await import("@/integrations/lovable");
    await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const addCoins = async (amount: number) => {
    if (!user || !profile) return;
    const newCoins = (profile.coins ?? 0) + amount;
    await supabase
      .from("profiles")
      .update({ coins: newCoins } as any)
      .eq("user_id", user.id);
    setProfile((p) => p ? { ...p, coins: newCoins } : p);
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  // Check and award badges
  const checkBadges = async (newProgress: ProgressEntry[], newCoins: number) => {
    if (!user) return;

    // Get existing user badges
    const { data: existingBadges } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user.id);
    const earnedIds = new Set((existingBadges || []).map((b: any) => b.badge_id));

    const completedLessons = newProgress.filter((p) => p.completed).length;
    const newTotalXp = newProgress.reduce((s, p) => s + p.xp_earned, 0);
    const hasPerfect = newProgress.some((p) => p.score === 100);
    const streak = profile?.current_streak ?? 0;

    const ctx = { completedLessons, totalXp: newTotalXp, hasPerfect, coins: newCoins, streak };

    for (const rule of BADGE_RULES) {
      if (!earnedIds.has(rule.id) && rule.check(ctx)) {
        // Award badge
        await supabase.from("user_badges").insert({
          user_id: user.id,
          badge_id: rule.id,
        } as any);

        // Get badge info for notification
        const { data: badgeInfo } = await supabase
          .from("badges")
          .select("name, icon")
          .eq("id", rule.id)
          .single();

        if (badgeInfo) {
          toast(`${badgeInfo.icon} Nový odznak: ${badgeInfo.name}!`, {
            description: "Gratulujeme k novému odznaku!",
            duration: 5000,
          });
        }
      }
    }
  };

  const saveProgress = async (lessonId: string, score: number, xpEarned: number, totalQuestions: number) => {
    if (!user) return;
    const scorePercent = Math.round((score / totalQuestions) * 100);
    const coinsEarned = Math.round(xpEarned / 2);

    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        score: scorePercent,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );
    if (!error) {
      const newProgress = (() => {
        const existing = progress.findIndex((p) => p.lesson_id === lessonId);
        const entry = { lesson_id: lessonId, completed: true, score: scorePercent, xp_earned: xpEarned };
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
      await supabase
        .from("profiles")
        .update({ coins: newCoins } as any)
        .eq("user_id", user.id);
      setProfile((p) => p ? { ...p, coins: newCoins } : p);

      if (coinsEarned > 0) {
        toast(`🪙 +${coinsEarned} mincí!`, { duration: 3000 });
      }

      // Check badges
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
        signUp, signIn, signInWithGoogle, signInWithApple, signOut,
        saveProgress, isLessonCompleted, getLessonScore, addCoins, refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
