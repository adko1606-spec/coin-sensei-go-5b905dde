// Scenárové (swipe-style) otázky mapované na kategórie lekcií.
// Integrované priamo do kvízu ako typ "scenario" — s neutrálnym vzhľadom pred odpoveďou.

import type { ScenarioQuestion } from "./lessons";

type ScenarioTemplate = Omit<ScenarioQuestion, "id">;

export const scenariosByCategory: Record<string, ScenarioTemplate[]> = {
  basics: [
    {
      type: "scenario",
      text: "Čo by si mal urobiť ako prvé?",
      title: "Práve si dostal výplatu €1 200",
      context: "Máš pred sebou celý mesiac a žiadne úspory.",
      optionA: { label: "Kúpiť nový telefón 📱", correct: false, explanation: "Bez rezervy si zraniteľný pri nečakaných výdavkoch." },
      optionB: { label: "Vytvoriť rezervu 💰", correct: true, explanation: "Rezerva 3-6 mesiacov výdavkov je základ finančnej stability." },
      explanation: "Rezerva 3-6 mesiacov výdavkov je základ finančnej stability.",
    },
    {
      type: "scenario",
      text: "Ako sa rozhodneš?",
      title: "Banka ti ponúka kreditku",
      context: "Limit €2 000, 0% úrok prvé 3 mesiace.",
      optionA: { label: "Beriem, sú to peniaze zadarmo 💳", correct: false, explanation: "Po 3 mesiacoch ťa čaká úrok 18-25% ročne." },
      optionB: { label: "Prečítam si zmluvu a zvážim ju 📄", correct: true, explanation: "Vždy čítaj malé písmo — kreditka môže byť past." },
      explanation: "Vždy si prečítaj podmienky pred podpisom.",
    },
  ],
  saving: [
    {
      type: "scenario",
      text: "Čo urobíš?",
      title: "Auto sa pokazilo, oprava €600",
      context: "Máš na účte €700, žiadnu kreditku.",
      optionA: { label: "Zaplatím opravu z účtu 🔧", correct: true, explanation: "Práve preto existuje rezerva — kryť nečakané výdavky bez dlhu." },
      optionB: { label: "Zoberiem si rýchlu pôžičku 💸", correct: false, explanation: "Nebankové pôžičky majú úroky 100%+ ročne. Vyhni sa im." },
      explanation: "Rezerva existuje presne na toto.",
    },
    {
      type: "scenario",
      text: "Kúpiš?",
      title: "Akcia: TV za €800, zľava -50%",
      context: "Máš rezervu €1 500. TV nepotrebuješ, ale je to skvelá cena.",
      optionA: { label: "Áno, taká zľava sa neopakuje! 🛒", correct: false, explanation: "Zľava na vec, ktorú nepotrebuješ, nie je úspora — je to výdavok." },
      optionB: { label: "Nie, nepotrebujem ju ✋", correct: true, explanation: "Najlepšia 'zľava' je nekúpiť to, čo nepotrebuješ." },
      explanation: "Zľava na zbytočnosť je stále výdavok.",
    },
    {
      type: "scenario",
      text: "Čo s ním?",
      title: "Máš dlh €1 000 na kreditke (úrok 20%)",
      context: "Dostal si bonus €1 000.",
      optionA: { label: "Splatím dlh okamžite ✅", correct: true, explanation: "Splatenie 20% dlhu = garantovaný 20% výnos." },
      optionB: { label: "Investujem do akcií 📈", correct: false, explanation: "Akcie robia priemerne 7-10%, ale dlh ti zožerie 20%." },
      explanation: "Najprv splať drahé dlhy, potom investuj.",
    },
  ],
  investing: [
    {
      type: "scenario",
      text: "Čo urobíš?",
      title: "Kamarát ti odporúča 'super investíciu'",
      context: "Sľubuje 30% výnos za mesiac.",
      optionA: { label: "Investujem všetky úspory 🚀", correct: false, explanation: "Garantovaný vysoký výnos = takmer vždy podvod." },
      optionB: { label: "Pýtam sa: ako presne to funguje? 🤔", correct: true, explanation: "Zdravá skepsa ti zachráni peniaze." },
      explanation: "Ak to znie príliš dobre, zvyčajne to nie je pravda.",
    },
    {
      type: "scenario",
      text: "Čo s nimi?",
      title: "Dostal si €500 ako darček",
      context: "Žiadne dlhy, máš rezervu, stabilný príjem.",
      optionA: { label: "Investujem do indexového fondu 📈", correct: true, explanation: "Dlhodobé investovanie do diverzifikovaných fondov je cesta k bohatstvu." },
      optionB: { label: "Idem na drahú večeru 🍽️", correct: false, explanation: "Občasná odmena je OK, ale väčšinu treba pracovať pre teba." },
      explanation: "Nechaj peniaze pracovať pre seba.",
    },
  ],
  budgeting: [
    {
      type: "scenario",
      text: "Aký je tvoj plán?",
      title: "Nájomné €500, výplata €1 000",
      context: "Po nájme ti zostane €500 na celý mesiac.",
      optionA: { label: "Minúť všetko, zajtra je tiež deň 🎉", correct: false, explanation: "Bez plánu sa peniaze stratia." },
      optionB: { label: "Rozdeliť: 50% potreby, 30% chcené, 20% úspory 📊", correct: true, explanation: "Pravidlo 50/30/20 je overený základ rozpočtu." },
      explanation: "Pravidlo 50/30/20 pomáha s kontrolou výdavkov.",
    },
    {
      type: "scenario",
      text: "Súhlasíš?",
      title: "Šéf ti ponúka prácu navyše + €200/mesiac",
      context: "Znamená to o 10 hodín týždenne menej voľna.",
      optionA: { label: "Áno, peniaze navyše sa hodia 💼", correct: false, explanation: "Záleží na cene tvojho času a vyhorení." },
      optionB: { label: "Spočítam, či sa mi to oplatí ⚖️", correct: true, explanation: "€200 / 40h = €5/hod. Zvážiť treba aj čas a energiu." },
      explanation: "Čas má svoju hodnotu — vždy počítaj.",
    },
  ],
  crypto: [
    {
      type: "scenario",
      text: "Investuješ?",
      title: "Influencer odporúča novú kryptomincu",
      context: "Cena vyletela o 200% za týždeň.",
      optionA: { label: "Áno, kým je čas! ⚡", correct: false, explanation: "FOMO investovanie končí takmer vždy stratou." },
      optionB: { label: "Najprv si o nej naštudujem 📚", correct: true, explanation: "Investuj len do toho, čomu rozumieš." },
      explanation: "Influenceri sú často platení za promo.",
    },
  ],
  taxes: [
    {
      type: "scenario",
      text: "Čo urobíš?",
      title: "Podnikáš na živnosť a dostal si prvú faktúru €800",
      context: "Klient ti hneď zaplatil v hotovosti.",
      optionA: { label: "Všetko miniem — moje peniaze 💸", correct: false, explanation: "Časť musíš odložiť na odvody a dane (~30-40%)." },
      optionB: { label: "Odložím 30-40% na dane a odvody 🏛️", correct: true, explanation: "Živnostník si musí sám platiť odvody a dane zo zisku." },
      explanation: "Dane nie sú tvoje peniaze — odlož ich hneď.",
    },
  ],
  legal: [
    {
      type: "scenario",
      text: "Čo urobíš?",
      title: "Podpisuješ zmluvu o telefóne na 24 mesiacov",
      context: "Predajca hovorí: 'Len rýchlo podpíš, detaily sú štandardné.'",
      optionA: { label: "Podpíšem, šetrí to čas ✍️", correct: false, explanation: "Zmluva je právne záväzná — musíš ju čítať." },
      optionB: { label: "Prečítam si ju celú doma a vrátim sa 📋", correct: true, explanation: "Nikdy nepodpisuj, čo si si neprečítal — aj 'štandardné' zmluvy skrývajú pokuty." },
      explanation: "Nepodpisuj nič, čo si si neprečítal.",
    },
  ],
  insurance: [
    {
      type: "scenario",
      text: "Ako sa rozhodneš?",
      title: "Máš 22 rokov, zdravý, ponúkajú ti životné poistenie",
      context: "Mesačne €80, garantuje výplatu €50k pri úmrtí.",
      optionA: { label: "Podpíšem — istota 🛡️", correct: false, explanation: "V mladom veku bez závislých osôb je životné poistenie zbytočný výdavok." },
      optionB: { label: "Odmietnem — nemám deti ani hypotéku ✋", correct: true, explanation: "Životné poistenie potrebuješ, keď na tebe finančne závisia iní." },
      explanation: "Poistenie = riešenie rizika, nie sporenie.",
    },
  ],
};

// Vygeneruje scenario otázky pre danú lekciu na základe jej kategórie
export function getScenariosForCategory(category: string, lessonId: string): ScenarioQuestion[] {
  const templates = scenariosByCategory[category] ?? [];
  return templates.map((t, i) => ({ ...t, id: `${lessonId}-scn-${i}` }));
}
