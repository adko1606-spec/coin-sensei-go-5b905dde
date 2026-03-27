export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  reward: { xp: number; coins: number };
  type: "complete_lessons" | "earn_xp" | "correct_answers" | "perfect_quiz";
}

const challengePool: Omit<DailyChallenge, "id">[] = [
  {
    title: "Dokončí 1 lekciu",
    description: "Splň jednu ľubovoľnú lekciu",
    icon: "📖",
    target: 1,
    reward: { xp: 20, coins: 5 },
    type: "complete_lessons",
  },
  {
    title: "Dokončí 2 lekcie",
    description: "Splň dve ľubovoľné lekcie",
    icon: "📚",
    target: 2,
    reward: { xp: 40, coins: 10 },
    type: "complete_lessons",
  },
  {
    title: "Získaj 50 XP",
    description: "Nazbieraj 50 bodov skúseností",
    icon: "⚡",
    target: 50,
    reward: { xp: 15, coins: 5 },
    type: "earn_xp",
  },
  {
    title: "Získaj 100 XP",
    description: "Nazbieraj 100 bodov skúseností",
    icon: "🔥",
    target: 100,
    reward: { xp: 30, coins: 10 },
    type: "earn_xp",
  },
  {
    title: "Odpovedz správne 10×",
    description: "Daj 10 správnych odpovedí v kvízoch",
    icon: "✅",
    target: 10,
    reward: { xp: 25, coins: 8 },
    type: "correct_answers",
  },
  {
    title: "Perfektný kvíz",
    description: "Dosiahni 100% v jednom kvíze",
    icon: "⭐",
    target: 1,
    reward: { xp: 50, coins: 15 },
    type: "perfect_quiz",
  },
];

export function getTodaysChallenges(): DailyChallenge[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Pick 3 challenges based on date seed
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

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}
