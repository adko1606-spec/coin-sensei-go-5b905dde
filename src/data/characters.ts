export interface Character {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: "real" | "symbolic";
}

export const characters: Character[] = [
  {
    id: "buffett",
    name: "Warren Buffett",
    emoji: "🎩",
    description: "Legendárny investor a CEO Berkshire Hathaway. Známy ako „Veštec z Omahy".",
    category: "real",
  },
  {
    id: "satoshi",
    name: "Satoshi Nakamoto",
    emoji: "🔗",
    description: "Záhadný tvorca Bitcoinu, ktorého pravá identita dodnes nie je známa.",
    category: "real",
  },
  {
    id: "trump",
    name: "Donald Trump",
    emoji: "🏛️",
    description: "Podnikateľ a politik, známy realitný magnát a bývalý prezident USA.",
    category: "real",
  },
  {
    id: "bezos",
    name: "Jeff Bezos",
    emoji: "🚀",
    description: "Zakladateľ Amazonu a Blue Origin. Jeden z najbohatších ľudí na svete.",
    category: "real",
  },
  {
    id: "zuckerberg",
    name: "Mark Zuckerberg",
    emoji: "👓",
    description: "Zakladateľ Facebooku (Meta). Mladý vizionár, ktorý prepojil svet.",
    category: "real",
  },
  {
    id: "musk",
    name: "Elon Musk",
    emoji: "⚡",
    description: "CEO Tesly a SpaceX. Inovátor, ktorý chce zmeniť budúcnosť ľudstva.",
    category: "real",
  },
  {
    id: "dalio",
    name: "Ray Dalio",
    emoji: "📊",
    description: "Zakladateľ Bridgewater Associates, najväčšieho hedžového fondu na svete.",
    category: "real",
  },
  {
    id: "bull",
    name: "Bull",
    emoji: "🐂",
    description: "Symbol rastúceho trhu. Býk tlačí ceny nahor rohmi!",
    category: "symbolic",
  },
  {
    id: "bear",
    name: "Bear",
    emoji: "🐻",
    description: "Symbol klesajúceho trhu. Medveď stláča ceny dole labami.",
    category: "symbolic",
  },
  {
    id: "unicorn",
    name: "Unicorn",
    emoji: "🦄",
    description: "Startup s hodnotou nad 1 miliardu dolárov. Vzácny a magický!",
    category: "symbolic",
  },
  {
    id: "whale",
    name: "Whale",
    emoji: "🐋",
    description: "Veľký investor, ktorý dokáže pohnúť celým trhom jedným obchodom.",
    category: "symbolic",
  },
  {
    id: "diamond_hands",
    name: "Diamond Hands",
    emoji: "💎",
    description: "Investor, ktorý drží svoje pozície aj v najťažších časoch. Nikdy nepredáva!",
    category: "symbolic",
  },
];
