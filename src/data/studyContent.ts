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

export const studyContent: StudyCategory[] = [
  {
    id: "basics",
    name: "Základy peňazí",
    emoji: "📚",
    description: "Pochop, čo sú peniaze, ako fungujú a prečo sú dôležité v každodennom živote.",
    topics: [
      {
        id: "basics-1",
        title: "Čo sú peniaze?",
        content: "Peniaze sú prostriedok výmeny, ktorý používame na nákup tovarov a služieb. Majú tri základné funkcie: prostriedok výmeny, uchovávateľ hodnoty a účtovná jednotka. Na Slovensku používame euro (€), ktoré vydáva Európska centrálna banka.",
        example: "Keď si kúpiš rohlík za 0,10 €, peniaze slúžia ako prostriedok výmeny – nemusíš pekárovi ponúkať niečo iné výmenou.",
        tip: "Peniaze nemajú hodnotu samy o sebe – ich hodnota závisí od dôvery ľudí v systém."
      },
      {
        id: "basics-2",
        title: "Inflácia a kúpna sila",
        content: "Inflácia je postupný rast cien tovarov a služieb. Keď inflácia rastie, za rovnakú sumu peňazí si kúpiš menej. Preto je dôležité, aby tvoje úspory rástli rýchlejšie ako inflácia.",
        example: "Ak inflácia je 5 % ročne a tvoj zmrzlinový kornútok stojí 1 €, o rok bude stáť 1,05 €. Za 100 € si kúpiš menej zmrzlín.",
        tip: "Priemerná inflácia v eurozóne je okolo 2 % ročne – preto je dôležité investovať, nie len šetriť."
      },
      {
        id: "basics-3",
        title: "HDP a ekonomika",
        content: "HDP (hrubý domáci produkt) meria celkovú hodnotu všetkých tovarov a služieb vyprodukovaných v krajine za rok. Je to hlavný ukazovateľ ekonomického zdravia krajiny. Keď HDP rastie, ekonomika sa darí.",
        example: "Slovenské HDP v roku 2023 bolo približne 115 miliárd €. To zahŕňa všetko od výroby áut až po služby kaderníctiev.",
      },
      {
        id: "basics-4",
        title: "Likvidita aktív",
        content: "Likvidita vyjadruje, ako rýchlo môžeš premeniť aktívum na hotovosť bez straty hodnoty. Hotovosť je najlikvidnejšie aktívum. Nehnuteľnosti sú menej likvidné – ich predaj trvá mesiace.",
        example: "Peniaze na bežnom účte = vysoká likvidita. Byt v Bratislave = nízka likvidita (predaj môže trvať aj pol roka).",
        tip: "Vždy maj časť peňazí v likvidnej forme pre nečakané výdavky."
      },
      {
        id: "basics-5",
        title: "Centrálna banka a menová politika",
        content: "Európska centrálna banka (ECB) riadi menovú politiku eurozóny. Jej hlavný nástroj sú úrokové sadzby – keď ich zvýši, pôžičky sú drahšie a ľudia menej míňajú, čo spomaľuje infláciu. Keď ich zníži, ekonomiku stimuluje.",
        example: "V roku 2022-2023 ECB výrazne zvýšila úroky z 0 % na 4,5 %, aby zabránila vysokej inflácii po pandémii.",
        tip: "Sleduj rozhodnutia ECB – ovplyvňujú hypotéky, úvery aj výnosy z úspor."
      },
      {
        id: "basics-6",
        title: "Devízové kurzy",
        content: "Devízový kurz je cena jednej meny vyjadrená v inej mene. Ovplyvňuje ceny dovozu a vývozu. Silné euro znamená lacnejší dovoz, ale drahší vývoz pre slovenské firmy.",
        example: "Ak 1 € = 1,10 $, slovenský výrobca dostane za svoj tovar v USA menej eur. Naopak, americký iPhone je pre nás lacnejší.",
      },
      {
        id: "basics-7",
        title: "Bankové účty a ich typy",
        content: "Bežný účet slúži na každodenné transakcie. Sporiaci účet ponúka vyšší úrok, ale obmedzený prístup. Termínovaný vklad uzamkne peniaze na dobu s garantovaným úrokom. Každý typ má svoje využitie.",
        example: "Bežný účet: 0-0,1 % úrok, okamžitý prístup. Sporiaci: 1-3 % úrok, výber do 1-2 dní. Termínovaný: 3-4 % úrok, peniaze uzamknuté na 1-3 roky.",
        tip: "Ideálna kombinácia: bežný účet na výdavky + sporiaci na núdzový fond + termínovaný/investície na dlhodobé ciele."
      },
      {
        id: "basics-8",
        title: "Finančná gramotnosť a jej význam",
        content: "Finančná gramotnosť je schopnosť rozumieť financiám a robiť informované rozhodnutia. Zahŕňa pochopenie rozpočtovania, sporenia, investovania a dlhov. Slovensko patrí medzi krajiny s nižšou finančnou gramotnosťou v EÚ.",
        tip: "Finančné vzdelávanie je celoživotný proces. Čím skôr začneš, tým lepšie rozhodnutia budeš robiť."
      },
    ],
  },
  {
    id: "saving",
    name: "Šetrenie",
    emoji: "🐷",
    description: "Nauč sa efektívne šetriť a budovať si finančnú rezervu na neočakávané situácie.",
    topics: [
      {
        id: "saving-1",
        title: "Pravidlo 50/30/20",
        content: "Jedno z najobľúbenejších pravidiel pre správu financií: 50 % príjmu na potreby (bývanie, jedlo), 30 % na chcenie (zábava, oblečenie) a 20 % na úspory a splácanie dlhov.",
        example: "Ak zarábaš 1 000 € mesačne: 500 € na nájom a jedlo, 300 € na zábavu, 200 € na sporiaci účet.",
        tip: "Začni s akýmkoľvek percentom – aj 5 % je lepšie ako nič!"
      },
      {
        id: "saving-2",
        title: "Núdzový fond",
        content: "Núdzový fond je finančná rezerva na neočakávané výdavky – oprava auta, zdravotný problém, strata práce. Odborníci odporúčajú mať odložené 3-6 mesačných výdavkov.",
        example: "Ak tvoje mesačné výdavky sú 800 €, cieľový núdzový fond by mal byť 2 400 – 4 800 €.",
        tip: "Drž núdzový fond na sporiacom účte s rýchlym prístupom – nie v akciách ani kryptomenách."
      },
      {
        id: "saving-3",
        title: "Automatické sporenie",
        content: "Nastav si trvalý príkaz, ktorý hneď po výplate prevedie časť peňazí na sporiaci účet. Takto šetríš automaticky, bez toho aby si na to musel myslieť.",
        example: "Každý 1. v mesiaci sa automaticky prevedie 100 € z bežného na sporiaci účet.",
        tip: "\"Zaplať najprv sebe\" – šetri hneď po výplate, nie až to, čo zostane na konci mesiaca."
      },
      {
        id: "saving-4",
        title: "Sila zloženého úročenia",
        content: "Zložené úročenie znamená, že získavaš úroky aj z predchádzajúcich úrokov. Čím skôr začneš šetriť, tým viac ti peniaze narastú. Einstein to nazval \"ôsmym divom sveta\".",
        example: "1 000 € s 5 % ročným úrokom: po 10 rokoch = 1 629 €, po 30 rokoch = 4 322 €! Úroky zarábajú ďalšie úroky.",
        tip: "Začni šetriť čo najskôr – čas je tvoj najväčší spojenec pri budovaní bohatstva."
      },
      {
        id: "saving-5",
        title: "Dobré vs. zlé dlhy",
        content: "Nie každý dlh je zlý. Dobrý dlh ti pomáha budovať hodnotu (hypotéka, vzdelanie). Zlý dlh financuje konzum (kreditná karta, spotrebný úver). Kľúčové je rozlišovať a minimalizovať zlé dlhy.",
        example: "Dobrý dlh: hypotéka na byt, ktorý rastie na hodnote. Zlý dlh: kreditná karta na dovolenku s 20 % úrokom.",
        tip: "Ak máš dlhy, najprv splať tie s najvyšším úrokom – ušetríš najviac peňazí."
      },
      {
        id: "saving-6",
        title: "Metóda snehovej gule na splácanie dlhov",
        content: "Zoraď dlhy od najmenšieho po najväčší. Splácaj minimum na všetkých, ale extra peniaze dávaj na najmenší dlh. Keď ho splatíš, presuň všetko na ďalší. Malé víťazstvá ťa motivujú pokračovať.",
        example: "Dlh A: 300 € (min. 30 €), Dlh B: 1 000 € (min. 50 €), Dlh C: 5 000 € (min. 100 €). Splať najprv A, potom peniaze z A pridaj k B.",
      },
      {
        id: "saving-7",
        title: "Finančné ciele a ich plánovanie",
        content: "Rozdeľ ciele na krátkodobé (do 1 roka), strednodobé (1-5 rokov) a dlhodobé (5+ rokov). Pre každý cieľ urči sumu, termín a mesačnú úložku. SMART ciele sú konkrétne, merateľné a časovo ohraničené.",
        example: "Krátkodobý: nový telefón za 500 € o 5 mesiacov = 100 €/mesiac. Dlhodobý: záloha na byt 20 000 € o 5 rokov = 333 €/mesiac.",
        tip: "Vizualizuj si ciele – vytlač si obrázok toho, na čo šetríš, a daj si ho na viditeľné miesto."
      },
      {
        id: "saving-8",
        title: "Psychológia míňania",
        content: "Naše nákupné rozhodnutia ovplyvňujú emócie, marketing a sociálny tlak. Impulzívne nákupy, FOMO a \"lifestyle inflation\" sú najčastejšie pasce. Uvedomenie si týchto vzorcov je prvý krok k ich prekonaniu.",
        example: "Zľava 50 % na vec, ktorú nepotrebuješ, nie je úspora – je to výdavok. Pred nákupom počkaj 24 hodín.",
        tip: "Pred každým nákupom nad 50 € sa spýtaj: \"Potrebujem to, alebo to len chcem?\" Počkaj 48 hodín."
      },
    ],
  },
  {
    id: "investing",
    name: "Investovanie",
    emoji: "📈",
    description: "Objavuj svet investícií – od akcií cez dlhopisy až po ETF fondy.",
    topics: [
      {
        id: "investing-1",
        title: "Čo je investovanie?",
        content: "Investovanie je vkladanie peňazí do aktív s cieľom dosiahnuť zisk v budúcnosti. Na rozdiel od sporenia, investovanie prináša vyšší potenciálny výnos, ale aj vyššie riziko.",
        example: "Kúpiš si akciu firmy Apple za 150 €. O rok ju predáš za 180 € – zarobil si 30 € (20 % výnos).",
        tip: "Nikdy neinvestuj peniaze, ktoré budeš potrebovať v najbližších 3-5 rokoch."
      },
      {
        id: "investing-2",
        title: "Akcie vs. dlhopisy",
        content: "Akcie sú podiel vo firme – keď firma rastie, rastie aj hodnota tvojich akcií. Dlhopisy sú pôžička štátu alebo firme – dostávaš pravidelné úroky. Akcie sú rizikovejšie, ale dlhodobo výnosnejšie.",
        example: "Slovenské štátne dlhopisy ponúkajú okolo 3 % ročne. Globálne akcie historicky prinášajú priemerne 7-10 % ročne.",
      },
      {
        id: "investing-3",
        title: "ETF fondy",
        content: "ETF (Exchange Traded Fund) je fond, ktorý sleduje celý index alebo sektor. Namiesto kupovanie jednotlivých akcií investuješ do stoviek firiem naraz. Je to jednoduchý a lacný spôsob diverzifikácie.",
        example: "S&P 500 ETF sleduje 500 najväčších amerických firiem. Jedným nákupom vlastníš kúsok Apple, Google, Amazon aj ďalších.",
        tip: "Pre začiatočníkov sú ETF fondy ideálna voľba – nízke poplatky a široká diverzifikácia."
      },
      {
        id: "investing-4",
        title: "Diverzifikácia",
        content: "Diverzifikácia znamená rozloženie investícií do rôznych aktív. Cieľom je znížiť riziko – ak jedna investícia klesne, iné to môžu vykompenzovať. \"Nedávaj všetky vajcia do jedného košíka.\"",
        example: "Namiesto kúpy akcií jednej firmy investuj do ETF, ktoré obsahuje stovky firiem z rôznych odvetví a krajín.",
        tip: "Diverzifikuj nielen medzi akciami, ale aj medzi triedami aktív – akcie, dlhopisy, nehnuteľnosti."
      },
      {
        id: "investing-5",
        title: "Riziko a výnos",
        content: "Vyšší potenciálny výnos vždy znamená vyššie riziko. Bezrizikové investície (štátne dlhopisy) prinášajú nízky výnos. Rizikové (akcie malých firiem, krypto) môžu priniesť veľké zisky aj straty. Tvoj rizikový profil závisí od veku, cieľov a tolerancie.",
        example: "Sporiaci účet: 1-3 % ročne, takmer nulové riziko. Akcie technologických firiem: 15-30 % ročne, ale aj -40 % v zlom roku.",
        tip: "Čím si mladší, tým viac rizika si môžeš dovoliť – máš čas na zotavenie z poklesov."
      },
      {
        id: "investing-6",
        title: "Dollar-Cost Averaging (DCA)",
        content: "DCA je stratégia, pri ktorej pravidelne investuješ rovnakú sumu bez ohľadu na cenu. Keď je trh dole, kúpiš viac kusov. Keď je hore, menej. Dlhodobo ti to dá dobrú priemernú cenu a eliminuje emócie z investovania.",
        example: "Každý mesiac investuješ 100 € do ETF. V januári kúpiš za 50 € (2 ks), vo februári za 40 € (2,5 ks), v marci za 55 € (1,8 ks). Priemer: 47,6 € za kus.",
        tip: "DCA je ideálne pre začiatočníkov – nemusíš časovať trh, stačí byť disciplinovaný."
      },
      {
        id: "investing-7",
        title: "Podielové fondy",
        content: "Podielové fondy spravuje profesionálny manažér, ktorý vyberá investície za teba. Sú drahšie ako ETF (poplatky 1-3 % ročne), ale vhodné pre tých, čo nechcú aktívne investovať. Existujú akciové, dlhopisové a zmiešané fondy.",
        example: "Slovenský akciový fond môže mať vstupný poplatok 3 % a ročný poplatok 1,5 %. Na 10 000 € investícii to je 150 € ročne navyše oproti ETF.",
      },
      {
        id: "investing-8",
        title: "Nehnuteľnosti ako investícia",
        content: "Investovanie do nehnuteľností môže byť kúpa bytu na prenájom alebo investícia cez REIT fondy. Výhody: pasívny príjem z nájmu, rast hodnoty. Nevýhody: vysoký vstupný kapitál, nízka likvidita, údržba.",
        example: "Byt za 150 000 € s nájmom 600 €/mesiac = 4,8 % ročný výnos (bez nákladov). REIT fond ti dá expozíciu na nehnuteľnosti už od 50 €.",
        tip: "Ak nemáš na celý byt, REIT fondy ti umožnia investovať do nehnuteľností s malou sumou a vysokou likviditou."
      },
      {
        id: "investing-9",
        title: "Kedy predať investíciu?",
        content: "Predávaj keď: dosiahneš cieľ, zmenia sa fundamenty firmy, potrebuješ peniaze na dôležitý cieľ, alebo potrebuješ rebalansovať portfólio. Nepredávaj z paniky pri bežných poklesoch trhu.",
        example: "Trh klesol o 20 % – historicky sa vždy zotavil. Kto predal v panike počas COVID-u v marci 2020, prišiel o 100 % rast do konca roka.",
        tip: "Maj jasný plán pred investovaním – za akých podmienok predáš. Emócie sú najväčší nepriateľ investora."
      },
    ],
  },
  {
    id: "budgeting",
    name: "Rozpočet",
    emoji: "💰",
    description: "Nauč sa plánovať výdavky a mať prehľad o svojich financiách.",
    topics: [
      {
        id: "budgeting-1",
        title: "Prečo viesť rozpočet?",
        content: "Rozpočet ti dáva prehľad o tom, kam idú tvoje peniaze. Bez rozpočtu je ťažké šetriť alebo splácať dlhy. Pomáha ti robiť informované finančné rozhodnutia.",
        example: "Zistíš, že míňaš 150 € mesačne na jedenie vonku. To je 1 800 € ročne! S rozpočtom si to uvedomíš a môžeš znížiť.",
        tip: "Veď rozpočet aspoň 3 mesiace – potom budeš mať presný obraz o svojich finančných návykoch."
      },
      {
        id: "budgeting-2",
        title: "Fixné vs. variabilné výdavky",
        content: "Fixné výdavky sa nemenia – nájom, poistenie, splátky. Variabilné výdavky kolíšu – jedlo, zábava, oblečenie. Pri tvorbe rozpočtu najprv pokry fixné výdavky, zvyšok rozdeľ medzi variabilné a úspory.",
        example: "Fixné: nájom 400 €, poistenie 30 €, telefón 20 €. Variabilné: jedlo 200-300 €, zábava 50-150 €.",
      },
      {
        id: "budgeting-3",
        title: "Metóda obálok",
        content: "Klasická metóda rozpočtovania: rozdeľ hotovosť do obálok podľa kategórií (jedlo, zábava, doprava). Keď je obálka prázdna, nemôžeš v danej kategórii míňať. Dnes to isté robia bankové aplikácie.",
        example: "Obálka \"Jedlo\" = 250 €, \"Zábava\" = 100 €, \"Oblečenie\" = 50 €. Keď minúš 100 € na zábavu, v tom mesiaci koniec.",
        tip: "Vyskúšaj digitálnu verziu – mnohé banky na Slovensku ponúkajú kategorizáciu výdavkov."
      },
      {
        id: "budgeting-4",
        title: "Sledovanie výdavkov",
        content: "Zaznamenávaj každý výdavok aspoň mesiac. Použi aplikáciu, tabuľku alebo poznámkový blok. Rozdeľ výdavky do kategórií: bývanie, jedlo, doprava, zábava, oblečenie, zdravie. Výsledky ťa pravdepodobne prekvapia.",
        example: "Po mesiaci sledovania zistíš: bývanie 40 %, jedlo 25 %, doprava 10 %, zábava 15 %, ostatné 10 %.",
        tip: "Zaokrúhľuj nahor – 4,80 € zapíš ako 5 €. Je to jednoduchšie a vytvára malú rezervu."
      },
      {
        id: "budgeting-5",
        title: "Nulový rozpočet (Zero-Based Budgeting)",
        content: "Pri nulovom rozpočte prideľuješ každému euru účel – príjmy mínus výdavky = 0. To neznamená, že míňaš všetko. Kategória \"úspory\" je tiež účel. Každé euro musí mať prácu.",
        example: "Príjem 1 200 €: nájom 400 €, jedlo 250 €, doprava 80 €, zábava 100 €, úspory 200 €, oblečenie 50 €, rezerva 120 € = 0 €.",
      },
      {
        id: "budgeting-6",
        title: "Sezónne a nepravidelné výdavky",
        content: "Niektoré výdavky prichádzajú len raz za rok – Vianoce, dovolenka, poistenie auta, daňové povinnosti. Rozlož ich na mesačné čiastky a šetri priebežne, aby ťa nezaskočili.",
        example: "Vianoce (darčeky): 300 € ÷ 12 = 25 € mesačne. Dovolenka: 1 200 € ÷ 12 = 100 € mesačne. Spolu: 125 € navyše do rozpočtu.",
        tip: "Vytvor si \"sinking fund\" – oddelený účet na plánované veľké výdavky."
      },
    ],
  },
  {
    id: "crypto",
    name: "Kryptomeny",
    emoji: "🪙",
    description: "Základy kryptomien, blockchainu a decentralizovaných financií.",
    topics: [
      {
        id: "crypto-1",
        title: "Čo je Bitcoin?",
        content: "Bitcoin je prvá a najznámejšia kryptomena, vytvorená v roku 2009 anonymným vývojárom Satoshi Nakamotom. Funguje na technológii blockchain – decentralizovanej databáze, kde transakcie overujú tisíce počítačov po celom svete. Nie je riadený žiadnou bankou ani vládou.",
        example: "Bitcoin má obmedzený počet mincí – maximálne 21 miliónov. Preto niektorí hovoria, že je \"digitálne zlato\".",
        tip: "Bitcoin je vysoko volatilný – jeho cena môže klesnúť o 50 % za pár mesiacov. Investuj len to, čo si môžeš dovoliť stratiť."
      },
      {
        id: "crypto-2",
        title: "Blockchain technológia",
        content: "Blockchain je reťazec blokov, kde každý blok obsahuje záznamy o transakciách. Tieto záznamy sú nemeniteľné a transparentné. Technológia má využitie nielen v kryptomenách, ale aj v logistike, zdravotníctve a ďalších odvetviach.",
        example: "Predstav si verejnú účtovnú knihu, do ktorej každý vidí, ale nikto nemôže zmeniť staré záznamy.",
      },
      {
        id: "crypto-3",
        title: "Altcoiny a tokeny",
        content: "Okrem Bitcoinu existujú tisíce iných kryptomien – altcoiny. Ethereum umožňuje programovateľné kontrakty. Stablecoiny (napr. USDT) majú stabilnú hodnotu naviazanú na dolár. Každý token má iný účel.",
        example: "Ethereum = platforma pre decentralizované aplikácie. Solana = rýchle transakcie. USDT = stabilná hodnota 1:1 k doláru.",
        tip: "Väčšina altcoinov dlhodobo stráca hodnotu. Drž sa overených projektov s reálnym využitím."
      },
      {
        id: "crypto-4",
        title: "Kryptopeňaženky",
        content: "Kryptopeňaženka uchováva tvoje súkromné kľúče – prístup k tvojim kryptomenám. Horúce peňaženky (hot wallets) sú online aplikácie – pohodlné, ale menej bezpečné. Studené peňaženky (cold wallets) sú hardvérové zariadenia – bezpečnejšie, ale menej pohodlné.",
        example: "MetaMask = horúca peňaženka (rozšírenie do prehliadača). Ledger = studená peňaženka (USB zariadenie za ~80 €).",
        tip: "\"Not your keys, not your coins\" – ak necháš krypto na burze, nemáš nad ním plnú kontrolu."
      },
      {
        id: "crypto-5",
        title: "DeFi – decentralizované financie",
        content: "DeFi sú finančné služby bez bánk a sprostredkovateľov. Môžeš požičiavať, sporobiť úroky alebo obchodovať priamo cez smart kontrakty na blockchaine. Výhody: dostupnosť, transparentnosť. Riziká: chyby v kóde, volatilita, regulácia.",
        example: "Na DeFi platforme Aave môžeš uložiť stablecoiny a zarábať 3-8 % ročne – bez banky, len cez smart kontrakt.",
        tip: "DeFi je stále experimentálne – začni s malými sumami a overeným protokolmi."
      },
      {
        id: "crypto-6",
        title: "NFT a digitálne vlastníctvo",
        content: "NFT (Non-Fungible Token) je jedinečný digitálny token na blockchaine, ktorý dokazuje vlastníctvo digitálneho obsahu – umenie, hudba, herné predmety. Na rozdiel od Bitcoinu, každý NFT je unikátny a nezameniteľný.",
        example: "Digitálny umelec predá svoje dielo ako NFT za 1 ETH. Kupujúci má overiteľný dôkaz vlastníctva na blockchaine.",
      },
      {
        id: "crypto-7",
        title: "Regulácia kryptomien v EÚ",
        content: "Európska únia zaviedla reguláciu MiCA (Markets in Crypto-Assets), ktorá stanovuje pravidlá pre kryptoburzy, stablecoiny a poskytovateľov služieb. Na Slovensku musíš zdaniť zisky z kryptomien ako príjem. Cieľom je ochrana investorov bez potlačenia inovácií.",
        example: "Od 2024 musia kryptoburzy v EÚ získať licenciu a dodržiavať pravidlá proti praniu špinavých peňazí (AML).",
        tip: "Veď si evidenciu všetkých krypto transakcií – budeš ju potrebovať pre daňové priznanie."
      },
    ],
  },
  {
    id: "taxes",
    name: "Dane",
    emoji: "🏛️",
    description: "Pochop daňový systém na Slovensku a nauč sa optimalizovať dane.",
    topics: [
      {
        id: "taxes-1",
        title: "Daň z príjmu fyzických osôb",
        content: "Na Slovensku platíš daň z príjmu 19 % (do 41 445 € ročne) alebo 25 % (nad túto hranicu). Ako zamestnanec ti daň strháva zamestnávateľ. Ako SZČO podávaš daňové priznanie sám.",
        example: "Ak zarábaš 1 500 € brutto mesačne, tvoja daň z príjmu je približne 190 € (po odpočítaní nezdaniteľnej časti).",
        tip: "Nezabudni na nezdaniteľnú časť základu dane – v roku 2024 je to 5 646 € ročne."
      },
      {
        id: "taxes-2",
        title: "DPH (daň z pridanej hodnoty)",
        content: "DPH je nepriama daň zahrnutá v cene tovarov a služieb. Na Slovensku je základná sadzba 20 %. Znížená sadzba 10 % platí na niektoré potraviny, lieky a knihy.",
        example: "Kúpiš si telefón za 600 €. Z toho 100 € je DPH (600 / 1,2 = 500 € bez DPH).",
      },
      {
        id: "taxes-3",
        title: "Daň z investícií",
        content: "Zisky z predaja akcií a kryptomien podliehajú dani z príjmu (19/25 %). Po odpočítaní strát a poplatkov platíš daň z čistého zisku. Niektoré investície majú výnimky po držaní viac ako 1 rok.",
        example: "Kúpil si akcie za 1 000 €, predal za 1 500 €. Zisk 500 € zdaníš 19 % = zaplatíš 95 € daň.",
        tip: "Veď si evidenciu všetkých nákupov a predajov – uľahčí ti to daňové priznanie."
      },
      {
        id: "taxes-4",
        title: "Sociálne a zdravotné odvody",
        content: "Okrem dane z príjmu platíš aj odvody: zdravotné (4 % zamestnanec + 10 % zamestnávateľ), sociálne (9,4 % zamestnanec + 25,2 % zamestnávateľ). SZČO platí obe poistenia sám, čo výrazne ovplyvňuje čistý príjem.",
        example: "Brutto mzda 1 500 €: odvody zamestnanca ~201 €, daň ~190 €, čistá mzda ~1 109 €. Zamestnávateľ navyše platí ~528 €.",
      },
      {
        id: "taxes-5",
        title: "Daňové odpočty a úľavy",
        content: "Slovenský daňový systém ponúka viaceré odpočty: nezdaniteľná časť na daňovníka, na manželku/manžela, daňový bonus na deti, odpočet na III. pilier (do 180 € ročne). Tieto odpočty môžu výrazne znížiť tvoju daňovú povinnosť.",
        example: "Máš 2 deti → daňový bonus ~140 € mesačne. Platíš III. pilier → ušetríš až 34,20 € na dani ročne (19 % zo 180 €).",
        tip: "Využi všetky dostupné odpočty – mnohí ľudia preplácajú dane, lebo nevedia o svojich možnostiach."
      },
      {
        id: "taxes-6",
        title: "SZČO vs. s.r.o.",
        content: "Ako SZČO platíš daň z príjmu + odvody z celého zisku. S.r.o. platí 15 % daň z príjmu právnickej osoby + 7 % daň z dividend pri výplate. Pri vyšších príjmoch sa s.r.o. často oplatí viac.",
        example: "Zisk 30 000 €: SZČO zaplatí ~10 000 € (dane + odvody). S.r.o. zaplatí ~6 300 € (15 % daň + 7 % dividendy).",
        tip: "Konzultuj s účtovníkom – optimálna forma podnikania závisí od tvojej konkrétnej situácie."
      },
      {
        id: "taxes-7",
        title: "Daňové priznanie – krok za krokom",
        content: "Daňové priznanie podávaš do 31. marca (alebo do 30. júna s odkladom). Typ A je pre zamestnancov s inými príjmami. Typ B je pre SZČO a podnikateľov. Elektronické podanie je možné cez portál Finančnej správy.",
        example: "Máš príjem zo zamestnania + predaj akcií → podávaš typ A. Si SZČO → podávaš typ B.",
        tip: "Požiadaj o odklad do 30. júna – máš viac času a žiadne sankcie."
      },
    ],
  },
  {
    id: "legal",
    name: "Právo",
    emoji: "⚖️",
    description: "Základy finančného práva, zmluvy a ochrana spotrebiteľa.",
    topics: [
      {
        id: "legal-1",
        title: "Spotrebiteľské práva",
        content: "Ako spotrebiteľ máš na Slovensku silnú právnu ochranu. Máš právo na 14-dňové odstúpenie od zmluvy pri online nákupoch. Záručná doba je 24 mesiacov. Predajca je povinný informovať ťa o všetkých podmienkach.",
        example: "Kúpiš si online topánky, nepasujú ti. Máš 14 dní na vrátenie bez udania dôvodu.",
        tip: "Vždy si prečítaj obchodné podmienky pred podpisom zmluvy – špeciálne pri finančných produktoch."
      },
      {
        id: "legal-2",
        title: "Úverové zmluvy a RPMN",
        content: "Pri pôžičke vždy sleduj RPMN (ročná percentuálna miera nákladov) – zahŕňa úrok aj všetky poplatky. Zákon limituje maximálnu výšku úrokov. Pred podpisom máš právo na 14-dňovú lehotu na rozmyslenie.",
        example: "Banka ponúka úver s úrokom 5 %, ale RPMN je 7,5 %. Rozdiel tvoria poplatky za vedenie účtu a spracovanie.",
      },
      {
        id: "legal-3",
        title: "Finančné podvody a ochrana",
        content: "Phishing, pyramídové schémy a falošné investičné platformy sú bežné hrozby. Nikdy nezdieľaj PIN, heslá ani osobné údaje cez telefón alebo e-mail. Ak niečo vyzerá príliš dobre na to, aby to bola pravda, pravdepodobne to tak je.",
        example: "Dostaneš e-mail \"od banky\" s odkazom na prihlásenie. Odkaz vedie na falošnú stránku – nikdy neklikaj!",
        tip: "Banka ťa nikdy nepožiada o heslo cez e-mail alebo SMS."
      },
      {
        id: "legal-4",
        title: "Osobný bankrot",
        content: "Ak sa dostaneš do nezvládnuteľných dlhov, slovenský zákon umožňuje oddlženie (osobný bankrot). Existujú dve formy: konkurz (vzdáš sa majetku) a splátkový kalendár (splácaš 3-5 rokov). Vyžaduje právne zastúpenie Centrom právnej pomoci.",
        example: "Dlhy 50 000 €, žiadny majetok → konkurz, zbavíš sa dlhov. Máš byt a príjem → splátkový kalendár na 3 roky.",
        tip: "Osobný bankrot je posledná možnosť. Najprv skús vyjednať s veriteľmi zníženie splátok alebo konsolidáciu."
      },
      {
        id: "legal-5",
        title: "Dedičské právo a financie",
        content: "Na Slovensku sa dedí zo zákona (4 skupiny dedičov) alebo zo závetu. Dedičstvo zahŕňa majetok aj dlhy – dedič môže dedičstvo odmietnuť. Dedičské konanie vedie notár. Daň z dedičstva bola na Slovensku zrušená.",
        example: "Zdedíš byt (200 000 €) a dlh na hypotéke (80 000 €). Čistá hodnota dedičstva je 120 000 €. Ak odmietneš, odmietneš všetko.",
      },
      {
        id: "legal-6",
        title: "GDPR a ochrana osobných údajov",
        content: "GDPR chráni tvoje osobné údaje v celej EÚ. Firmy musia mať tvoj súhlas na spracovanie údajov. Máš právo na prístup k svojim údajom, ich opravu a vymazanie. Za porušenie hrozia firmám pokuty do 20 miliónov € alebo 4 % obratu.",
        example: "Banka ti musí na požiadanie poskytnúť všetky údaje, ktoré o tebe spracováva, do 30 dní.",
        tip: "Pravidelne kontroluj, komu si dal súhlas na spracovanie údajov, a odvolaj nepotrebné."
      },
      {
        id: "legal-7",
        title: "Exekúcia – čo robiť?",
        content: "Exekúcia je nútený výkon rozhodnutia súdu. Exekútor môže siahnuť na plat, bankový účet alebo majetok. Zákon chráni minimum – exekútor ti nemôže zobrať celú výplatu (chránená suma ~350 € + príplatky na deti).",
        example: "Máš dlh 2 000 € a plat 1 000 €. Exekútor ti môže strhnúť max ~350 € mesačne, zvyšok je chránený.",
        tip: "Ak ti hrozí exekúcia, kontaktuj veriteľa čo najskôr – mnohí radšej súhlasia so splátkovým kalendárom."
      },
    ],
  },
  {
    id: "insurance",
    name: "Poistenie",
    emoji: "🛡️",
    description: "Prečo je poistenie dôležité a aké typy poistenia existujú.",
    topics: [
      {
        id: "insurance-1",
        title: "Zdravotné poistenie",
        content: "Na Slovensku je zdravotné poistenie povinné. Zamestnávateľ platí 10 % a zamestnanec 4 % z hrubej mzdy. SZČO a dobrovoľne nezamestnaní platia poistné sami. Máš na výber 3 zdravotné poisťovne: VšZP, Dôvera a Union.",
        example: "Pri hrubej mzde 1 200 € platíš 48 € na zdravotné poistenie a zamestnávateľ dopláca 120 €.",
      },
      {
        id: "insurance-2",
        title: "Životné poistenie",
        content: "Životné poistenie chráni tvoju rodinu v prípade smrti, invalidity alebo vážnej choroby. Existujú rizikové (lacnejšie, bez sporenia) a kapitálové (drahšie, kombinované so sporením) poistky.",
        example: "Rizikové životné poistenie na 100 000 € môže stáť od 15 do 30 € mesačne v závislosti od veku a zdravotného stavu.",
        tip: "Pre väčšinu ľudí je rizikové poistenie lepšia voľba – šetrenie rob zvlášť cez investície."
      },
      {
        id: "insurance-3",
        title: "Poistenie majetku a domácnosti",
        content: "Poistenie domácnosti kryje zariadenie bytu (nábytok, elektronika). Poistenie nehnuteľnosti kryje samotný byt alebo dom. PZP (povinné zmluvné poistenie) je povinné pre každé auto. Havarijné poistenie je dobrovoľné.",
        example: "Poistenie domácnosti na 30 000 € stojí približne 5-10 € mesačne. PZP na auto stojí od 50 do 300 € ročne.",
        tip: "Kombinuj poistenie domácnosti s poistením nehnuteľnosti – poisťovne často ponúkajú zľavy."
      },
      {
        id: "insurance-4",
        title: "Sociálne poistenie a dôchodky",
        content: "Sociálne poistenie na Slovensku zahŕňa: starobné poistenie (I. pilier), invalidné, nemocenské, poistenie v nezamestnanosti a garančné. II. pilier (starobné dôchodkové sporenie) je dobrovoľný a investuje tvoje peniaze na trhu.",
        example: "Platíš 9,4 % hrubej mzdy na sociálne poistenie. Z toho 4 % ide do I. piliera a ak si v II. pilieri, 5,5 % tam.",
        tip: "II. pilier je výhodný pre mladých ľudí – dlhodobo investované peniaze rastú viac ako štátny I. pilier."
      },
      {
        id: "insurance-5",
        title: "III. pilier – doplnkové sporenie",
        content: "III. pilier je dobrovoľné doplnkové dôchodkové sporenie. Príspevky si môžeš odpočítať od dane (do 180 € ročne). Mnohí zamestnávatelia prispievajú tiež. Je to ďalší spôsob, ako si zabezpečiť lepší dôchodok.",
        example: "Platíš 30 € mesačne do III. piliera, zamestnávateľ pridá 20 €. Ročne máš 600 € + daňová úspora 34,20 €.",
        tip: "Ak ti zamestnávateľ prispieva do III. piliera, vždy to využi – sú to \"zadarmo\" peniaze."
      },
      {
        id: "insurance-6",
        title: "Cestovné poistenie",
        content: "Cestovné poistenie kryje liečebné náklady, storno zájazdu, stratu batožiny a zodpovednosť za škodu v zahraničí. V rámci EÚ máš Európsky preukaz zdravotného poistenia (EPZP), ale nekryje všetko – repatriácia, privátna starostlivosť.",
        example: "Zlomíš si nohu v Thajsku – liečba stojí 5 000 €. Bez poistenia platíš všetko. S poistením (za 20 €) je kryté.",
        tip: "Niektoré kreditné karty zahŕňajú cestovné poistenie – over si podmienky u tvojej banky."
      },
      {
        id: "insurance-7",
        title: "Ako si vybrať správne poistenie?",
        content: "Pri výbere poistenia porovnávaj: rozsah krytia, výluky (čo NIE JE kryté), spoluúčasť (koľko platíš ty), výšku poistného a reputáciu poisťovne. Najlacnejšie poistenie nemusí byť najlepšie – dôležité sú podmienky.",
        example: "Poistenie A: 50 €/rok, krytie 10 000 €, spoluúčasť 200 €. Poistenie B: 80 €/rok, krytie 50 000 €, spoluúčasť 0 €. B je často lepšia voľba.",
        tip: "Prečítaj si výluky z poistenia – tam sa najčastejšie skrývajú nepríjemné prekvapenia."
      },
    ],
  },
];
