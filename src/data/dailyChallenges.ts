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

const monthlyChallengePool: Omit<MonthlyChallenge, "id">[] = [
  // Bronze tier
  {
    title: "Dokončí 20 lekcií",
    description: "Splň 20 lekcií tento mesiac",
    icon: "📖",
    target: 20,
    reward: { xp: 200, coins: 80 },
    type: "complete_lessons",
    tier: "bronze",
  },
  {
    title: "Získaj 1 000 XP",
    description: "Nazbieraj 1 000 XP za mesiac",
    icon: "⚡",
    target: 1000,
    reward: { xp: 250, coins: 100 },
    type: "earn_xp",
    tier: "bronze",
  },
  {
    title: "Odpovedz správne 100×",
    description: "Daj 100 správnych odpovedí za mesiac",
    icon: "✅",
    target: 100,
    reward: { xp: 200, coins: 80 },
    type: "correct_answers",
    tier: "bronze",
  },
  // Silver tier
  {
    title: "Dokončí 40 lekcií",
    description: "Splň 40 lekcií tento mesiac",
    icon: "📚",
    target: 40,
    reward: { xp: 500, coins: 200 },
    type: "complete_lessons",
    tier: "silver",
  },
  {
    title: "Získaj 3 000 XP",
    description: "Nazbieraj 3 000 XP za mesiac",
    icon: "🔥",
    target: 3000,
    reward: { xp: 600, coins: 250 },
    type: "earn_xp",
    tier: "silver",
  },
  {
    title: "Odpovedz správne 250×",
    description: "Daj 250 správnych odpovedí za mesiac",
    icon: "💪",
    target: 250,
    reward: { xp: 500, coins: 200 },
    type: "correct_answers",
    tier: "silver",
  },
  {
    title: "10 perfektných kvízov",
    description: "Dosiahni 100% v 10 kvízoch za mesiac",
    icon: "⭐",
    target: 10,
    reward: { xp: 500, coins: 200 },
    type: "perfect_quiz",
    tier: "silver",
  },
  // Gold tier
  {
    title: "Dokončí 70 lekcií",
    description: "Splň 70 lekcií tento mesiac",
    icon: "👑",
    target: 70,
    reward: { xp: 1000, coins: 500 },
    type: "complete_lessons",
    tier: "gold",
  },
  {
    title: "Získaj 5 000 XP",
    description: "Nazbieraj 5 000 XP za mesiac",
    icon: "🏆",
    target: 5000,
    reward: { xp: 1200, coins: 600 },
    type: "earn_xp",
    tier: "gold",
  },
  {
    title: "Odpovedz správne 500×",
    description: "Daj 500 správnych odpovedí za mesiac",
    icon: "🎯",
    target: 500,
    reward: { xp: 1000, coins: 500 },
    type: "correct_answers",
    tier: "gold",
  },
  {
    title: "20 perfektných kvízov",
    description: "Dosiahni 100% v 20 kvízoch za mesiac",
    icon: "💎",
    target: 20,
    reward: { xp: 1500, coins: 750 },
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

export function getMonthsChallenges(): MonthlyChallenge[] {
  const today = new Date();
  const seed = today.getFullYear() * 100 + (today.getMonth() + 1);

  const shuffled = [...monthlyChallengePool].sort((a, b) => {
    const ha = hashCode(a.title + seed);
    const hb = hashCode(b.title + seed);
    return ha - hb;
  });

  // Pick 1 from each tier
  const bronze = shuffled.find((c) => c.tier === "bronze")!;
  const silver = shuffled.find((c) => c.tier === "silver")!;
  const gold = shuffled.find((c) => c.tier === "gold")!;

  return [bronze, silver, gold].map((c, i) => ({
    ...c,
    id: `monthly_${seed}_${i}`,
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
