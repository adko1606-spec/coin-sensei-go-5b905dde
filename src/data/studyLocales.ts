import type { Language } from "@/contexts/I18nContext";

export interface StudyTopic {
  id: string;
  title: string;
  content: string;
  example?: string;
  tip?: string;
}

export interface StudyCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  topics: StudyTopic[];
}

// Category-level translations
const categoryMeta: Record<string, Record<Language, { name: string; description: string }>> = {
  basics: {
    sk: { name: "Základy peňazí", description: "Pochop, čo sú peniaze, ako fungujú a prečo sú dôležité v každodennom živote." },
    en: { name: "Money Basics", description: "Understand what money is, how it works and why it matters in everyday life." },
    ua: { name: "Основи грошей", description: "Зрозумійте, що таке гроші, як вони працюють та чому важливі в повсякденному житті." },
  },
  saving: {
    sk: { name: "Šetrenie", description: "Nauč sa efektívne šetriť a budovať si finančnú rezervu na neočakávané situácie." },
    en: { name: "Saving", description: "Learn to save effectively and build a financial reserve for unexpected situations." },
    ua: { name: "Заощадження", description: "Навчіться ефективно заощаджувати та створювати фінансовий резерв." },
  },
  investing: {
    sk: { name: "Investovanie", description: "Objavuj svet investícií – od akcií cez dlhopisy až po ETF fondy." },
    en: { name: "Investing", description: "Discover the world of investments – from stocks to bonds and ETFs." },
    ua: { name: "Інвестування", description: "Відкрийте світ інвестицій – від акцій до облігацій та ETF фондів." },
  },
  budgeting: {
    sk: { name: "Rozpočet", description: "Nauč sa plánovať výdavky a mať prehľad o svojich financiách." },
    en: { name: "Budget", description: "Learn to plan expenses and keep track of your finances." },
    ua: { name: "Бюджет", description: "Навчіться планувати витрати та контролювати свої фінанси." },
  },
  crypto: {
    sk: { name: "Kryptomeny", description: "Základy kryptomien, blockchainu a decentralizovaných financií." },
    en: { name: "Cryptocurrencies", description: "Basics of crypto, blockchain and decentralized finance." },
    ua: { name: "Криптовалюти", description: "Основи крипто, блокчейну та децентралізованих фінансів." },
  },
  taxes: {
    sk: { name: "Dane", description: "Pochop daňový systém na Slovensku a nauč sa optimalizovať dane." },
    en: { name: "Taxes", description: "Understand the tax system in Slovakia and learn to optimize taxes." },
    ua: { name: "Податки", description: "Зрозумійте податкову систему Словаччини та навчіться оптимізувати податки." },
  },
  legal: {
    sk: { name: "Právo", description: "Základy finančného práva, zmluvy a ochrana spotrebiteľa." },
    en: { name: "Law", description: "Basics of financial law, contracts and consumer protection." },
    ua: { name: "Право", description: "Основи фінансового права, договори та захист споживачів." },
  },
  insurance: {
    sk: { name: "Poistenie", description: "Prečo je poistenie dôležité a aké typy poistenia existujú." },
    en: { name: "Insurance", description: "Why insurance matters and what types of insurance exist." },
    ua: { name: "Страхування", description: "Чому страхування важливе та які види страхування існують." },
  },
};

export function getLocalizedStudyCategory(cat: StudyCategory, lang: Language): StudyCategory {
  const meta = categoryMeta[cat.id]?.[lang] || categoryMeta[cat.id]?.sk;
  if (!meta) return cat;
  return { ...cat, name: meta.name, description: meta.description };
}
