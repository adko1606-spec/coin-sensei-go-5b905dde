// Market event scenarios grouped by sector, inspired by real-world events
export interface MarketScenario {
  text: string;
  impactRange: [number, number]; // min%, max%
  sentiment: "positive" | "negative" | "neutral";
}

// Risk profiles per sector - reflects real-world behavior
export interface SectorProfile {
  label: string;
  risk: "nízke" | "stredné" | "vysoké" | "veľmi vysoké";
  riskLevel: 1 | 2 | 3 | 4; // 1=low, 4=very high
  description: string;
  avgReturn: string; // historical average annual return description
}

export const sectorProfiles: Record<string, SectorProfile> = {
  technology: {
    label: "Technológie",
    risk: "stredné",
    riskLevel: 2,
    description: "Technologické firmy rastú rýchlo, ale čelia reguláciám a konkurencii.",
    avgReturn: "8–15 % ročne (historicky)",
  },
  energy: {
    label: "Energia",
    risk: "stredné",
    riskLevel: 2,
    description: "Obnoviteľná energia rastie stabilne, ale závisí od dotácií a počasia.",
    avgReturn: "5–10 % ročne",
  },
  finance: {
    label: "Financie",
    risk: "nízke",
    riskLevel: 1,
    description: "Banky sú stabilnejšie, ale citlivé na úrokové sadzby a regulácie.",
    avgReturn: "4–8 % ročne",
  },
  healthcare: {
    label: "Zdravotníctvo",
    risk: "vysoké",
    riskLevel: 3,
    description: "Veľké výkyvy – úspech lieku = obrovský rast, neúspech = veľký prepad.",
    avgReturn: "Veľmi variabilné: -30 % až +50 %",
  },
  consumer: {
    label: "Spotrebiteľský",
    risk: "nízke",
    riskLevel: 1,
    description: "Stabilné firmy s predvídateľnými tržbami. Pomalší, ale istejší rast.",
    avgReturn: "3–7 % ročne",
  },
  crypto: {
    label: "Krypto",
    risk: "veľmi vysoké",
    riskLevel: 4,
    description: "Extrémna volatilita. Môžeš zarobiť veľa, ale aj stratiť väčšinu.",
    avgReturn: "Nepredvídateľné: -80 % až +200 %",
  },
  real_estate: {
    label: "Reality",
    risk: "nízke",
    riskLevel: 1,
    description: "Nehnuteľnosti rastú pomaly, ale stabilne. Nízke riziko.",
    avgReturn: "2–5 % ročne",
  },
  entertainment: {
    label: "Zábava",
    risk: "vysoké",
    riskLevel: 3,
    description: "Závisí od hitov. Jeden úspech môže zdvojnásobiť cenu, neúspech ju zničiť.",
    avgReturn: "Variabilné: -20 % až +40 %",
  },
};

