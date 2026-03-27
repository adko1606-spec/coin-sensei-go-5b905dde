// Market event scenarios grouped by sector, inspired by real-world events
export interface MarketScenario {
  text: string;
  impactRange: [number, number]; // min%, max%
  sentiment: "positive" | "negative" | "neutral";
}

export const marketScenarios: Record<string, MarketScenario[]> = {
  technology: [
    { text: "🚀 TechInnovate predstavil revolučný AI čip – akcie vystrelili!", impactRange: [5, 15], sentiment: "positive" },
    { text: "📱 Nový produkt zaznamenal rekordný predpredaj", impactRange: [3, 10], sentiment: "positive" },
    { text: "🔒 Bezpečnostná chyba odhalená v hlavnom produkte", impactRange: [-8, -2], sentiment: "negative" },
    { text: "🤝 Strategické partnerstvo s veľkou korporáciou", impactRange: [4, 12], sentiment: "positive" },
    { text: "⚖️ Regulačné vyšetrovanie spomalilo rast", impactRange: [-5, -1], sentiment: "negative" },
    { text: "📊 Kvartálne výsledky prekonali očakávania analytikov", impactRange: [3, 8], sentiment: "positive" },
    { text: "💡 Patent na prelomovú technológiu schválený", impactRange: [2, 7], sentiment: "positive" },
    { text: "🌐 Expanzia na ázijský trh úspešne dokončená", impactRange: [3, 9], sentiment: "positive" },
  ],
  energy: [
    { text: "☀️ Vláda schválila dotácie na obnoviteľnú energiu", impactRange: [4, 12], sentiment: "positive" },
    { text: "🌍 Nová klimatická dohoda zvyšuje dopyt po zelenej energii", impactRange: [3, 10], sentiment: "positive" },
    { text: "⛽ Ceny ropy klesli – konkurencia pre obnoviteľné zdroje", impactRange: [-4, -1], sentiment: "negative" },
    { text: "🔋 Prelomový objav v technológii batérií", impactRange: [5, 14], sentiment: "positive" },
    { text: "🌧️ Nepriaznivé počasie znížilo výrobu solárnej energie", impactRange: [-6, -1], sentiment: "negative" },
    { text: "📈 Rekordná inštalácia solárnych panelov v Európe", impactRange: [3, 8], sentiment: "positive" },
  ],
  finance: [
    { text: "🏦 Centrálna banka znížila úrokové sadzby", impactRange: [2, 6], sentiment: "positive" },
    { text: "💳 Nová digitálna platobná služba prilákala milióny užívateľov", impactRange: [3, 8], sentiment: "positive" },
    { text: "📉 Obavy z recesie tlačia bankový sektor nadol", impactRange: [-5, -1], sentiment: "negative" },
    { text: "🏛️ Prísnejšie regulácie pre bankový sektor", impactRange: [-3, -1], sentiment: "negative" },
    { text: "💰 Rekordné zisky z úrokových výnosov", impactRange: [2, 7], sentiment: "positive" },
    { text: "🤖 Úspešná implementácia AI v risk managemente", impactRange: [1, 5], sentiment: "positive" },
  ],
  healthcare: [
    { text: "💊 Nový liek schválený regulačným úradom", impactRange: [6, 18], sentiment: "positive" },
    { text: "🧬 Prelom v génovej terapii", impactRange: [5, 15], sentiment: "positive" },
    { text: "❌ Klinická štúdia zlyhala – investori sklamaní", impactRange: [-10, -3], sentiment: "negative" },
    { text: "🏥 Partnerstvo s nemocničnou sieťou v EÚ", impactRange: [3, 9], sentiment: "positive" },
    { text: "📋 FDA požaduje ďalšie testy pred schválením", impactRange: [-4, -1], sentiment: "negative" },
    { text: "🌡️ Sezóna chrípok zvýšila dopyt po produktoch", impactRange: [2, 6], sentiment: "positive" },
  ],
  consumer: [
    { text: "🍔 Expanzia reštaurácií na nové trhy", impactRange: [2, 7], sentiment: "positive" },
    { text: "📦 Problémy v dodávateľskom reťazci zvýšili náklady", impactRange: [-4, -1], sentiment: "negative" },
    { text: "🎉 Rekordné tržby počas sviatočného obdobia", impactRange: [3, 8], sentiment: "positive" },
    { text: "🥗 Nový zdravý sortiment zaujal zákazníkov", impactRange: [2, 6], sentiment: "positive" },
    { text: "💸 Inflácia znížila spotrebiteľské výdavky", impactRange: [-5, -2], sentiment: "negative" },
    { text: "🌱 Udržateľné balenie zvýšilo popularitu značky", impactRange: [1, 5], sentiment: "positive" },
  ],
  crypto: [
    { text: "⛓️ Veľká banka prijala blockchain platby", impactRange: [8, 20], sentiment: "positive" },
    { text: "🔥 NFT trh zaznamenal obrovský nárast", impactRange: [5, 15], sentiment: "positive" },
    { text: "🚨 Hacknutá kryptoburza spôsobila paniku", impactRange: [-15, -5], sentiment: "negative" },
    { text: "📜 Nová krypto regulácia v EÚ", impactRange: [-8, 3], sentiment: "neutral" },
    { text: "🐋 Veľký investor nakúpil masívne pozície", impactRange: [6, 18], sentiment: "positive" },
    { text: "⚡ Lightning Network dosiahol rekordný počet uzlov", impactRange: [3, 10], sentiment: "positive" },
  ],
  real_estate: [
    { text: "🏠 Ceny nehnuteľností na Slovensku rastú", impactRange: [2, 7], sentiment: "positive" },
    { text: "🏗️ Nový bytový komplex v Bratislave spustený", impactRange: [3, 8], sentiment: "positive" },
    { text: "📉 Hypotekárne sadzby sa zvýšili", impactRange: [-5, -2], sentiment: "negative" },
    { text: "🌆 Dopyt po komerčných priestoroch klesol", impactRange: [-4, -1], sentiment: "negative" },
    { text: "🏢 Nový prenájomca pre kľúčovú budovu", impactRange: [2, 5], sentiment: "positive" },
    { text: "📊 Pozitívna správa o stave realitného trhu", impactRange: [1, 4], sentiment: "positive" },
  ],
  entertainment: [
    { text: "🎮 Nová hra dosiahla 10 miliónov stiahnutí za týždeň", impactRange: [6, 16], sentiment: "positive" },
    { text: "🏆 Ocenenie Hra roka zvýšilo predaje", impactRange: [4, 12], sentiment: "positive" },
    { text: "🐛 Kritické chyby v novej hre – negatívne recenzie", impactRange: [-8, -2], sentiment: "negative" },
    { text: "🎬 Filmová adaptácia hry oznámená", impactRange: [3, 9], sentiment: "positive" },
    { text: "👥 Kľúčový vývojár odišiel z tímu", impactRange: [-5, -1], sentiment: "negative" },
    { text: "🕹️ E-sports turnaj prilákal milióny divákov", impactRange: [2, 7], sentiment: "positive" },
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
