import { Flame, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface StatsBarProps {
  xp: number;
  streak: number;
  level: number;
}

const StatsBar = ({ xp, streak, level }: StatsBarProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-streak/10">
          <Flame className="h-5 w-5 text-streak" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Streak</p>
          <p className="text-lg font-extrabold text-foreground">{streak}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-xp/10">
          <Zap className="h-5 w-5 text-xp" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">XP</p>
          <p className="text-lg font-extrabold text-foreground">{xp}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-level/10">
          <Trophy className="h-5 w-5 text-level" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Level</p>
          <p className="text-lg font-extrabold text-foreground">{level}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsBar;
