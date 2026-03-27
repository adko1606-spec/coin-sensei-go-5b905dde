export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  reward: { xp: number; coins: number };
  type: "complete_lessons" | "earn_xp" | "correct_answers" | "perfect_quiz";
}

export interface MonthlyChallenge extends DailyChallenge {
  tier: "bronze" | "silver" | "gold";
}

const challengePool: Omit<DailyChallenge, "id">[] = [
  {
    title: "Dokončí 3 lekcie",
    description: "Splň tri ľubovoľné lekcie za deň",
    icon: "📖",
    target: 3,
    reward: { xp: 50, coins: 15 },
    type: "complete_lessons",
  },
  {
    title: "Dokončí 5 lekcií",
    description: "Splň päť ľubovoľných lekcií za deň",
    icon: "📚",
    target: 5,
    reward: { xp: 80, coins: 25 },
    type: "complete_lessons",
  },
  {
    title: "Získaj 150 XP",
    description: "Nazbieraj 150 bodov skúseností",
    icon: "⚡",
    target: 150,
    reward: { xp: 40, coins: 12 },
    type: "earn_xp",
  },
  {
    title: "Získaj 300 XP",
    description: "Nazbieraj 300 bodov skúseností za deň",
    icon: "🔥",
    target: 300,
    reward: { xp: 70, coins: 20 },
    type: "earn_xp",
  },
  {
    title: "Odpovedz správne 20×",
    description: "Daj 20 správnych odpovedí v kvízoch",
    icon: "✅",
    target: 20,
    reward: { xp: 50, coins: 15 },
    type: "correct_answers",
  },
  {
    title: "Odpovedz správne 35×",
    description: "Daj 35 správnych odpovedí v kvízoch",
    icon: "💪",
    target: 35,
    reward: { xp: 80, coins: 25 },
    type: "correct_answers",
  },
  {
    title: "2 perfektné kvízy",
    description: "Dosiahni 100% v dvoch kvízoch",
    icon: "⭐",
    target: 2,
    reward: { xp: 100, coins: 30 },
    type: "perfect_quiz",
  },
  {
    title: "3 perfektné kvízy",
    description: "Dosiahni 100% v troch kvízoch za deň",
    icon: "🏆",
    target: 3,
    reward: { xp: 150, coins: 50 },
    type: "perfect_quiz",
  },
];

const weeklyChallengePool: Omit<WeeklyChallenge, "id">[] = [
  // Bronze tier
  {
    title: "Dokončí 10 lekcií",
    description: "Splň 10 lekcií tento týždeň",
    icon: "📖",
    target: 10,
    reward: { xp: 150, coins: 60 },
    type: "complete_lessons",
    tier: "bronze",
  },
  {
    title: "Získaj 500 XP",
    description: "Nazbieraj 500 XP za týždeň",
    icon: "⚡",
    target: 500,
    reward: { xp: 200, coins: 80 },
    type: "earn_xp",
    tier: "bronze",
  },
  {
    title: "Odpovedz správne 50×",
    description: "Daj 50 správnych odpovedí za týždeň",
    icon: "✅",
    target: 50,
    reward: { xp: 150, coins: 60 },
    type: "correct_answers",
    tier: "bronze",
  },
  // Silver tier
  {
    title: "Dokončí 20 lekcií",
    description: "Splň 20 lekcií tento týždeň",
    icon: "📚",
    target: 20,
    reward: { xp: 400, coins: 150 },
    type: "complete_lessons",
    tier: "silver",
  },
  {
    title: "Získaj 1 500 XP",
    description: "Nazbieraj 1 500 XP za týždeň",
    icon: "🔥",
    target: 1500,
    reward: { xp: 500, coins: 200 },
    type: "earn_xp",
    tier: "silver",
  },
  {
    title: "Odpovedz správne 120×",
    description: "Daj 120 správnych odpovedí za týždeň",
    icon: "💪",
    target: 120,
    reward: { xp: 400, coins: 150 },
    type: "correct_answers",
    tier: "silver",
  },
  {
    title: "5 perfektných kvízov",
    description: "Dosiahni 100% v 5 kvízoch za týždeň",
    icon: "⭐",
    target: 5,
    reward: { xp: 400, coins: 150 },
    type: "perfect_quiz",
    tier: "silver",
  },
  // Gold tier
  {
    title: "Dokončí 35 lekcií",
    description: "Splň 35 lekcií tento týždeň",
    icon: "👑",
    target: 35,
    reward: { xp: 800, coins: 400 },
    type: "complete_lessons",
    tier: "gold",
  },
  {
    title: "Získaj 3 000 XP",
    description: "Nazbieraj 3 000 XP za týždeň",
    icon: "🏆",
    target: 3000,
    reward: { xp: 1000, coins: 500 },
    type: "earn_xp",
    tier: "gold",
  },
  {
    title: "Odpovedz správne 250×",
    description: "Daj 250 správnych odpovedí za týždeň",
    icon: "🎯",
    target: 250,
    reward: { xp: 800, coins: 400 },
    type: "correct_answers",
    tier: "gold",
  },
  {
    title: "10 perfektných kvízov",
    description: "Dosiahni 100% v 10 kvízoch za týždeň",
    icon: "💎",
    target: 10,
    reward: { xp: 1200, coins: 600 },
    type: "perfect_quiz",
    tier: "gold",
  },
];

export function getTodaysChallenges(): DailyChallenge[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const shuffled = [...challengePool].sort((a, b) => {
    const ha = hashCode(a.title + seed);
    const hb = hashCode(b.title + seed);
    return ha - hb;
  });

  return shuffled.slice(0, 3).map((c, i) => ({
    ...c,
    id: `daily_${seed}_${i}`,
  }));
}

export function getWeeksChallenges(): WeeklyChallenge[] {
  const today = new Date();
  // Week seed: year + ISO week number
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  const seed = today.getFullYear() * 100 + weekNum;

  const shuffled = [...weeklyChallengePool].sort((a, b) => {
    const ha = hashCode(a.title + seed);
    const hb = hashCode(b.title + seed);
    return ha - hb;
  });

  const bronze = shuffled.find((c) => c.tier === "bronze")!;
  const silver = shuffled.find((c) => c.tier === "silver")!;
  const gold = shuffled.find((c) => c.tier === "gold")!;

  return [bronze, silver, gold].map((c, i) => ({
    ...c,
    id: `weekly_${seed}_${i}`,
  }));
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}
