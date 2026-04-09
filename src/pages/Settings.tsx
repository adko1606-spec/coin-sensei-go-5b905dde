import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, Sun, Moon, Bell, Shield, Languages, RotateCcw, LogOut, User, Lock, BarChart3, Users, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useSound } from "@/hooks/useSound";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSWORD = "invest123";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const { enabled: soundEnabled, volume, setEnabled: setSoundEnabled, setVolume } = useSound();
  const [notifications, setNotifications] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [editingName, setEditingName] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return;
    await supabase.from("profiles").update({ display_name: displayName.trim() } as any).eq("user_id", user.id);
    await refreshProfile();
    setEditingName(false);
    toast.success(t("settings.nameUpdated"));
  };

  const handleResetProgress = async () => {
    if (!user) return;
    setResetting(true);
    try {
      await Promise.all([
        supabase.from("user_progress").delete().eq("user_id", user.id),
        supabase.from("user_investments").delete().eq("user_id", user.id),
        supabase.from("investment_transactions").delete().eq("user_id", user.id),
        supabase.from("user_badges").delete().eq("user_id", user.id),
        supabase.from("user_cosmetics").delete().eq("user_id", user.id),
        supabase.from("player_ratings").update({ rating: 0, rank: "Bronze", wins: 0, losses: 0, win_streak: 0, highest_rating: 0 } as any).eq("user_id", user.id),
      ]);
      await supabase.from("profiles").update({
        coins: 0,
        current_streak: 0,
        longest_streak: 0,
        lives: 6,
        lives_updated_at: new Date().toISOString(),
      } as any).eq("user_id", user.id);
      await refreshProfile();
      setShowResetConfirm(false);
      toast.success(t("settings.resetSuccess"));
    } catch {
      toast.error(t("settings.resetError"));
    }
    setResetting(false);
  };

  const handleAdminLogin = async () => {
    if (adminPassword !== ADMIN_PASSWORD) {
      toast.error("Nesprávne heslo");
      return;
    }
    setShowAdminLogin(false);
    setShowAdmin(true);
    // Load stats
    const [profilesRes, progressRes] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, coins, current_streak, created_at"),
      supabase.from("user_progress").select("user_id, completed, xp_earned"),
    ]);
    const profiles = profilesRes.data || [];
    const progressData = progressRes.data || [];
    const totalUsers = profiles.length;
    const activeUsers = new Set(progressData.map((p: any) => p.user_id)).size;
    const totalLessonsCompleted = progressData.filter((p: any) => p.completed).length;
    const totalXpAll = progressData.reduce((s: number, p: any) => s + p.xp_earned, 0);
    
    setAdminStats({
      totalUsers,
      activeUsers,
      totalLessonsCompleted,
      totalXpAll,
      profiles: profiles.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20),
    });
  };

  return (
    <div className="min-h-screen gradient-hero pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/profile")} className="rounded-full p-2 hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-extrabold text-foreground">{t("settings.title")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 mt-6 space-y-4">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">{t("settings.profile")}</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground font-semibold">{t("settings.email")}</label>
              <p className="text-sm text-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-semibold">{t("settings.name")}</label>
              {editingName ? (
                <div className="flex gap-2 mt-1">
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                  <button onClick={handleSaveName} className="rounded-xl gradient-primary px-3 py-2 text-sm font-bold text-primary-foreground">{t("settings.save")}</button>
                </div>
              ) : (
                <button onClick={() => setEditingName(true)} className="text-sm text-primary font-semibold">{profile?.display_name || t("settings.setName")}</button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sound */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            {soundEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
            <h3 className="font-bold text-foreground">{t("settings.sound")}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.soundEffects")}</span>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
            {soundEnabled && (
              <div>
                <label className="text-xs text-muted-foreground font-semibold">{t("settings.volume")}</label>
                <input type="range" min={0} max={1} step={0.1} value={volume} onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary mt-1" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            {theme === "dark" ? <Moon className="h-5 w-5 text-level" /> : <Sun className="h-5 w-5 text-xp" />}
            <h3 className="font-bold text-foreground">{t("settings.appearance")}</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm transition-all ${theme === "light" ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              <Sun className="h-4 w-4" /> {t("settings.light")}
            </button>
            <button onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm transition-all ${theme === "dark" ? "gradient-blue text-primary-foreground" : "bg-muted text-foreground"}`}>
              <Moon className="h-4 w-4" /> {t("settings.dark")}
            </button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-accent" />
            <h3 className="font-bold text-foreground">{t("settings.notifications")}</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{t("settings.pushNotifications")}</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">{t("settings.privacy")}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{t("settings.privacyText")}</p>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Languages className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-foreground">{t("settings.language")}</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setLanguage("sk")}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${language === "sk" ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>
              🇸🇰 SK
            </button>
            <button onClick={() => setLanguage("en")}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${language === "en" ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>
              🇬🇧 EN
            </button>
            <button onClick={() => setLanguage("ua")}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${language === "ua" ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>
              🇺🇦 UA
            </button>
          </div>
        </motion.div>

        {/* Reset */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <RotateCcw className="h-5 w-5 text-destructive" />
            <h3 className="font-bold text-foreground">{t("settings.resetProgress")}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{t("settings.resetDesc")}</p>
          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)}
              className="w-full rounded-xl py-2.5 bg-destructive/10 text-destructive text-sm font-bold hover:bg-destructive/20 transition-colors">
              {t("settings.resetAll")}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-destructive font-semibold">{t("settings.resetConfirm")}</p>
              <div className="flex gap-2">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 rounded-xl py-2.5 bg-muted text-foreground text-sm font-bold">{t("settings.cancel")}</button>
                <button onClick={handleResetProgress} disabled={resetting} className="flex-1 rounded-xl py-2.5 bg-destructive text-destructive-foreground text-sm font-bold">
                  {resetting ? t("settings.resetting") : t("settings.confirm")}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Sign out */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <button onClick={signOut}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-card p-4 shadow-card text-destructive font-bold hover:bg-destructive/5 transition-colors">
            <LogOut className="h-5 w-5" /> {t("settings.signOut")}
          </button>
        </motion.div>

        {/* Admin button - small and subtle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-center pt-4 pb-2">
          <button onClick={() => setShowAdminLogin(true)} className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors">
            •••
          </button>
        </motion.div>

        {/* Admin login */}
        {showAdminLogin && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card p-4 shadow-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">{t("settings.admin")}</h3>
            </div>
            <div className="flex gap-2">
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Heslo"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              <button onClick={handleAdminLogin} className="rounded-xl gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground">OK</button>
              <button onClick={() => { setShowAdminLogin(false); setAdminPassword(""); }} className="rounded-xl bg-muted px-3 py-2 text-sm text-foreground">✕</button>
            </div>
          </motion.div>
        )}

        {/* Admin stats panel */}
        {showAdmin && adminStats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card p-4 shadow-card border-2 border-primary/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground">{t("settings.admin")}</h3>
              </div>
              <button onClick={() => setShowAdmin(false)} className="text-xs text-muted-foreground">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-center">
                <Users className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Používatelia</p>
                <p className="text-xl font-bold text-foreground">{adminStats.totalUsers}</p>
              </div>
              <div className="rounded-xl bg-accent/10 p-3 text-center">
                <Eye className="h-4 w-4 text-accent mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Aktívni</p>
                <p className="text-xl font-bold text-foreground">{adminStats.activeUsers}</p>
              </div>
              <div className="rounded-xl bg-xp/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">Lekcie celkom</p>
                <p className="text-xl font-bold text-foreground">{adminStats.totalLessonsCompleted}</p>
              </div>
              <div className="rounded-xl bg-coin/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">XP celkom</p>
                <p className="text-xl font-bold text-foreground">{adminStats.totalXpAll}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Poslední používatelia</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {adminStats.profiles.map((p: any) => (
                  <div key={p.user_id} className="flex items-center justify-between rounded-lg bg-muted/30 p-2 text-xs">
                    <span className="font-bold text-foreground truncate max-w-[150px]">{p.display_name || "—"}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-coin">🪙 {p.coins}</span>
                      <span className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString("sk-SK")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
