import buffettImg from "@/assets/characters/buffett.png";
import satoshiImg from "@/assets/characters/satoshi.png";
import trumpImg from "@/assets/characters/trump.png";
import bezosImg from "@/assets/characters/bezos.png";
import zuckerbergImg from "@/assets/characters/zuckerberg.png";
import muskImg from "@/assets/characters/musk.png";
import dalioImg from "@/assets/characters/dalio.png";
import bullImg from "@/assets/characters/bull.png";
import bearImg from "@/assets/characters/bear.png";
import unicornImg from "@/assets/characters/unicorn.png";
import whaleImg from "@/assets/characters/whale.png";
import diamondHandsImg from "@/assets/characters/diamond_hands.png";

export interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  category: "real" | "symbolic";
}

export const characters: Character[] = [
  {
    id: "buffett",
    name: "Warren Profitt",
    image: buffettImg,
    description: "Legendárny investor a CEO veľkej investičnej firmy. Známy ako 'Veštec z Omahy'.",
    category: "real",
  },
  {
    id: "satoshi",
    name: "Satoshi Crypto",
    image: satoshiImg,
    description: "Záhadný tvorca kryptomien, ktorého pravá identita dodnes nie je známa.",
    category: "real",
  },
  {
    id: "trump",
    name: "Ronald Wealth",
    image: trumpImg,
    description: "Podnikateľ a politik, známy realitný magnát a mediálna osobnosť.",
    category: "real",
  },
  {
    id: "bezos",
    name: "Jeff Cosmo",
    image: bezosImg,
    description: "Zakladateľ obrovského e-commerce impéria a vesmírnej spoločnosti.",
    category: "real",
  },
  {
    id: "zuckerberg",
    name: "Mark Social",
    image: zuckerbergImg,
    description: "Zakladateľ najväčšej sociálnej siete. Mladý vizionár, ktorý prepojil svet.",
    category: "real",
  },
  {
    id: "musk",
    name: "Elon Rocket",
    image: muskImg,
    description: "CEO elektromobilovej a vesmírnej firmy. Inovátor, ktorý chce zmeniť budúcnosť.",
    category: "real",
  },
  {
    id: "dalio",
    name: "Ray Capital",
    image: dalioImg,
    description: "Zakladateľ najväčšieho hedžového fondu na svete. Guru finančného sveta.",
    category: "real",
  },
  {
    id: "bull",
    name: "Bull",
    image: bullImg,
    description: "Symbol rastúceho trhu. Býk tlačí ceny nahor rohmi!",
    category: "symbolic",
  },
  {
    id: "bear",
    name: "Bear",
    image: bearImg,
    description: "Symbol klesajúceho trhu. Medveď stláča ceny dole labami.",
    category: "symbolic",
  },
  {
    id: "unicorn",
    name: "Unicorn",
    image: unicornImg,
    description: "Startup s hodnotou nad 1 miliardu dolárov. Vzácny a magický!",
    category: "symbolic",
  },
  {
    id: "whale",
    name: "Whale",
    image: whaleImg,
    description: "Veľký investor, ktorý dokáže pohnúť celým trhom jedným obchodom.",
    category: "symbolic",
  },
  {
    id: "diamond_hands",
    name: "Diamond Hands",
    image: diamondHandsImg,
    description: "Investor, ktorý drží svoje pozície aj v najťažších časoch. Nikdy nepredáva!",
    category: "symbolic",
  },
];
