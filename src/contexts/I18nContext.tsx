import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "sk" | "en" | "ua";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Navigation
  "nav.home": { sk: "Domov", en: "Home", ua: "Головна" },
  "nav.study": { sk: "Učivo", en: "Study", ua: "Навчання" },
  "nav.lessons": { sk: "Lekcie", en: "Lessons", ua: "Уроки" },
  "nav.invest": { sk: "Investície", en: "Invest", ua: "Інвестиції" },
  "nav.leaderboard": { sk: "Rebríček", en: "Leaderboard", ua: "Рейтинг" },
  "nav.profile": { sk: "Profil", en: "Profile", ua: "Профіль" },
  
  // Home
  "home.hello": { sk: "Ahoj", en: "Hello", ua: "Привіт" },
  "home.subtitle": { sk: "Nauč sa ovládať svoje financie", en: "Learn to master your finances", ua: "Навчись керувати своїми фінансами" },
  "home.dailyTip": { sk: "Tip dňa", en: "Daily Tip", ua: "Порада дня" },
  "home.dailyChallenges": { sk: "Denné výzvy", en: "Daily Challenges", ua: "Щоденні завдання" },
  "home.weeklyChallenges": { sk: "Týždenné výzvy", en: "Weekly Challenges", ua: "Тижневі завдання" },
  "home.reset": { sk: "Reset", en: "Reset", ua: "Скидання" },
  "home.lessons": { sk: "Lekcie", en: "Lessons", ua: "Уроки" },
  "home.studyMaterial": { sk: "Učivo", en: "Study", ua: "Навчання" },
  "home.investments": { sk: "Investície", en: "Invest", ua: "Інвестиції" },
  "home.leaderboard": { sk: "Rebríček", en: "Leaderboard", ua: "Рейтинг" },
  "home.profile": { sk: "Profil", en: "Profile", ua: "Профіль" },
  
  // Lessons
  "lessons.title": { sk: "Lekcie", en: "Lessons", ua: "Уроки" },
  "lessons.loading": { sk: "Načítavam...", en: "Loading...", ua: "Завантаження..." },
  "lessons.nextQuestion": { sk: "Ďalšia otázka", en: "Next Question", ua: "Наступне питання" },
  "lessons.finish": { sk: "Dokončiť", en: "Finish", ua: "Завершити" },
  "lessons.correct": { sk: "Správne!", en: "Correct!", ua: "Правильно!" },
  "lessons.incorrect": { sk: "Nesprávne!", en: "Incorrect!", ua: "Неправильно!" },
  "lessons.completed": { sk: "Lekcia dokončená!", en: "Lesson completed!", ua: "Урок завершено!" },
  
  // Invest
  "invest.title": { sk: "Investície", en: "Investments", ua: "Інвестиції" },
  "invest.market": { sk: "Trh", en: "Market", ua: "Ринок" },
  "invest.portfolio": { sk: "Portfólio", en: "Portfolio", ua: "Портфоліо" },
  "invest.yourPortfolio": { sk: "Tvoje portfólio", en: "Your Portfolio", ua: "Твій портфоліо" },
  "invest.invested": { sk: "Investované", en: "Invested", ua: "Інвестовано" },
  "invest.value": { sk: "Hodnota", en: "Value", ua: "Вартість" },
  "invest.profitLoss": { sk: "Zisk/Strata", en: "Profit/Loss", ua: "Прибуток/Збиток" },
  "invest.all": { sk: "Všetko", en: "All", ua: "Все" },
  "invest.allInstruments": { sk: "Všetky inštrumenty", en: "All Instruments", ua: "Усі інструменти" },
  "invest.noInstruments": { sk: "Žiadne inštrumenty v tejto kategórii", en: "No instruments in this category", ua: "Немає інструментів у цій категорії" },
  "invest.noInvestments": { sk: "Zatiaľ nemáš žiadne investície", en: "No investments yet", ua: "Ще немає інвестицій" },
  "invest.goToMarket": { sk: "Prejsť na trh", en: "Go to Market", ua: "Перейти на ринок" },
  "invest.yourInvestments": { sk: "Tvoje investície", en: "Your Investments", ua: "Твої інвестиції" },
  "invest.loadingMarket": { sk: "Načítavam trh...", en: "Loading market...", ua: "Завантаження ринку..." },
  "invest.warning": { sk: "Toto je vzdelávacia hra, nie skutočné investovanie. V realite sú výnosy nepredvídateľné a môžeš stratiť celú investíciu.", en: "This is an educational game, not real investing. In reality, returns are unpredictable and you can lose your entire investment.", ua: "Це навчальна гра, а не реальне інвестування. В реальності прибутки непередбачувані і ви можете втратити всі інвестиції." },
  "invest.investAction": { sk: "Investovať", en: "Invest", ua: "Інвестувати" },
  "invest.withdraw": { sk: "Vybrať", en: "Withdraw", ua: "Вивести" },
  "invest.history": { sk: "História", en: "History", ua: "Історія" },
  "invest.startInvesting": { sk: "Prejdi na trh a začni investovať!", en: "Go to market and start investing!", ua: "Перейди на ринок та почни інвестувати!" },
  "invest.stocks": { sk: "Akcie", en: "Stocks", ua: "Акції" },
  "invest.crypto": { sk: "Krypto", en: "Crypto", ua: "Крипто" },
  "invest.funds": { sk: "Fondy", en: "Funds", ua: "Фонди" },
  "invest.commodities": { sk: "Komodity", en: "Commodities", ua: "Товари" },
  "invest.risk": { sk: "riziko", en: "risk", ua: "ризик" },
  "invest.deposited": { sk: "Vložené", en: "Deposited", ua: "Вкладено" },
  "invest.current": { sk: "Aktuálne", en: "Current", ua: "Поточне" },
  "invest.todayChart": { sk: "Dnešný vývoj", en: "Today's chart", ua: "Графік за сьогодні" },
  "invest.riskLabel": { sk: "Riziko", en: "Risk", ua: "Ризик" },
  "invest.historicalReturn": { sk: "Historický výnos", en: "Historical return", ua: "Історична прибутковість" },
  "invest.yourFince": { sk: "Tvoje Fince", en: "Your Fince", ua: "Твої Fince" },
  "invest.howMuchInvest": { sk: "Koľko mincí investuješ?", en: "How many coins to invest?", ua: "Скільки монет інвестуєте?" },
  "invest.howMuchWithdraw": { sk: "Koľko mincí chceš vybrať?", en: "How many coins to withdraw?", ua: "Скільки монет вивести?" },
  "invest.availableWithdraw": { sk: "Na výber", en: "Available", ua: "Доступно" },
  "invest.noInvestmentHere": { sk: "Nemáš žiadne investície v tejto akcii", en: "No investments in this stock", ua: "Немає інвестицій в цю акцію" },
  "invest.gameWarning": { sk: "Toto je hra, nie realita. V skutočnom svete sú investície oveľa zložitejšie a výnosy nie sú garantované.", en: "This is a game, not reality. In the real world, investments are much more complex and returns are not guaranteed.", ua: "Це гра, а не реальність. В реальному світі інвестиції набагато складніші і прибутки не гарантовані." },
  "invest.marketNews": { sk: "Trhové správy", en: "Market News", ua: "Ринкові новини" },
  "invest.yourTransactions": { sk: "Tvoje transakcie", en: "Your Transactions", ua: "Твої транзакції" },
  "invest.noTransactions": { sk: "Žiadne transakcie", en: "No transactions", ua: "Немає транзакцій" },
  
  // Profile
  "profile.changeName": { sk: "Zmeniť postavu", en: "Change Character", ua: "Змінити персонажа" },
  "profile.shop": { sk: "Obchod s doplnkami", en: "Cosmetics Shop", ua: "Магазин косметики" },
  "profile.totalXp": { sk: "Celkové XP", en: "Total XP", ua: "Загальний XP" },
  "profile.currentStreak": { sk: "Aktuálny streak", en: "Current Streak", ua: "Поточна серія" },
  "profile.longestStreak": { sk: "Najdlhší streak", en: "Longest Streak", ua: "Найдовша серія" },
  "profile.fince": { sk: "Fince", en: "Fince", ua: "Fince" },
  "profile.lives": { sk: "Životy", en: "Lives", ua: "Життя" },
  "profile.completedLessons": { sk: "Dokončené lekcie", en: "Completed Lessons", ua: "Завершені уроки" },
  "profile.avgScore": { sk: "Priemerné skóre", en: "Average Score", ua: "Середній бал" },
  "profile.badges": { sk: "Odznaky", en: "Badges", ua: "Нагороди" },
  "profile.days": { sk: "dní", en: "days", ua: "днів" },
  "profile.friends": { sk: "Priatelia", en: "Friends", ua: "Друзі" },
  "profile.addFriend": { sk: "Pridať", en: "Add", ua: "Додати" },
  "profile.noFriends": { sk: "Zatiaľ žiadni priatelia", en: "No friends yet", ua: "Поки немає друзів" },
  "profile.searchByName": { sk: "Hľadaj podľa mena...", en: "Search by name...", ua: "Пошук за ім'ям..." },
  "profile.search": { sk: "Hľadaj", en: "Search", ua: "Пошук" },
  "profile.selectCharacter": { sk: "Vyber si postavu", en: "Choose Character", ua: "Обери персонажа" },
  "profile.shopTitle": { sk: "Obchod", en: "Shop", ua: "Магазин" },
  "profile.dailyDiscount": { sk: "Denná zľava 20% na vybrané položky!", en: "Daily 20% discount on selected items!", ua: "Щоденна знижка 20% на вибрані товари!" },
  "profile.notEnoughFince": { sk: "Nemáš dosť Fincov!", en: "Not enough Fince!", ua: "Недостатньо Fince!" },
  "profile.purchased": { sk: "zakúpené!", en: "purchased!", ua: "придбано!" },
  "profile.unlockCosmetics": { sk: "Odomkni kozmetické prvky za mince", en: "Unlock cosmetic items for coins", ua: "Розблокуй косметику за монети" },
  "profile.financialPersonalities": { sk: "Finančné osobnosti", en: "Financial Personalities", ua: "Фінансові особистості" },
  "profile.marketSymbols": { sk: "Trhové symboly", en: "Market Symbols", ua: "Ринкові символи" },
  "profile.chooseYourCharacter": { sk: "Vyber si svoju postavu", en: "Choose your character", ua: "Обери свого персонажа" },
  "profile.hats": { sk: "🎩 Klobúky", en: "🎩 Hats", ua: "🎩 Капелюхи" },
  "profile.accessories": { sk: "💼 Doplnky", en: "💼 Accessories", ua: "💼 Аксесуари" },
  "profile.effects": { sk: "🎨 Efekty", en: "🎨 Effects", ua: "🎨 Ефекти" },
  
  // Leaderboard
  "leaderboard.title": { sk: "Rebríček", en: "Leaderboard", ua: "Рейтинг" },
  "leaderboard.subtitle": { sk: "Súťaž s ostatnými hráčmi", en: "Compete with other players", ua: "Змагайся з іншими гравцями" },
  "leaderboard.global": { sk: "Globálny", en: "Global", ua: "Глобальний" },
  "leaderboard.friends": { sk: "Priatelia", en: "Friends", ua: "Друзі" },
  "leaderboard.xp": { sk: "XP", en: "XP", ua: "XP" },
  "leaderboard.streak": { sk: "Séria", en: "Streak", ua: "Серія" },
  "leaderboard.lessons": { sk: "Lekcie", en: "Lessons", ua: "Уроки" },
  "leaderboard.yourPosition": { sk: "Tvoja pozícia", en: "Your position", ua: "Твоя позиція" },
  "leaderboard.score": { sk: "Skóre", en: "Score", ua: "Рахунок" },
  "leaderboard.loading": { sk: "Načítavam rebríček...", en: "Loading leaderboard...", ua: "Завантаження рейтингу..." },
  "leaderboard.noPlayers": { sk: "Zatiaľ žiadni hráči v rebríčku", en: "No players in leaderboard yet", ua: "Поки немає гравців у рейтингу" },
  "leaderboard.noFriends": { sk: "Zatiaľ nemáš žiadnych priateľov. Pridaj si ich v profile!", en: "No friends yet. Add them in your profile!", ua: "Поки немає друзів. Додай їх у профілі!" },
  "leaderboard.you": { sk: "(ty)", en: "(you)", ua: "(ти)" },
  "leaderboard.daysUnit": { sk: "dní", en: "days", ua: "днів" },
  "leaderboard.lessonsUnit": { sk: "lekcií", en: "lessons", ua: "уроків" },
  "leaderboard.viewProfile": { sk: "Zobraziť profil", en: "View Profile", ua: "Переглянути профіль" },
  
  // Study
  "study.title": { sk: "Učivo", en: "Study Material", ua: "Навчальний матеріал" },
  "study.subtitle": { sk: "Nauč sa základy pred lekciami", en: "Learn the basics before lessons", ua: "Вивчіть основи перед уроками" },
  "study.goToLessons": { sk: "Prejsť na lekcie", en: "Go to Lessons", ua: "Перейти до уроків" },
  "study.back": { sk: "Späť", en: "Back", ua: "Назад" },
  "study.areas": { sk: "oblastí", en: "areas", ua: "областей" },
  "study.topics": { sk: "tém", en: "topics", ua: "тем" },
  "study.selectArea": { sk: "Vyber si oblasť, ktorú chceš naštudovať pred lekciami 📖", en: "Choose an area to study before lessons 📖", ua: "Обери область для вивчення перед уроками 📖" },
  "study.example": { sk: "Príklad", en: "Example", ua: "Приклад" },
  "study.tip": { sk: "Tip", en: "Tip", ua: "Порада" },
  "study.goToLessonsArea": { sk: "Prejsť na lekcie z tejto oblasti", en: "Go to lessons from this area", ua: "Перейти до уроків з цієї області" },
  
  // Settings
  "settings.title": { sk: "Nastavenia", en: "Settings", ua: "Налаштування" },
  "settings.profile": { sk: "Profil", en: "Profile", ua: "Профіль" },
  "settings.email": { sk: "Email", en: "Email", ua: "Email" },
  "settings.name": { sk: "Meno", en: "Name", ua: "Ім'я" },
  "settings.setName": { sk: "Nastaviť meno", en: "Set name", ua: "Встановити ім'я" },
  "settings.save": { sk: "Uložiť", en: "Save", ua: "Зберегти" },
  "settings.nameUpdated": { sk: "Meno aktualizované!", en: "Name updated!", ua: "Ім'я оновлено!" },
  "settings.sound": { sk: "Zvuk", en: "Sound", ua: "Звук" },
  "settings.soundEffects": { sk: "Zvukové efekty", en: "Sound Effects", ua: "Звукові ефекти" },
  "settings.volume": { sk: "Hlasitosť", en: "Volume", ua: "Гучність" },
  "settings.appearance": { sk: "Vzhľad", en: "Appearance", ua: "Зовнішній вигляд" },
  "settings.light": { sk: "Svetlý", en: "Light", ua: "Світла" },
  "settings.dark": { sk: "Tmavý", en: "Dark", ua: "Темна" },
  "settings.notifications": { sk: "Notifikácie", en: "Notifications", ua: "Сповіщення" },
  "settings.pushNotifications": { sk: "Push notifikácie", en: "Push Notifications", ua: "Push сповіщення" },
  "settings.privacy": { sk: "Súkromie", en: "Privacy", ua: "Конфіденційність" },
  "settings.privacyText": { sk: "Tvoje dáta sú v bezpečí. Nezhromažďujeme osobné údaje nad rámec nevyhnutný na fungovanie aplikácie.", en: "Your data is safe. We do not collect personal data beyond what is necessary for the app to function.", ua: "Ваші дані в безпеці. Ми не збираємо особисті дані понад необхідне для роботи додатку." },
  "settings.language": { sk: "Jazyk", en: "Language", ua: "Мова" },
  "settings.resetProgress": { sk: "Reset progresu", en: "Reset Progress", ua: "Скидання прогресу" },
  "settings.resetDesc": { sk: "Vymaže sa: progres lekcií, investície, odznaky, kozmetika, Fince, XP, streak a rebríček.", en: "Will be deleted: lesson progress, investments, badges, cosmetics, Fince, XP, streak and leaderboard.", ua: "Буде видалено: прогрес уроків, інвестиції, нагороди, косметика, Fince, XP, серія та рейтинг." },
  "settings.resetAll": { sk: "Resetovať všetok progres", en: "Reset All Progress", ua: "Скинути весь прогрес" },
  "settings.resetConfirm": { sk: "Si si istý? Toto sa nedá vrátiť!", en: "Are you sure? This cannot be undone!", ua: "Ви впевнені? Це неможливо скасувати!" },
  "settings.cancel": { sk: "Zrušiť", en: "Cancel", ua: "Скасувати" },
  "settings.confirm": { sk: "Potvrdiť", en: "Confirm", ua: "Підтвердити" },
  "settings.resetting": { sk: "Resetujem...", en: "Resetting...", ua: "Скидання..." },
  "settings.resetSuccess": { sk: "Progres kompletne resetovaný!", en: "Progress completely reset!", ua: "Прогрес повністю скинуто!" },
  "settings.resetError": { sk: "Chyba pri resetovaní", en: "Error resetting", ua: "Помилка скидання" },
  "settings.signOut": { sk: "Odhlásiť sa", en: "Sign Out", ua: "Вийти" },
  "settings.admin": { sk: "Administrácia", en: "Administration", ua: "Адміністрація" },
  
  // Loading
  "loading.subtitle": { sk: "Nauč sa ovládať financie", en: "Learn to master finances", ua: "Навчись керувати фінансами" },
  
  // Common
  "common.close": { sk: "Zavrieť", en: "Close", ua: "Закрити" },
  "common.level": { sk: "Level", en: "Level", ua: "Рівень" },
  "common.loading": { sk: "Načítavam...", en: "Loading...", ua: "Завантаження..." },
  "common.toNextLevel": { sk: "XP do ďalšieho", en: "XP to next", ua: "XP до наступного" },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: "sk",
  setLanguage: () => {},
  t: (key) => key,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("finap-language");
    return (saved as Language) || "sk";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("finap-language", lang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.sk || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
