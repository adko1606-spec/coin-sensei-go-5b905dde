export const dailyTips: string[] = [
  "💡 Pravidlo 50/30/20: 50 % príjmu na potreby, 30 % na želania, 20 % na úspory a investície.",
  "💡 Začni investovať čo najskôr – zložený úrok je tvoj najlepší priateľ!",
  "💡 Nikdy neinvestuj peniaze, ktoré si nemôžeš dovoliť stratiť.",
  "💡 Diverzifikácia portfólia znižuje riziko – nekladni všetky vajcia do jedného košíka.",
  "💡 Núdzový fond by mal pokryť aspoň 3-6 mesiacov tvojich výdavkov.",
  "💡 Sleduj svoje výdavky – väčšina ľudí míňa viac, než si myslí.",
  "💡 ETF fondy sú skvelý spôsob, ako začať investovať s nízkymi poplatkami.",
  "💡 Inflácia znehodnocuje tvoje úspory – peniaze na účte strácajú hodnotu.",
  "💡 DCA (Dollar Cost Averaging) – pravidelné investovanie malých súm znižuje riziko.",
  "💡 Kreditná karta nie je bezplatné peniaze – vždy platí úroky z nezaplatených zostatkov.",
  "💡 Warren Buffett začal investovať vo veku 11 rokov. Nikdy nie je príliš skoro!",
  "💡 Daňové priznanie podávaj včas – vyhneš sa pokutám a úrokom z omeškania.",
  "💡 Poistenie je ochrana, nie zbytočný výdavok. Chráni ťa pred finančnou katastrofou.",
  "💡 Pred investíciou do kryptomien urob vlastný výskum (DYOR – Do Your Own Research).",
  "💡 Automatické sporenie – nastav si trvalý príkaz a sporenie pôjde samo.",
  "💡 Rozumej poplatkom – skryté poplatky môžu výrazne znížiť tvoje výnosy.",
  "💡 Finančná gramotnosť sa v škole neučí – preto je dôležité vzdelávať sa sám.",
  "💡 Index S&P 500 historicky prináša priemerný ročný výnos okolo 10 %.",
  "💡 Vyvaruj sa impulzívnym nákupom – počkaj 24 hodín pred väčším nákupom.",
  "💡 Dlhodobé investovanie poráža krátkodobé špekulácie v 95 % prípadov.",
  "💡 Pasívny príjem je kľúč k finančnej slobode – hľadaj spôsoby, ako ho vytvoriť.",
  "💡 Žiadna investícia nie je bez rizika – aj bankové vklady majú riziko inflácie.",
  "💡 Tvoj čas je tvoje najcennejšie aktívum – investuj ho múdro do vzdelávania.",
  "💡 Porovnávaj ponuky bánk – rozdiely v úrokoch môžu ušetriť stovky eur ročne.",
  "💡 Kúp si to, čo potrebuješ, nie to, čo chceš. Rozdiel je kľúčom k bohatstvu.",
  "💡 Sleduj ekonomické správy – pomôžu ti robiť lepšie finančné rozhodnutia.",
  "💡 Nezabúdaj na dane z kapitálových ziskov – plánuj ich dopredu.",
  "💡 Investuj do seba – vzdelanie má najvyššiu návratnosť investície.",
  "💡 Zložený úrok je 'ôsmy div sveta' – povedal Albert Einstein.",
  "💡 Rozpočet nie je obmedzenie, ale nástroj slobody.",
];

export function getTodaysTip(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyTips[dayOfYear % dailyTips.length];
}
