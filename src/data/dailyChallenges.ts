import type { Language } from "@/contexts/I18nContext";

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

type ChallengeData = Omit<DailyChallenge, "id"> & { titleKey: string; descKey: string };
type WeeklyChallengeData = Omit<WeeklyChallenge, "id"> & { titleKey: string; descKey: string };

const challengeTexts: Record<string, Record<Language, string>> = {
  "d.complete3.title": { sk: "Dokončí 3 lekcie", en: "Complete 3 lessons", ua: "Завершіть 3 уроки" },
  "d.complete3.desc": { sk: "Splň tri ľubovoľné lekcie za deň", en: "Complete any three lessons today", ua: "Завершіть будь-які три уроки сьогодні" },
  "d.complete5.title": { sk: "Dokončí 5 lekcií", en: "Complete 5 lessons", ua: "Завершіть 5 уроків" },
  "d.complete5.desc": { sk: "Splň päť ľubovoľných lekcií za deň", en: "Complete any five lessons today", ua: "Завершіть будь-які п'ять уроків сьогодні" },
  "d.xp1500.title": { sk: "Získaj 1 500 XP", en: "Earn 1,500 XP", ua: "Отримайте 1 500 XP" },
  "d.xp1500.desc": { sk: "Nazbieraj 1 500 bodov skúseností", en: "Collect 1,500 experience points", ua: "Зберіть 1 500 балів досвіду" },
  "d.xp3000.title": { sk: "Získaj 3 000 XP", en: "Earn 3,000 XP", ua: "Отримайте 3 000 XP" },
  "d.xp3000.desc": { sk: "Nazbieraj 3 000 bodov skúseností za deň", en: "Collect 3,000 experience points today", ua: "Зберіть 3 000 балів досвіду сьогодні" },
  "d.correct20.title": { sk: "Odpovedz správne 20×", en: "Answer 20 correctly", ua: "Відповідайте правильно 20×" },
  "d.correct20.desc": { sk: "Daj 20 správnych odpovedí v kvízoch", en: "Give 20 correct answers in quizzes", ua: "Дайте 20 правильних відповідей у вікторинах" },
  "d.correct35.title": { sk: "Odpovedz správne 35×", en: "Answer 35 correctly", ua: "Відповідайте правильно 35×" },
  "d.correct35.desc": { sk: "Daj 35 správnych odpovedí v kvízoch", en: "Give 35 correct answers in quizzes", ua: "Дайте 35 правильних відповідей у вікторинах" },
  "d.perfect2.title": { sk: "2 perfektné kvízy", en: "2 perfect quizzes", ua: "2 ідеальні вікторини" },
  "d.perfect2.desc": { sk: "Dosiahni 100% v dvoch kvízoch", en: "Score 100% in two quizzes", ua: "Отримайте 100% у двох вікторинах" },
  "d.perfect3.title": { sk: "3 perfektné kvízy", en: "3 perfect quizzes", ua: "3 ідеальні вікторини" },
  "d.perfect3.desc": { sk: "Dosiahni 100% v troch kvízoch za deň", en: "Score 100% in three quizzes today", ua: "Отримайте 100% у трьох вікторинах сьогодні" },
  // Weekly
  "w.complete12.title": { sk: "Dokončí 12 lekcií", en: "Complete 12 lessons", ua: "Завершіть 12 уроків" },
  "w.complete12.desc": { sk: "Splň 12 lekcií tento týždeň", en: "Complete 12 lessons this week", ua: "Завершіть 12 уроків цього тижня" },
  "w.xp6000.title": { sk: "Získaj 6 000 XP", en: "Earn 6,000 XP", ua: "Отримайте 6 000 XP" },
  "w.xp6000.desc": { sk: "Nazbieraj 6 000 XP za týždeň", en: "Collect 6,000 XP this week", ua: "Зберіть 6 000 XP цього тижня" },
  "w.correct60.title": { sk: "Odpovedz správne 60×", en: "Answer 60 correctly", ua: "Відповідайте правильно 60×" },
  "w.correct60.desc": { sk: "Daj 60 správnych odpovedí za týždeň", en: "Give 60 correct answers this week", ua: "Дайте 60 правильних відповідей цього тижня" },
  "w.complete25.title": { sk: "Dokončí 25 lekcií", en: "Complete 25 lessons", ua: "Завершіть 25 уроків" },
  "w.complete25.desc": { sk: "Splň 25 lekcií tento týždeň", en: "Complete 25 lessons this week", ua: "Завершіть 25 уроків цього тижня" },
  "w.xp15000.title": { sk: "Získaj 15 000 XP", en: "Earn 15,000 XP", ua: "Отримайте 15 000 XP" },
  "w.xp15000.desc": { sk: "Nazbieraj 15 000 XP za týždeň", en: "Collect 15,000 XP this week", ua: "Зберіть 15 000 XP цього тижня" },
  "w.correct150.title": { sk: "Odpovedz správne 150×", en: "Answer 150 correctly", ua: "Відповідайте правильно 150×" },
  "w.correct150.desc": { sk: "Daj 150 správnych odpovedí za týždeň", en: "Give 150 correct answers this week", ua: "Дайте 150 правильних відповідей цього тижня" },
  "w.perfect6.title": { sk: "6 perfektných kvízov", en: "6 perfect quizzes", ua: "6 ідеальних вікторин" },
  "w.perfect6.desc": { sk: "Dosiahni 100% v 6 kvízoch za týždeň", en: "Score 100% in 6 quizzes this week", ua: "Отримайте 100% у 6 вікторинах цього тижня" },
  "w.complete40.title": { sk: "Dokončí 40 lekcií", en: "Complete 40 lessons", ua: "Завершіть 40 уроків" },
  "w.complete40.desc": { sk: "Splň 40 lekcií tento týždeň", en: "Complete 40 lessons this week", ua: "Завершіть 40 уроків цього тижня" },
  "w.xp30000.title": { sk: "Získaj 30 000 XP", en: "Earn 30,000 XP", ua: "Отримайте 30 000 XP" },
  "w.xp30000.desc": { sk: "Nazbieraj 30 000 XP za týždeň", en: "Collect 30,000 XP this week", ua: "Зберіть 30 000 XP цього тижня" },
  "w.correct300.title": { sk: "Odpovedz správne 300×", en: "Answer 300 correctly", ua: "Відповідайте правильно 300×" },
  "w.correct300.desc": { sk: "Daj 300 správnych odpovedí za týždeň", en: "Give 300 correct answers this week", ua: "Дайте 300 правильних відповідей цього тижня" },
  "w.perfect12.title": { sk: "12 perfektných kvízov", en: "12 perfect quizzes", ua: "12 ідеальних вікторин" },
  "w.perfect12.desc": { sk: "Dosiahni 100% v 12 kvízoch za týždeň", en: "Score 100% in 12 quizzes this week", ua: "Отримайте 100% у 12 вікторинах цього тижня" },
};

