import type { Language } from "@/contexts/I18nContext";

// Localized lesson metadata (titles & descriptions)
const lessonMeta: Record<string, Record<Language, { title: string; description: string }>> = {
  "1": {
    sk: { title: "Čo sú peniaze?", description: "Nauč sa základy o peniazoch a ich funkciách" },
    en: { title: "What is money?", description: "Learn the basics about money and its functions" },
    ua: { title: "Що таке гроші?", description: "Вивчіть основи грошей та їхні функції" },
  },
  "2": {
    sk: { title: "Banky a účty", description: "Ako fungujú banky a bankové účty" },
    en: { title: "Banks & accounts", description: "How banks and bank accounts work" },
    ua: { title: "Банки та рахунки", description: "Як працюють банки та банківські рахунки" },
  },
  "3": {
    sk: { title: "Prvé úspory", description: "Ako začať šetriť aj s malým vreckovým" },
    en: { title: "First savings", description: "How to start saving even with a small allowance" },
    ua: { title: "Перші заощадження", description: "Як почати заощаджувати навіть з невеликою кишеньковою" },
  },
  "4": {
    sk: { title: "Dlhy a pôžičky", description: "Kedy sa oplatí požičať a kedy nie" },
    en: { title: "Debts & loans", description: "When borrowing pays off and when it doesn't" },
    ua: { title: "Борги та позики", description: "Коли варто позичати, а коли ні" },
  },
  "5": {
    sk: { title: "Rozpočet 101", description: "Vytvor si svoj prvý osobný rozpočet" },
    en: { title: "Budget 101", description: "Create your first personal budget" },
    ua: { title: "Бюджет 101", description: "Створіть свій перший особистий бюджет" },
  },
  "6": {
    sk: { title: "Inteligentné míňanie", description: "Ako nakupovať rozumne a neplýtvať" },
    en: { title: "Smart spending", description: "How to shop wisely and avoid waste" },
    ua: { title: "Розумні витрати", description: "Як розумно витрачати та не марнувати" },
  },
  "7": {
    sk: { title: "Úvod do investovania", description: "Zisti ako môžu peniaze pracovať za teba" },
    en: { title: "Intro to investing", description: "Discover how money can work for you" },
    ua: { title: "Вступ до інвестування", description: "Дізнайтесь, як гроші можуть працювати на вас" },
  },
  "8": {
    sk: { title: "Zložené úročenie", description: "Sila času a úrokov – 8. div sveta" },
    en: { title: "Compound interest", description: "The power of time and interest – 8th wonder" },
    ua: { title: "Складні відсотки", description: "Сила часу та відсотків – 8-ме чудо світу" },
  },
  "9": {
    sk: { title: "Riziko a výnos", description: "Pochop vzťah medzi rizikom a ziskom" },
    en: { title: "Risk & return", description: "Understand the relationship between risk and profit" },
    ua: { title: "Ризик і прибуток", description: "Зрозумійте зв'язок між ризиком та прибутком" },
  },
  "10": {
    sk: { title: "Burzové indexy", description: "S&P 500, NASDAQ a ďalšie indexy" },
    en: { title: "Stock market indexes", description: "S&P 500, NASDAQ and other indexes" },
    ua: { title: "Біржові індекси", description: "S&P 500, NASDAQ та інші індекси" },
  },
  "11": {
    sk: { title: "Čo je Bitcoin?", description: "Základy Bitcoinu a blockchainu" },
    en: { title: "What is Bitcoin?", description: "Basics of Bitcoin and blockchain" },
    ua: { title: "Що таке Bitcoin?", description: "Основи Bitcoin та блокчейну" },
  },
  "12": {
    sk: { title: "Altcoiny a DeFi", description: "Ethereum, stablecoiny a decentralizované financie" },
    en: { title: "Altcoins & DeFi", description: "Ethereum, stablecoins and decentralized finance" },
    ua: { title: "Альткоїни та DeFi", description: "Ethereum, стейблкоїни та децентралізовані фінанси" },
  },
  "13": {
    sk: { title: "Krypto bezpečnosť", description: "Peňaženky, kľúče a ochrana investícií" },
    en: { title: "Crypto security", description: "Wallets, keys and investment protection" },
    ua: { title: "Безпека крипто", description: "Гаманці, ключі та захист інвестицій" },
  },
  "14": {
    sk: { title: "Dane a odvody", description: "Základy daňového systému na Slovensku" },
    en: { title: "Taxes & levies", description: "Basics of the tax system in Slovakia" },
    ua: { title: "Податки та збори", description: "Основи податкової системи Словаччини" },
  },
  "15": {
    sk: { title: "Dane z investícií", description: "Ako zdaňovať zisky z akcií a krypta" },
    en: { title: "Investment taxes", description: "How to tax profits from stocks and crypto" },
    ua: { title: "Податки з інвестицій", description: "Як оподатковувати прибутки з акцій та крипто" },
  },
  "16": {
    sk: { title: "Daňové tipy pre mladých", description: "Ako legálne ušetriť na daniach" },
    en: { title: "Tax tips for youth", description: "How to legally save on taxes" },
    ua: { title: "Податкові поради для молоді", description: "Як легально заощадити на податках" },
  },
  "17": {
    sk: { title: "Spotrebiteľské práva", description: "Tvoje práva pri nákupoch a reklamáciách" },
    en: { title: "Consumer rights", description: "Your rights when shopping and making complaints" },
    ua: { title: "Права споживачів", description: "Ваші права при покупках та скаргах" },
  },
  "18": {
    sk: { title: "Zmluvy a záväzky", description: "Na čo si dávať pozor pri podpisovaní zmlúv" },
    en: { title: "Contracts & obligations", description: "What to watch for when signing contracts" },
    ua: { title: "Договори та зобов'язання", description: "На що звертати увагу при підписанні договорів" },
  },
  "19": {
    sk: { title: "Finančné podvody", description: "Ako rozpoznať a vyhnúť sa podvodom" },
    en: { title: "Financial fraud", description: "How to recognize and avoid scams" },
    ua: { title: "Фінансове шахрайство", description: "Як розпізнати та уникнути шахрайства" },
  },
  "20": {
    sk: { title: "Zdravotné a sociálne poistenie", description: "Povinné poistenie na Slovensku" },
    en: { title: "Health & social insurance", description: "Mandatory insurance in Slovakia" },
    ua: { title: "Медичне та соціальне страхування", description: "Обов'язкове страхування в Словаччині" },
  },
  "21": {
    sk: { title: "Poistenie majetku", description: "Ochráň svoj majetok a budúcnosť" },
    en: { title: "Property insurance", description: "Protect your property and future" },
    ua: { title: "Страхування майна", description: "Захистіть своє майно та майбутнє" },
  },
};

export function getLocalizedLessonMeta(lessonId: string, lang: Language): { title: string; description: string } | null {
  const meta = lessonMeta[lessonId];
  if (!meta) return null;
  return meta[lang] || meta.sk;
}

// Localized category names
const categoryNames: Record<string, Record<Language, string>> = {
  basics: { sk: "Základy", en: "Basics", ua: "Основи" },
  saving: { sk: "Šetrenie", en: "Saving", ua: "Заощадження" },
  investing: { sk: "Investovanie", en: "Investing", ua: "Інвестування" },
  budgeting: { sk: "Rozpočet", en: "Budget", ua: "Бюджет" },
  crypto: { sk: "Krypto", en: "Crypto", ua: "Крипто" },
  taxes: { sk: "Dane", en: "Taxes", ua: "Податки" },
  legal: { sk: "Právo", en: "Law", ua: "Право" },
  insurance: { sk: "Poistenie", en: "Insurance", ua: "Страхування" },
};

export function getLocalizedCategoryName(categoryId: string, lang: Language): string {
  return categoryNames[categoryId]?.[lang] || categoryNames[categoryId]?.sk || categoryId;
}