export const marketScenarios: Record<string, MarketScenario[]> = {
  technology: [
    { text: "🚀 Nový AI čip zvýšil dopyt po technológiách", impactRange: [3, 8], sentiment: "positive" },
    { text: "📱 Rekordný predpredaj nového produktu", impactRange: [2, 6], sentiment: "positive" },
    { text: "🔒 Bezpečnostná chyba odhalená v produkte", impactRange: [-5, -1], sentiment: "negative" },
    { text: "🤝 Strategické partnerstvo s veľkou firmou", impactRange: [2, 7], sentiment: "positive" },
    { text: "⚖️ Regulačné vyšetrovanie spomalilo rast", impactRange: [-4, -1], sentiment: "negative" },
    { text: "📊 Kvartálne výsledky prekonali očakávania", impactRange: [2, 5], sentiment: "positive" },
    { text: "🌐 Expanzia na ázijský trh", impactRange: [1, 4], sentiment: "positive" },
    { text: "📉 Konkurencia predstavila lepší produkt", impactRange: [-6, -2], sentiment: "negative" },
  ],
  energy: [
    { text: "☀️ Vláda schválila dotácie na zelenú energiu", impactRange: [2, 6], sentiment: "positive" },
    { text: "🔋 Prelom v technológii batérií", impactRange: [3, 8], sentiment: "positive" },
    { text: "⛽ Ceny ropy klesli – silná konkurencia", impactRange: [-3, -1], sentiment: "negative" },
    { text: "🌧️ Nepriaznivé počasie znížilo výrobu energie", impactRange: [-4, -1], sentiment: "negative" },
    { text: "📈 Rekordná inštalácia solárnych panelov", impactRange: [2, 5], sentiment: "positive" },
    { text: "🌍 Nová klimatická dohoda v EÚ", impactRange: [1, 4], sentiment: "positive" },
  ],
  finance: [
    { text: "🏦 Centrálna banka znížila úroky – banky profitujú", impactRange: [1, 4], sentiment: "positive" },
    { text: "💳 Nová digitálna služba zaujala klientov", impactRange: [1, 3], sentiment: "positive" },
    { text: "📉 Obavy z recesie tlačia banky nadol", impactRange: [-3, -1], sentiment: "negative" },
    { text: "💰 Stabilné zisky z úrokových výnosov", impactRange: [1, 3], sentiment: "positive" },
    { text: "🏛️ Prísnejšie regulácie pre banky", impactRange: [-2, -1], sentiment: "negative" },
    { text: "📊 Pozitívna správa o hospodárstve", impactRange: [1, 3], sentiment: "positive" },
  ],
  healthcare: [
    { text: "💊 Nový liek schválený – obrovský potenciál!", impactRange: [5, 15], sentiment: "positive" },
    { text: "🧬 Prelom v génovej terapii", impactRange: [4, 12], sentiment: "positive" },
    { text: "❌ Klinická štúdia zlyhala – investori sklamaní", impactRange: [-12, -4], sentiment: "negative" },
    { text: "🏥 Partnerstvo s nemocničnou sieťou", impactRange: [2, 6], sentiment: "positive" },
    { text: "📋 Regulátor požaduje ďalšie testy", impactRange: [-6, -2], sentiment: "negative" },
    { text: "🌡️ Zvýšený dopyt po liekoch", impactRange: [2, 5], sentiment: "positive" },
  ],
  consumer: [
    { text: "🍔 Expanzia na nové trhy", impactRange: [1, 4], sentiment: "positive" },
    { text: "📦 Problémy v dodávateľskom reťazci", impactRange: [-3, -1], sentiment: "negative" },
    { text: "🎉 Rekordné sviatočné tržby", impactRange: [2, 5], sentiment: "positive" },
    { text: "🌱 Ekologický sortiment zvýšil popularitu", impactRange: [1, 3], sentiment: "positive" },
    { text: "💸 Inflácia znížila spotrebiteľské výdavky", impactRange: [-3, -1], sentiment: "negative" },
    { text: "📊 Stabilné tržby podľa očakávaní", impactRange: [0, 2], sentiment: "positive" },
  ],
  crypto: [
    { text: "⛓️ Veľká banka prijala blockchain platby", impactRange: [8, 20], sentiment: "positive" },
    { text: "🚨 Hacknutá kryptoburza – masívny výpredaj!", impactRange: [-20, -8], sentiment: "negative" },
    { text: "🐋 Veľký investor nakúpil pozície", impactRange: [5, 15], sentiment: "positive" },
    { text: "📜 Nová regulácia kryptomien v EÚ", impactRange: [-10, 3], sentiment: "neutral" },
    { text: "⚡ Technologický upgrade siete úspešný", impactRange: [3, 10], sentiment: "positive" },
    { text: "📉 Panika na trhu – masový výpredaj", impactRange: [-18, -5], sentiment: "negative" },
    { text: "🏦 Ďalšia krajina zakázala kryptomeny", impactRange: [-15, -5], sentiment: "negative" },
    { text: "🔥 Virálny záujem o krypto na sociálnych sieťach", impactRange: [5, 12], sentiment: "positive" },
  ],
  real_estate: [
    { text: "🏠 Ceny nehnuteľností mierne rastú", impactRange: [1, 3], sentiment: "positive" },
    { text: "🏗️ Nový projekt v Bratislave spustený", impactRange: [1, 4], sentiment: "positive" },
    { text: "📉 Hypotekárne sadzby sa zvýšili", impactRange: [-3, -1], sentiment: "negative" },
    { text: "🏢 Nový prenájomca pre kľúčovú budovu", impactRange: [1, 3], sentiment: "positive" },
    { text: "📊 Stabilný dopyt po bývaní", impactRange: [0, 2], sentiment: "positive" },
    { text: "🌆 Pokles dopytu po komerčných priestoroch", impactRange: [-2, -1], sentiment: "negative" },
  ],
  entertainment: [
    { text: "🎮 Nová hra dosiahla 10M stiahnutí!", impactRange: [5, 14], sentiment: "positive" },
    { text: "🏆 Ocenenie Hra roka zvýšilo predaje", impactRange: [3, 10], sentiment: "positive" },
    { text: "🐛 Kritické chyby v novej hre – negatívne recenzie", impactRange: [-10, -3], sentiment: "negative" },
    { text: "🎬 Filmová adaptácia hry oznámená", impactRange: [2, 7], sentiment: "positive" },
    { text: "👥 Kľúčový vývojár odišiel z tímu", impactRange: [-6, -2], sentiment: "negative" },
    { text: "🕹️ E-sports turnaj prilákal milióny divákov", impactRange: [2, 6], sentiment: "positive" },
  ],
};

export function getRandomScenario(sector: string): MarketScenario {
  const scenarios = marketScenarios[sector] || marketScenarios.technology;
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

export function calculateMarketChange(scenario: MarketScenario): number {
  const [min, max] = scenario.impactRange;
  return min + Math.random() * (max - min);
}
