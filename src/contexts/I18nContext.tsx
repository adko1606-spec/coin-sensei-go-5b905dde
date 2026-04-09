import { createContext, useContext, useState, ReactNode } from "react";

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
  "invest.enterValidAmount": { sk: "Zadaj platnú sumu", en: "Enter a valid amount", ua: "Введіть дійсну суму" },
  "invest.notEnoughCoins": { sk: "Nemáš dostatok mincí", en: "Not enough coins", ua: "Недостатньо монет" },
  "invest.notEnoughInvested": { sk: "Nemáš toľko investovaných mincí", en: "Not enough invested coins", ua: "Недостатньо інвестованих монет" },
  "invest.investedMsg": { sk: "Investoval si", en: "You invested", ua: "Ви інвестували" },
  "invest.withdrawnMsg": { sk: "Vybral si", en: "You withdrew", ua: "Ви вивели" },
  "invest.finceInto": { sk: "Fincov do", en: "Fince into", ua: "Fince в" },
  "invest.finceFrom": { sk: "Fincov z", en: "Fince from", ua: "Fince з" },
  "invest.investError": { sk: "Chyba pri investovaní", en: "Error investing", ua: "Помилка інвестування" },
  "invest.withdrawError": { sk: "Chyba pri výbere", en: "Error withdrawing", ua: "Помилка виведення" },
  "invest.valueChanges": { sk: "Hodnota sa mení každú hodinu.", en: "Value changes every hour.", ua: "Вартість змінюється щогодини." },
  "invest.cryptoVolatile": { sk: "Krypto je veľmi volatilné – môžeš stratiť väčšinu investície!", en: "Crypto is very volatile – you can lose most of your investment!", ua: "Крипто дуже волатильне – ви можете втратити більшу частину інвестиції!" },
  "invest.riskyArea": { sk: "Táto oblasť je riziková – počítaj s výkyvmi.", en: "This area is risky – expect fluctuations.", ua: "Ця область ризикована – очікуйте коливання." },
  "invest.stableArea": { sk: "Stabilnejšie oblasti rastú pomalšie, ale sú bezpečnejšie.", en: "More stable areas grow slower but are safer.", ua: "Стабільніші області зростають повільніше, але безпечніші." },
  "invest.buyMarker": { sk: "Nákup", en: "Buy", ua: "Покупка" },
  "invest.topGainers": { sk: "Top rasty dňa 📈", en: "Top Gainers Today 📈", ua: "Топ зростання сьогодні 📈" },
  "invest.topLosers": { sk: "Top straty dňa 📉", en: "Top Losers Today 📉", ua: "Топ втрати сьогодні 📉" },

  // Gamification
  "game.streakWarning": { sk: "⚠️ Ak dnes neprídeš, stratíš streak bonus!", en: "⚠️ If you don't come today, you'll lose your streak bonus!", ua: "⚠️ Якщо сьогодні не прийдете, втратите бонус серії!" },
  "game.portfolioDown": { sk: "📉 Tvoje portfólio padá – reaguj!", en: "📉 Your portfolio is dropping – react!", ua: "📉 Ваш портфоліо падає – реагуйте!" },
  "game.missedGain": { sk: "Keby si investoval viac, máš", en: "If you had invested more, you'd have", ua: "Якби ви інвестували більше, мали б" },
  "game.secretReward": { sk: "🎁 Tajná odmena odomknutá!", en: "🎁 Secret reward unlocked!", ua: "🎁 Таємна нагорода розблокована!" },
  "game.bonusActivity": { sk: "⭐ Bonus za aktivitu dňa!", en: "⭐ Daily activity bonus!", ua: "⭐ Бонус за активність!" },
  "game.tapRace": { sk: "Tap Race", en: "Tap Race", ua: "Tap Race" },
  "game.tapRaceDesc": { sk: "Rýchla minihra – kupuj keď rastie, predaj keď padá!", en: "Quick minigame – buy when rising, sell when dropping!", ua: "Швидка мінігра – купуй коли зростає, продавай коли падає!" },
  "game.quickBattle": { sk: "⚡ Quick Battle", en: "⚡ Quick Battle", ua: "⚡ Швидка Битва" },
  "game.start": { sk: "Štart!", en: "Start!", ua: "Старт!" },
  "game.buy": { sk: "KÚPIŤ 📈", en: "BUY 📈", ua: "КУПИТИ 📈" },
  "game.sell": { sk: "PREDAŤ 📉", en: "SELL 📉", ua: "ПРОДАТИ 📉" },
  "game.score": { sk: "Skóre", en: "Score", ua: "Рахунок" },
  "game.timeUp": { sk: "Čas vypršal!", en: "Time's up!", ua: "Час вийшов!" },
  "game.yourScore": { sk: "Tvoje skóre", en: "Your score", ua: "Ваш рахунок" },
  "game.playAgain": { sk: "Hrať znova", en: "Play Again", ua: "Грати знову" },
  "game.reward": { sk: "Odmena", en: "Reward", ua: "Нагорода" },
  "game.identity": { sk: "Tvoja identita", en: "Your Identity", ua: "Ваша ідентичність" },
  "game.cautious": { sk: "🛡️ Opatrný investor", en: "🛡️ Cautious Investor", ua: "🛡️ Обережний інвестор" },
  "game.risktaker": { sk: "🔥 Risk taker", en: "🔥 Risk Taker", ua: "🔥 Ризикувальник" },
  "game.daytrader": { sk: "⚡ Day trader", en: "⚡ Day Trader", ua: "⚡ Денний трейдер" },
  "game.hodler": { sk: "💎 Hodler", en: "💎 Hodler", ua: "💎 Ходлер" },
  "game.diversifier": { sk: "🌐 Diverzifikátor", en: "🌐 Diversifier", ua: "🌐 Диверсифікатор" },
  "game.friendBeat": { sk: "ťa prekonal o", en: "beat you by", ua: "обійшов вас на" },

  // PvP
  "pvp.title": { sk: "Blitz Battle", en: "Blitz Battle", ua: "Blitz Battle" },
  "pvp.rating": { sk: "rating", en: "rating", ua: "рейтинг" },
  "pvp.wins": { sk: "Výhry", en: "Wins", ua: "Перемоги" },
  "pvp.losses": { sk: "Prehry", en: "Losses", ua: "Поразки" },
  "pvp.quickMatch": { sk: "Quick Match", en: "Quick Match", ua: "Швидкий матч" },
  "pvp.inviteFriend": { sk: "Pozvať kamaráta", en: "Invite Friend", ua: "Запросити друга" },
  "pvp.inviteSent": { sk: "Pozvánka odoslaná! ⚔️", en: "Invite sent! ⚔️", ua: "Запрошення відправлено! ⚔️" },
  "pvp.searching": { sk: "Hľadám súpera...", en: "Finding opponent...", ua: "Пошук суперника..." },
  "pvp.matchRange": { sk: "Rozsah", en: "Range", ua: "Діапазон" },
  "pvp.you": { sk: "Ty", en: "You", ua: "Ти" },
  "pvp.opponent": { sk: "Súper", en: "Opponent", ua: "Суперник" },
  "pvp.victory": { sk: "Víťazstvo! 🏆", en: "Victory! 🏆", ua: "Перемога! 🏆" },
  "pvp.defeat": { sk: "Prehra 💀", en: "Defeat 💀", ua: "Поразка 💀" },
  "pvp.correct": { sk: "správne", en: "correct", ua: "правильно" },
  "pvp.winStreak": { sk: "Win streak", en: "Win streak", ua: "Серія перемог" },
  "pvp.almostThere": { sk: "Chýbalo ti len málo... Skús to znova! 💪", en: "So close... Try again! 💪", ua: "Майже вдалося... Спробуй знову! 💪" },
  "pvp.playAgain": { sk: "Hrať znova", en: "Play Again", ua: "Грати знову" },
  "pvp.backToLobby": { sk: "Späť do lobby", en: "Back to Lobby", ua: "Назад до лобі" },
  "pvp.dailyReward": { sk: "Denná odmena za rank", en: "Daily Rank Reward", ua: "Щоденна нагорода за ранг" },
  "pvp.perDay": { sk: "denne", en: "per day", ua: "за день" },
  "pvp.winRate": { sk: "Win rate", en: "Win Rate", ua: "% перемог" },
  "pvp.streak": { sk: "Séria", en: "Streak", ua: "Серія" },
  "pvp.best": { sk: "Najlepší", en: "Best", ua: "Найкращий" },
  "pvp.rankLadder": { sk: "Rebríček rankov", en: "Rank Ladder", ua: "Драбина рангів" },

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
  "profile.noFriendsHint": { sk: "Použi tlačidlo Pridať a nájdi kamarátov", en: "Use the Add button to find friends", ua: "Використай кнопку Додати щоб знайти друзів" },
  "profile.searchByName": { sk: "Hľadaj podľa mena...", en: "Search by name...", ua: "Пошук за ім'ям..." },
  "profile.search": { sk: "Hľadaj", en: "Search", ua: "Пошук" },
  "profile.searching": { sk: "Hľadám...", en: "Searching...", ua: "Пошук..." },
  "profile.noResults": { sk: "Žiadne výsledky", en: "No results", ua: "Немає результатів" },
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
  "profile.houses": { sk: "🏠 Domy", en: "🏠 Houses", ua: "🏠 Будинки" },
  "profile.cars": { sk: "🚗 Autá", en: "🚗 Cars", ua: "🚗 Автомобілі" },
  "profile.yourEstate": { sk: "Tvoj majetok", en: "Your Estate", ua: "Твоє майно" },
  "profile.equip": { sk: "Nasadiť", en: "Equip", ua: "Одягнути" },
  "profile.unequip": { sk: "Zložiť", en: "Unequip", ua: "Зняти" },
  "profile.active": { sk: "Aktívne", en: "Active", ua: "Активне" },
  "profile.owned": { sk: "Vlastníš", en: "Owned", ua: "Маєте" },
  "profile.friendsAlready": { sk: "Priatelia ✓", en: "Friends ✓", ua: "Друзі ✓" },
  "profile.pending": { sk: "Čaká sa...", en: "Pending...", ua: "Очікується..." },
  "profile.addFriendBtn": { sk: "+ Pridať", en: "+ Add", ua: "+ Додати" },
  "profile.friendRequests": { sk: "Žiadosti o priateľstvo", en: "Friend Requests", ua: "Запити на дружбу" },
  "profile.wantsToBeFriend": { sk: "Chce byť tvoj priateľ", en: "Wants to be your friend", ua: "Хоче бути твоїм другом" },
  "profile.requestSent": { sk: "Žiadosť o priateľstvo odoslaná! 🤝", en: "Friend request sent! 🤝", ua: "Запит на дружбу відправлено! 🤝" },
  "profile.requestAlreadySent": { sk: "Žiadosť už bola odoslaná", en: "Request already sent", ua: "Запит вже відправлено" },
  "profile.requestError": { sk: "Chyba pri odoslaní žiadosti", en: "Error sending request", ua: "Помилка відправки запиту" },
  "profile.friendAccepted": { sk: "Priateľstvo prijaté! 🎉", en: "Friendship accepted! 🎉", ua: "Дружбу прийнято! 🎉" },
  "profile.requestDeclined": { sk: "Žiadosť odmietnutá", en: "Request declined", ua: "Запит відхилено" },
  "profile.friendRemoved": { sk: "Priateľ odstránený", en: "Friend removed", ua: "Друга видалено" },
  "profile.player": { sk: "Hráč", en: "Player", ua: "Гравець" },

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
  "settings.wrongPassword": { sk: "Nesprávne heslo", en: "Wrong password", ua: "Невірний пароль" },
  "settings.users": { sk: "Používatelia", en: "Users", ua: "Користувачі" },
  "settings.active": { sk: "Aktívni", en: "Active", ua: "Активні" },
  "settings.totalLessons": { sk: "Lekcie celkom", en: "Total Lessons", ua: "Уроків загалом" },
  "settings.totalXp": { sk: "XP celkom", en: "Total XP", ua: "XP загалом" },
  "settings.recentUsers": { sk: "Poslední používatelia", en: "Recent Users", ua: "Останні користувачі" },

  // Quiz
  "quiz.noLives": { sk: "Žiadne životy!", en: "No lives!", ua: "Немає життів!" },
  "quiz.waitForLives": { sk: "Počkaj na regeneráciu alebo sa vráť neskôr.", en: "Wait for regeneration or come back later.", ua: "Зачекайте на відновлення або поверніться пізніше." },
  "quiz.perfect": { sk: "Perfektné! ⭐", en: "Perfect! ⭐", ua: "Ідеально! ⭐" },
  "quiz.excellent": { sk: "Výborne! 🎉", en: "Excellent! 🎉", ua: "Чудово! 🎉" },
  "quiz.correctAnswers": { sk: "Správne odpovede", en: "Correct answers", ua: "Правильні відповіді" },
  "quiz.lostLife": { sk: "Stratil si život", en: "You lost a life", ua: "Ви втратили життя" },
  "quiz.errors": { sk: "chýb", en: "errors", ua: "помилок" },
  "quiz.notPerfectHint": { sk: "Lekcia bude označená červenou, kým ju nesplníš bez chyby.", en: "Lesson will be marked red until you complete it without errors.", ua: "Урок буде позначений червоним, доки не пройдете без помилок." },
  "quiz.continue": { sk: "Pokračovať", en: "Continue", ua: "Продовжити" },
  "quiz.confirmAnswer": { sk: "Potvrdiť odpoveď", en: "Confirm answer", ua: "Підтвердити відповідь" },
  "quiz.correctAnswer": { sk: "Správna odpoveď", en: "Correct answer", ua: "Правильна відповідь" },
  "quiz.confirmOrder": { sk: "Potvrdiť poradie", en: "Confirm order", ua: "Підтвердити порядок" },
  "quiz.dragHint": { sk: "Pretiahni položky do správneho poradia ↕️", en: "Drag items into the correct order ↕️", ua: "Перетягніть елементи у правильному порядку ↕️" },
  "quiz.nextQuestion": { sk: "Ďalšia otázka", en: "Next Question", ua: "Наступне питання" },
  "quiz.finish": { sk: "Dokončiť", en: "Finish", ua: "Завершити" },
  "quiz.correct": { sk: "✅ Správne!", en: "✅ Correct!", ua: "✅ Правильно!" },
  "quiz.incorrect": { sk: "❌ Nesprávne", en: "❌ Incorrect", ua: "❌ Неправильно" },
  "quiz.askAI": { sk: "Opýtaj sa AI na vysvetlenie", en: "Ask AI for explanation", ua: "Запитайте AI пояснення" },
  "quiz.choice": { sk: "📝 Výber", en: "📝 Choice", ua: "📝 Вибір" },
  "quiz.trueFalse": { sk: "✅❌ Pravda/Nepravda", en: "✅❌ True/False", ua: "✅❌ Правда/Неправда" },
  "quiz.slider": { sk: "🎚️ Odhad", en: "🎚️ Estimate", ua: "🎚️ Оцінка" },
  "quiz.order": { sk: "↕️ Zoraď", en: "↕️ Sort", ua: "↕️ Сортуй" },
  "quiz.true": { sk: "Pravda", en: "True", ua: "Правда" },
  "quiz.false": { sk: "Nepravda", en: "False", ua: "Неправда" },

  // Auth
  "auth.login": { sk: "Prihlásenie", en: "Login", ua: "Вхід" },
  "auth.register": { sk: "Registrácia", en: "Register", ua: "Реєстрація" },
  "auth.name": { sk: "Meno", en: "Name", ua: "Ім'я" },
  "auth.email": { sk: "Email", en: "Email", ua: "Email" },
  "auth.password": { sk: "Heslo", en: "Password", ua: "Пароль" },
  "auth.signIn": { sk: "Prihlásiť sa", en: "Sign In", ua: "Увійти" },
  "auth.signUp": { sk: "Zaregistrovať sa", en: "Sign Up", ua: "Зареєструватися" },
  "auth.loading": { sk: "Načítavam...", en: "Loading...", ua: "Завантаження..." },
  "auth.or": { sk: "ALEBO", en: "OR", ua: "АБО" },
  "auth.googleContinue": { sk: "Pokračovať cez Google", en: "Continue with Google", ua: "Продовжити з Google" },
  "auth.appleContinue": { sk: "Pokračovať cez Apple", en: "Continue with Apple", ua: "Продовжити з Apple" },
  "auth.subtitle": { sk: "Nauč sa ovládať svoje financie", en: "Learn to master your finances", ua: "Навчись керувати своїми фінансами" },
  "auth.registerSuccess": { sk: "Registrácia úspešná! Skontroluj si email na potvrdenie.", en: "Registration successful! Check your email for confirmation.", ua: "Реєстрація успішна! Перевірте email для підтвердження." },

  // Onboarding
  "onboarding.welcome": { sk: "Vitaj vo FinAp!", en: "Welcome to FinAp!", ua: "Ласкаво просимо до FinAp!" },
  "onboarding.tellUsAbout": { sk: "Povieme si o tebe niečo 😊", en: "Tell us something about yourself 😊", ua: "Розкажіть нам про себе 😊" },
  "onboarding.howOld": { sk: "Koľko máš rokov?", en: "How old are you?", ua: "Скільки вам років?" },
  "onboarding.knowledge": { sk: "Aké sú tvoje finančné znalosti?", en: "What's your financial knowledge?", ua: "Які ваші фінансові знання?" },
  "onboarding.work": { sk: "Aká je tvoja pracovná situácia?", en: "What's your work situation?", ua: "Яка ваша робоча ситуація?" },
  "onboarding.interest": { sk: "Čo ťa najviac zaujíma?", en: "What interests you the most?", ua: "Що вас найбільше цікавить?" },
  "onboarding.beginner": { sk: "Začiatočník 🌱", en: "Beginner 🌱", ua: "Початківець 🌱" },
  "onboarding.intermediate": { sk: "Mierne pokročilý 📚", en: "Intermediate 📚", ua: "Середній рівень 📚" },
  "onboarding.advanced": { sk: "Pokročilý 🎓", en: "Advanced 🎓", ua: "Просунутий 🎓" },
  "onboarding.expert": { sk: "Expert 💎", en: "Expert 💎", ua: "Експерт 💎" },
  "onboarding.student": { sk: "Študent 📖", en: "Student 📖", ua: "Студент 📖" },
  "onboarding.employed": { sk: "Zamestnaný 💼", en: "Employed 💼", ua: "Працюючий 💼" },
  "onboarding.entrepreneur": { sk: "Podnikateľ 🚀", en: "Entrepreneur 🚀", ua: "Підприємець 🚀" },
  "onboarding.other": { sk: "Iné", en: "Other", ua: "Інше" },
  "onboarding.savingMoney": { sk: "Šetrenie peňazí 🐷", en: "Saving money 🐷", ua: "Заощадження грошей 🐷" },
  "onboarding.investingMoney": { sk: "Investovanie 📈", en: "Investing 📈", ua: "Інвестування 📈" },
  "onboarding.budgeting": { sk: "Rozpočtovanie 💰", en: "Budgeting 💰", ua: "Бюджетування 💰" },
  "onboarding.everything": { sk: "Všetko 🌟", en: "Everything 🌟", ua: "Все 🌟" },
  "onboarding.chooseCharacter": { sk: "Vyber si postavu 🎭", en: "Choose a character 🎭", ua: "Обери персонажа 🎭" },
  "onboarding.next": { sk: "Ďalej", en: "Next", ua: "Далі" },
  "onboarding.startPlaying": { sk: "Začať hrať!", en: "Start playing!", ua: "Почати гру!" },
  "onboarding.character": { sk: "Postava", en: "Character", ua: "Персонаж" },

  // Challenges
  "challenge.completed": { sk: "Splnené ✓", en: "Completed ✓", ua: "Виконано ✓" },
  "challenge.bronze": { sk: "🥉 Bronzová", en: "🥉 Bronze", ua: "🥉 Бронзова" },
  "challenge.silver": { sk: "🥈 Strieborná", en: "🥈 Silver", ua: "🥈 Срібна" },
  "challenge.gold": { sk: "🥇 Zlatá", en: "🥇 Gold", ua: "🥇 Золота" },

  // Daily tips (keys for localized tips)
  "tip.5030201": { sk: "Pravidlo 50/30/20: 50 % príjmu na potreby, 30 % na želania, 20 % na úspory a investície.", en: "The 50/30/20 rule: 50% of income for needs, 30% for wants, 20% for savings and investments.", ua: "Правило 50/30/20: 50% доходу на потреби, 30% на бажання, 20% на заощадження та інвестиції." },

  // AI Chat
  "ai.help": { sk: "AI Pomoc", en: "AI Help", ua: "AI Допомога" },
  "ai.explainQuestion": { sk: "Vysvetli túto otázku", en: "Explain this question", ua: "Поясніть це питання" },
  "ai.whyCorrect": { sk: "Prečo je to správna odpoveď?", en: "Why is this the correct answer?", ua: "Чому це правильна відповідь?" },
  "ai.realExample": { sk: "Daj mi príklad z praxe", en: "Give me a real-world example", ua: "Наведіть приклад з практики" },
  "ai.askPlaceholder": { sk: "Opýtaj sa...", en: "Ask...", ua: "Запитайте..." },
  "ai.connectionError": { sk: "Nepodarilo sa spojiť s AI.", en: "Failed to connect to AI.", ua: "Не вдалося з'єднатися з AI." },
  "ai.chatGreeting": { sk: "Ahoj! 👋 Som FinAp AI asistent. Opýtaj sa ma čokoľvek o financiách! 💰", en: "Hi! 👋 I'm the FinAp AI assistant. Ask me anything about finance! 💰", ua: "Привіт! 👋 Я FinAp AI асистент. Запитайте мене будь-що про фінанси! 💰" },
  "ai.writeMsgPlaceholder": { sk: "Napíš správu...", en: "Write a message...", ua: "Напишіть повідомлення..." },
  "ai.systemPrompt": { sk: "Pomáhaš študentovi pochopiť finančnú otázku z kvízu.", en: "You are helping a student understand a financial quiz question.", ua: "Ви допомагаєте студенту зрозуміти фінансове питання з вікторини." },

  // Investment Demo
  "demo.title": { sk: "Demo investovanie", en: "Demo Investment", ua: "Демо інвестування" },
  "demo.subtitle": { sk: "Pozri sa, ako funguje zložené úročenie. Pohybuj posuvníkmi a sleduj, ako rastie tvoja investícia!", en: "See how compound interest works. Move the sliders and watch your investment grow!", ua: "Подивіться, як працюють складні відсотки. Рухайте повзунки та спостерігайте, як зростають ваші інвестиції!" },
  "demo.finalValue": { sk: "Konečná hodnota", en: "Final Value", ua: "Кінцева вартість" },
  "demo.totalInvested": { sk: "Investované", en: "Invested", ua: "Інвестовано" },
  "demo.profit": { sk: "Zisk", en: "Profit", ua: "Прибуток" },
  "demo.duration": { sk: "Dĺžka investície", en: "Investment Duration", ua: "Тривалість інвестиції" },
  "demo.years": { sk: "rokov", en: "years", ua: "років" },
  "demo.monthlyAmount": { sk: "Mesačná suma", en: "Monthly Amount", ua: "Місячна сума" },
  "demo.annualReturn": { sk: "Ročný výnos", en: "Annual Return", ua: "Річний дохід" },
  "demo.compoundTip": { sk: "Zložené úročenie je najsilnejší nástroj investora. Tvoje zisky generujú ďalšie zisky, a tak investícia rastie exponenciálne. Čím skôr začneš investovať, tým viac na tom zarobíš!", en: "Compound interest is the most powerful tool for investors. Your profits generate more profits, so your investment grows exponentially. The sooner you start investing, the more you'll earn!", ua: "Складні відсотки – найпотужніший інструмент інвестора. Ваші прибутки генерують нові прибутки, тому інвестиція зростає експоненціально. Чим раніше почнете інвестувати, тим більше заробите!" },
  "demo.year": { sk: "Rok", en: "Year", ua: "Рік" },
  "demo.value": { sk: "Hodnota", en: "Value", ua: "Вартість" },

  // Challenge rewards
  "challenge.rewardClaimed": { sk: "Odmena za výzvu získaná", en: "Challenge reward claimed", ua: "Нагороду за завдання отримано" },

  // Categories (for lessons filter)
  "cat.all": { sk: "Všetko", en: "All", ua: "Все" },
  "cat.basics": { sk: "Základy", en: "Basics", ua: "Основи" },
  "cat.saving": { sk: "Šetrenie", en: "Saving", ua: "Заощадження" },
  "cat.investing": { sk: "Investovanie", en: "Investing", ua: "Інвестування" },
  "cat.budgeting": { sk: "Rozpočet", en: "Budget", ua: "Бюджет" },
  "cat.crypto": { sk: "Krypto", en: "Crypto", ua: "Крипто" },
  "cat.taxes": { sk: "Dane", en: "Taxes", ua: "Податки" },
  "cat.legal": { sk: "Právo", en: "Law", ua: "Право" },
  "cat.insurance": { sk: "Poistenie", en: "Insurance", ua: "Страхування" },

  // Study categories
  "studyCat.basics": { sk: "Základy peňazí", en: "Money Basics", ua: "Основи грошей" },
  "studyCat.saving": { sk: "Šetrenie", en: "Saving", ua: "Заощадження" },
  "studyCat.investing": { sk: "Investovanie", en: "Investing", ua: "Інвестування" },
  "studyCat.budgeting": { sk: "Rozpočet", en: "Budget", ua: "Бюджет" },
  "studyCat.crypto": { sk: "Kryptomeny", en: "Cryptocurrencies", ua: "Криптовалюти" },
  "studyCat.taxes": { sk: "Dane", en: "Taxes", ua: "Податки" },
  "studyCat.legal": { sk: "Právo", en: "Law", ua: "Право" },
  "studyCat.insurance": { sk: "Poistenie", en: "Insurance", ua: "Страхування" },

  // Loading
  "loading.subtitle": { sk: "Nauč sa ovládať financie", en: "Learn to master finances", ua: "Навчись керувати фінансами" },

  // Common
  "common.close": { sk: "Zavrieť", en: "Close", ua: "Закрити" },
  "common.level": { sk: "Level", en: "Level", ua: "Рівень" },
  "common.loading": { sk: "Načítavam...", en: "Loading...", ua: "Завантаження..." },
  "common.toNextLevel": { sk: "XP do ďalšieho", en: "XP to next", ua: "XP до наступного" },
  "common.price": { sk: "Cena", en: "Price", ua: "Ціна" },
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
