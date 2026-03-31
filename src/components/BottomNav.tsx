import { Home, BookOpen, GraduationCap, Trophy, User, TrendingUp } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

const BottomNav = () => {
  const location = useLocation();
  const { t } = useI18n();

  const tabs = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/study", label: t("nav.study"), icon: GraduationCap },
    { path: "/lessons", label: t("nav.lessons"), icon: BookOpen },
    { path: "/invest", label: t("nav.invest"), icon: TrendingUp },
    { path: "/leaderboard", label: t("nav.leaderboard"), icon: Trophy },
    { path: "/profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center gap-0.5 px-1.5 py-1 min-w-0"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute -top-1.5 h-1 w-6 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <tab.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-bold transition-colors truncate ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
