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
        tip: "Drž núdzový fond na sporiace účte s rýchlym prístupom – nie v akciách ani kryptomenách."
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
        content: "Bitcoin je prvá a najznámejšia kryptomena, vytvorená v roku 2009. Funguje na technológii blockchain – decentralizovanej databáze, kde transakcie overujú tisíce počítačov po celom svete. Nie je riadený žiadnou bankou ani vládou.",
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
        title: "Daň z príjmu",
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
        title: "Úverové zmluvy",
        content: "Pri pôžičke vždy sleduj RPMN (ročná percentuálna miera nákladov) – zahŕňa úrok aj všetky poplatky. Zákon limituje maximálnu výšku úrokov. Pred podpisom máš právo na 14-dňovú lehotu na rozmyslenie.",
        example: "Banka ponúka úver s úrokom 5 %, ale RPMN je 7,5 %. Rozdiel tvoria poplatky za vedenie účtu a spracovanie.",
      },
      {
        id: "legal-3",
        title: "Finančné podvody",
        content: "Phishing, pyramídové schémy a falošné investičné platformy sú bežné hrozby. Nikdy nezdieľaj PIN, heslá ani osobné údaje cez telefón alebo e-mail. Ak niečo vyzerá príliš dobre na to, aby to bola pravda, pravdepodobne to tak je.",
        example: "Dostaneš e-mail \"od banky\" s odkazom na prihlásenie. Odkaz vedie na falošnú stránku – nikdy neklikaj!",
        tip: "Banka ťa nikdy nepožiada o heslo cez e-mail alebo SMS."
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
        content: "Na Slovensku je zdravotné poistenie povinné. Zamestnávateľ platí 10 % a zamestnanec 4 % z hrubej mzdy. SZČO a dobrovoľne nezamestnaní platia poistné sami. Máš na výber 3 zdravotné poisťovne.",
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
        title: "Poistenie majetku",
        content: "Poistenie domácnosti kryje zariadenie bytu (nábytok, elektronika). Poistenie nehnuteľnosti kryje samotný byt alebo dom. PZP (povinné zmluvné poistenie) je povinné pre každé auto.",
        example: "Poistenie domácnosti na 30 000 € stojí približne 5-10 € mesačne. PZP na auto stojí od 50 do 300 € ročne.",
        tip: "Kombinuj poistenie domácnosti s poistením nehnuteľnosti – poisťovne často ponúkajú zľavy."
      },
    ],
  },
];