const t = (key: string, lang: Language) => challengeTexts[key]?.[lang] ?? challengeTexts[key]?.sk ?? key;

const challengePoolKeys: { titleKey: string; descKey: string; icon: string; target: number; reward: { xp: number; coins: number }; type: DailyChallenge["type"] }[] = [
  { titleKey: "d.complete3.title", descKey: "d.complete3.desc", icon: "📖", target: 3, reward: { xp: 500, coins: 150 }, type: "complete_lessons" },
  { titleKey: "d.complete5.title", descKey: "d.complete5.desc", icon: "📚", target: 5, reward: { xp: 800, coins: 250 }, type: "complete_lessons" },
  { titleKey: "d.xp1500.title", descKey: "d.xp1500.desc", icon: "⚡", target: 1500, reward: { xp: 400, coins: 120 }, type: "earn_xp" },
  { titleKey: "d.xp3000.title", descKey: "d.xp3000.desc", icon: "🔥", target: 3000, reward: { xp: 700, coins: 200 }, type: "earn_xp" },
  { titleKey: "d.correct20.title", descKey: "d.correct20.desc", icon: "✅", target: 20, reward: { xp: 500, coins: 150 }, type: "correct_answers" },
  { titleKey: "d.correct35.title", descKey: "d.correct35.desc", icon: "💪", target: 35, reward: { xp: 800, coins: 250 }, type: "correct_answers" },
  { titleKey: "d.perfect2.title", descKey: "d.perfect2.desc", icon: "⭐", target: 2, reward: { xp: 1000, coins: 300 }, type: "perfect_quiz" },
  { titleKey: "d.perfect3.title", descKey: "d.perfect3.desc", icon: "🏆", target: 3, reward: { xp: 1500, coins: 500 }, type: "perfect_quiz" },
];

