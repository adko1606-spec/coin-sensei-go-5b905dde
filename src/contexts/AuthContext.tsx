import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

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
  saveProgress: (lessonId: string, score: number, xpEarned: number) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

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

  const saveProgress = async (lessonId: string, score: number, xpEarned: number) => {
    if (!user) return;
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        score,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );
    if (!error) {
      setProgress((prev) => {
        const existing = prev.findIndex((p) => p.lesson_id === lessonId);
        const entry = { lesson_id: lessonId, completed: true, score, xp_earned: xpEarned };
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = entry;
          return updated;
        }
        return [...prev, entry];
      });
    }
  };

  const isLessonCompleted = (lessonId: string) =>
    progress.some((p) => p.lesson_id === lessonId && p.completed);

  return (
    <AuthContext.Provider
      value={{
        user, session, profile, progress, totalXp, loading,
        signUp, signIn, signInWithGoogle, signInWithApple, signOut, saveProgress, isLessonCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
