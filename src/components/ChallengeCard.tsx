import { motion } from "framer-motion";
import { Check, Calendar } from "lucide-react";
import type { DailyChallenge, WeeklyChallenge } from "@/data/dailyChallenges";

interface ChallengeCardProps {
  challenge: DailyChallenge | WeeklyChallenge;
  status: { current: number; completed: boolean };
  index: number;
  delayBase?: number;
}

const tierColors: Record<string, { bg: string; border: string; badge: string; badgeText: string }> = {
  bronze: { bg: "bg-orange-500/10", border: "border-orange-400/40", badge: "bg-orange-400/20", badgeText: "text-orange-500" },
  silver: { bg: "bg-slate-400/10", border: "border-slate-400/40", badge: "bg-slate-400/20", badgeText: "text-slate-500" },
  gold: { bg: "bg-yellow-500/10", border: "border-yellow-400/40", badge: "bg-yellow-400/20", badgeText: "text-yellow-500" },
};

const tierLabels: Record<string, string> = {
  bronze: "🥉 Bronzová",
  silver: "🥈 Strieborná",
  gold: "🥇 Zlatá",
};

export function ChallengeCard({ challenge, status, index, delayBase = 0.3 }: ChallengeCardProps) {
  const isCompleted = status.completed;
  const current = status.current;
  const isMonthly = "tier" in challenge;
  const tier = isMonthly ? (challenge as WeeklyChallenge).tier : null;
  const colors = tier ? tierColors[tier] : null;

  return (
    <motion.div
      key={challenge.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delayBase + index * 0.1 }}
      className={`flex items-center gap-3 rounded-2xl p-4 shadow-card transition-all ${
        isCompleted
          ? "bg-primary/10 border-2 border-primary"
          : isMonthly && colors
          ? `${colors.bg} border ${colors.border}`
          : "bg-card"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
          isCompleted ? "bg-primary/20" : "bg-primary/10"
        }`}
      >
        {isCompleted ? <Check className="h-6 w-6 text-primary" /> : challenge.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-bold ${isCompleted ? "text-primary line-through" : "text-foreground"}`}>
            {challenge.title}
          </p>
          {tier && colors && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.badge} ${colors.badgeText}`}>
              {tierLabels[tier]}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{challenge.description}</p>
        {!isCompleted && (
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min((current / challenge.target) * 100, 100)}%` }}
            />
          </div>
        )}
        {!isCompleted && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {current}/{challenge.target}
          </p>
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
}