const weeklyChallengePoolKeys: { titleKey: string; descKey: string; icon: string; target: number; reward: { xp: number; coins: number }; type: DailyChallenge["type"]; tier: WeeklyChallenge["tier"] }[] = [
  { titleKey: "w.complete12.title", descKey: "w.complete12.desc", icon: "📖", target: 12, reward: { xp: 1500, coins: 600 }, type: "complete_lessons", tier: "bronze" },
  { titleKey: "w.xp6000.title", descKey: "w.xp6000.desc", icon: "⚡", target: 6000, reward: { xp: 2000, coins: 800 }, type: "earn_xp", tier: "bronze" },
  { titleKey: "w.correct60.title", descKey: "w.correct60.desc", icon: "✅", target: 60, reward: { xp: 1500, coins: 600 }, type: "correct_answers", tier: "bronze" },
  { titleKey: "w.complete25.title", descKey: "w.complete25.desc", icon: "📚", target: 25, reward: { xp: 4000, coins: 1500 }, type: "complete_lessons", tier: "silver" },
  { titleKey: "w.xp15000.title", descKey: "w.xp15000.desc", icon: "🔥", target: 15000, reward: { xp: 5000, coins: 2000 }, type: "earn_xp", tier: "silver" },
  { titleKey: "w.correct150.title", descKey: "w.correct150.desc", icon: "💪", target: 150, reward: { xp: 4000, coins: 1500 }, type: "correct_answers", tier: "silver" },
  { titleKey: "w.perfect6.title", descKey: "w.perfect6.desc", icon: "⭐", target: 6, reward: { xp: 4000, coins: 1500 }, type: "perfect_quiz", tier: "silver" },
  { titleKey: "w.complete40.title", descKey: "w.complete40.desc", icon: "👑", target: 40, reward: { xp: 8000, coins: 4000 }, type: "complete_lessons", tier: "gold" },
  { titleKey: "w.xp30000.title", descKey: "w.xp30000.desc", icon: "🏆", target: 30000, reward: { xp: 10000, coins: 5000 }, type: "earn_xp", tier: "gold" },
  { titleKey: "w.correct300.title", descKey: "w.correct300.desc", icon: "🎯", target: 300, reward: { xp: 8000, coins: 4000 }, type: "correct_answers", tier: "gold" },
  { titleKey: "w.perfect12.title", descKey: "w.perfect12.desc", icon: "💎", target: 12, reward: { xp: 12000, coins: 6000 }, type: "perfect_quiz", tier: "gold" },
];

export function getTodaysChallenges(lang: Language = "sk"): DailyChallenge[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const shuffled = [...challengePoolKeys].sort((a, b) => hashCode(a.titleKey + seed) - hashCode(b.titleKey + seed));
  return shuffled.slice(0, 3).map((c, i) => ({
    id: `daily_${seed}_${i}`,
    title: t(c.titleKey, lang),
    description: t(c.descKey, lang),
    icon: c.icon,
    target: c.target,
    reward: c.reward,
    type: c.type,
  }));
}

export function getWeeksChallenges(lang: Language = "sk"): WeeklyChallenge[] {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  const seed = today.getFullYear() * 100 + weekNum;
  const shuffled = [...weeklyChallengePoolKeys].sort((a, b) => hashCode(a.titleKey + seed) - hashCode(b.titleKey + seed));
  const bronze = shuffled.find((c) => c.tier === "bronze")!;
  const silver = shuffled.find((c) => c.tier === "silver")!;
  const gold = shuffled.find((c) => c.tier === "gold")!;
  return [bronze, silver, gold].map((c, i) => ({
    id: `weekly_${seed}_${i}`,
    title: t(c.titleKey, lang),
    description: t(c.descKey, lang),
    icon: c.icon,
    target: c.target,
    reward: c.reward,
    type: c.type,
    tier: c.tier,
  }));
}

export function getDailyResetTime(): Date {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d;
}

export function getWeeklyResetTime(): Date {
  const d = new Date();
  const day = d.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
