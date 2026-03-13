export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xp: number;
  completed: boolean;
  locked: boolean;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const categories = [
  { id: "basics", name: "Základy", emoji: "📚", color: "primary" },
  { id: "saving", name: "Šetrenie", emoji: "🐷", color: "streak" },
  { id: "investing", name: "Investovanie", emoji: "📈", color: "accent" },
  { id: "budgeting", name: "Rozpočet", emoji: "💰", color: "xp" },
];

export const lessons: Lesson[] = [
  {
    id: "1",
    title: "Čo sú peniaze?",
    description: "Nauč sa základy o peniazoch a ich funkciách",
    icon: "💵",
    category: "basics",
    xp: 20,
    completed: false,
    locked: false,
    questions: [
      {
        id: "q1",
        text: "Aká je hlavná funkcia peňazí?",
        options: ["Prostriedok výmeny", "Dekorácia", "Hračka", "Potrava"],
        correctIndex: 0,
        explanation: "Peniaze slúžia primárne ako prostriedok výmeny za tovary a služby.",
      },
      {
        id: "q2",
        text: "Čo je inflácia?",
        options: [
          "Rast cien tovarov a služieb",
          "Pokles cien",
          "Typ investície",
          "Bankový účet",
        ],
        correctIndex: 0,
        explanation: "Inflácia znamená všeobecný rast cien, čím sa znižuje kúpna sila peňazí.",
      },
      {
        id: "q3",
        text: "Kto vydáva peniaze na Slovensku?",
        options: ["Európska centrálna banka", "Vláda SR", "Komerčné banky", "Pošta"],
        correctIndex: 0,
        explanation: "Euro vydáva Európska centrálna banka (ECB) pre všetky krajiny eurozóny.",
      },
    ],
  },
  {
    id: "2",
    title: "Prvé úspory",
    description: "Ako začať šetriť aj s malým vreckovým",
    icon: "🐷",
    category: "saving",
    xp: 25,
    completed: false,
    locked: false,
    questions: [
      {
        id: "q4",
        text: "Koľko percent príjmu by si mal ideálne šetriť?",
        options: ["10-20%", "100%", "0%", "50-80%"],
        correctIndex: 0,
        explanation: "Odporúča sa šetriť 10-20% z príjmu. Pravidlo 50/30/20 je dobrý začiatok.",
      },
      {
        id: "q5",
        text: "Čo je núdzový fond?",
        options: [
          "Úspory na nečakané výdavky",
          "Investičný fond",
          "Pôžička od banky",
          "Kreditná karta",
        ],
        correctIndex: 0,
        explanation: "Núdzový fond sú peniaze odložené na nečakané situácie ako opravy alebo strata práce.",
      },
    ],
  },
  {
    id: "3",
    title: "Rozpočet 101",
    description: "Vytvor si svoj prvý osobný rozpočet",
    icon: "📊",
    category: "budgeting",
    xp: 30,
    completed: false,
    locked: true,
    questions: [
      {
        id: "q6",
        text: "Čo je pravidlo 50/30/20?",
        options: [
          "50% potreby, 30% želania, 20% úspory",
          "50% úspory, 30% jedlo, 20% zábava",
          "50% dane, 30% bývanie, 20% iné",
          "50% investície, 30% úspory, 20% výdavky",
        ],
        correctIndex: 0,
        explanation: "Pravidlo 50/30/20 rozdeľuje príjem: 50% na potreby, 30% na želania a 20% na úspory.",
      },
    ],
  },
  {
    id: "4",
    title: "Úvod do investovania",
    description: "Zisti ako môžu peniaze pracovať za teba",
    icon: "📈",
    category: "investing",
    xp: 35,
    completed: false,
    locked: true,
    questions: [
      {
        id: "q7",
        text: "Čo je akcia?",
        options: [
          "Podiel vlastníctva vo firme",
          "Typ bankovky",
          "Druh pôžičky",
          "Bankový účet",
        ],
        correctIndex: 0,
        explanation: "Akcia predstavuje podiel na vlastníctve firmy. Keď kúpiš akciu, stávaš sa spoluvlastníkom.",
      },
    ],
  },
  {
    id: "5",
    title: "Zložené úročenie",
    description: "Sila času a úrokov",
    icon: "🔄",
    category: "investing",
    xp: 40,
    completed: false,
    locked: true,
    questions: [
      {
        id: "q8",
        text: "Čo je zložené úročenie?",
        options: [
          "Úrok z úroku",
          "Jednoduchý úrok",
          "Poplatok banke",
          "Typ dane",
        ],
        correctIndex: 0,
        explanation: "Zložené úročenie znamená, že zarábate úrok nielen z pôvodnej sumy, ale aj z predchádzajúcich úrokov.",
      },
    ],
  },
];
