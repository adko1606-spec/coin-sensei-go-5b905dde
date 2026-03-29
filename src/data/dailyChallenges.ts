export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  reward: { xp: number; coins: number };
  type: "complete_lessons" | "earn_xp" | "correct_answers" | "perfect_quiz";
}

export interface WeeklyChallenge extends DailyChallenge {
  tier: "bronze" | "silver" | "gold";
}

const challengePool: Omit<DailyChallenge, "id">[] = [
  { title: "Dokončí 3 lekcie", description: "Splň tri ľubovoľné lekcie za deň", icon: "📖", target: 3, reward: { xp: 500, coins: 150 }, type: "complete_lessons" },
  { title: "Dokončí 5 lekcií", description: "Splň päť ľubovoľných lekcií za deň", icon: "📚", target: 5, reward: { xp: 800, coins: 250 }, type: "complete_lessons" },
  { title: "Získaj 1 500 XP", description: "Nazbieraj 1 500 bodov skúseností", icon: "⚡", target: 1500, reward: { xp: 400, coins: 120 }, type: "earn_xp" },
  { title: "Získaj 3 000 XP", description: "Nazbieraj 3 000 bodov skúseností za deň", icon: "🔥", target: 3000, reward: { xp: 700, coins: 200 }, type: "earn_xp" },
  { title: "Odpovedz správne 20×", description: "Daj 20 správnych odpovedí v kvízoch", icon: "✅", target: 20, reward: { xp: 500, coins: 150 }, type: "correct_answers" },
  { title: "Odpovedz správne 35×", description: "Daj 35 správnych odpovedí v kvízoch", icon: "💪", target: 35, reward: { xp: 800, coins: 250 }, type: "correct_answers" },
  { title: "2 perfektné kvízy", description: "Dosiahni 100% v dvoch kvízoch", icon: "⭐", target: 2, reward: { xp: 1000, coins: 300 }, type: "perfect_quiz" },
  { title: "3 perfektné kvízy", description: "Dosiahni 100% v troch kvízoch za deň", icon: "🏆", target: 3, reward: { xp: 1500, coins: 500 }, type: "perfect_quiz" },
];

const weeklyChallengePool: Omit<WeeklyChallenge, "id">[] = [
  // Bronze
  { title: "Dokončí 12 lekcií", description: "Splň 12 lekcií tento týždeň", icon: "📖", target: 12, reward: { xp: 1500, coins: 600 }, type: "complete_lessons", tier: "bronze" },
  { title: "Získaj 6 000 XP", description: "Nazbieraj 6 000 XP za týždeň", icon: "⚡", target: 6000, reward: { xp: 2000, coins: 800 }, type: "earn_xp", tier: "bronze" },
  { title: "Odpovedz správne 60×", description: "Daj 60 správnych odpovedí za týždeň", icon: "✅", target: 60, reward: { xp: 1500, coins: 600 }, type: "correct_answers", tier: "bronze" },
  // Silver
  { title: "Dokončí 25 lekcií", description: "Splň 25 lekcií tento týždeň", icon: "📚", target: 25, reward: { xp: 4000, coins: 1500 }, type: "complete_lessons", tier: "silver" },
  { title: "Získaj 15 000 XP", description: "Nazbieraj 15 000 XP za týždeň", icon: "🔥", target: 15000, reward: { xp: 5000, coins: 2000 }, type: "earn_xp", tier: "silver" },
  { title: "Odpovedz správne 150×", description: "Daj 150 správnych odpovedí za týždeň", icon: "💪", target: 150, reward: { xp: 4000, coins: 1500 }, type: "correct_answers", tier: "silver" },
  { title: "6 perfektných kvízov", description: "Dosiahni 100% v 6 kvízoch za týždeň", icon: "⭐", target: 6, reward: { xp: 4000, coins: 1500 }, type: "perfect_quiz", tier: "silver" },
  // Gold
  { title: "Dokončí 40 lekcií", description: "Splň 40 lekcií tento týždeň", icon: "👑", target: 40, reward: { xp: 8000, coins: 4000 }, type: "complete_lessons", tier: "gold" },
  { title: "Získaj 30 000 XP", description: "Nazbieraj 30 000 XP za týždeň", icon: "🏆", target: 30000, reward: { xp: 10000, coins: 5000 }, type: "earn_xp", tier: "gold" },
  { title: "Odpovedz správne 300×", description: "Daj 300 správnych odpovedí za týždeň", icon: "🎯", target: 300, reward: { xp: 8000, coins: 4000 }, type: "correct_answers", tier: "gold" },
  { title: "12 perfektných kvízov", description: "Dosiahni 100% v 12 kvízoch za týždeň", icon: "💎", target: 12, reward: { xp: 12000, coins: 6000 }, type: "perfect_quiz", tier: "gold" },
];

export function getTodaysChallenges(): DailyChallenge[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const shuffled = [...challengePool].sort((a, b) => hashCode(a.title + seed) - hashCode(b.title + seed));
  return shuffled.slice(0, 3).map((c, i) => ({ ...c, id: `daily_${seed}_${i}` }));
}

export function getWeeksChallenges(): WeeklyChallenge[] {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  const seed = today.getFullYear() * 100 + weekNum;
  const shuffled = [...weeklyChallengePool].sort((a, b) => hashCode(a.title + seed) - hashCode(b.title + seed));
  const bronze = shuffled.find((c) => c.tier === "bronze")!;
  const silver = shuffled.find((c) => c.tier === "silver")!;
  const gold = shuffled.find((c) => c.tier === "gold")!;
  return [bronze, silver, gold].map((c, i) => ({ ...c, id: `weekly_${seed}_${i}` }));
}

/** Reset info: Daily = midnight, Weekly = Monday midnight */
export function getDailyResetTime(): Date {
  const t = new Date();
  t.setHours(24, 0, 0, 0);
  return t;
}

export function getWeeklyResetTime(): Date {
  const t = new Date();
  const day = t.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  t.setDate(t.getDate() + daysUntilMonday);
  t.setHours(0, 0, 0, 0);
  return t;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
