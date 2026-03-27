import { Home, BookOpen, GraduationCap, Trophy, User, TrendingUp } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "Domov", icon: Home },
  { path: "/study", label: "Učivo", icon: GraduationCap },
  { path: "/lessons", label: "Lekcie", icon: BookOpen },
  { path: "/invest", label: "Investície", icon: TrendingUp },
  { path: "/leaderboard", label: "Rebríček", icon: Trophy },
  { path: "/profile", label: "Profil", icon: User },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute -top-1 h-1 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <tab.icon
                className={`h-6 w-6 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[11px] font-bold transition-colors ${
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
