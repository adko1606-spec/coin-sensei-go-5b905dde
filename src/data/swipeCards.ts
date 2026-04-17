export interface SwipeCard {
  id: string;
  title: string;
  context: string;
  question: string;
  optionA: { label: string; correct: boolean; explanation: string };
  optionB: { label: string; correct: boolean; explanation: string };
}

export const swipeCards: SwipeCard[] = [
  {
    id: "sc-1",
    title: "Práve si dostal výplatu €1 200",
    context: "Máš pred sebou celý mesiac a žiadne úspory.",
    question: "Čo by si mal urobiť ako prvé?",
    optionA: { label: "Kúpiť nový telefón 📱", correct: false, explanation: "Bez rezervy si zraniteľný pri nečakaných výdavkoch." },
    optionB: { label: "Vytvoriť rezervu 💰", correct: true, explanation: "Rezerva 3-6 mesiacov výdavkov je základ finančnej stability." },
  },
  {
    id: "sc-2",
    title: "Banka ti ponúka kreditku",
    context: "Limit €2 000, 0% úrok prvé 3 mesiace.",
    question: "Ako sa rozhodneš?",
    optionA: { label: "Beriem, sú to peniaze zadarmo 💳", correct: false, explanation: "Po 3 mesiacoch ťa čaká úrok 18-25% ročne." },
    optionB: { label: "Prečítam si zmluvu a zvážim ju 📄", correct: true, explanation: "Vždy čítaj malé písmo — kreditka môže byť past." },
  },
  {
    id: "sc-3",
    title: "Kamarát ti odporúča 'super investíciu'",
    context: "Sľubuje 30% výnos za mesiac.",
    question: "Čo urobíš?",
    optionA: { label: "Investujem všetky úspory 🚀", correct: false, explanation: "Garantovaný vysoký výnos = takmer vždy podvod (Ponziho schéma)." },
    optionB: { label: "Pýtam sa: ako presne to funguje? 🤔", correct: true, explanation: "Zdravá skepsa ti zachráni peniaze. Ak to znie príliš dobre, zvyčajne to nie je pravda." },
  },
  {
    id: "sc-4",
    title: "Akcia: TV za €800, zľava -50%",
    context: "Máš v rezerve €1 500. TV nepotrebuješ, ale je to skvelá cena.",
    question: "Kúpiš?",
    optionA: { label: "Áno, taká zľava sa neopakuje! 🛒", correct: false, explanation: "Zľava na vec, ktorú nepotrebuješ, nie je úspora — je to výdavok." },
    optionB: { label: "Nie, nepotrebujem ju ✋", correct: true, explanation: "Najlepšia 'zľava' je nekúpiť to, čo nepotrebuješ." },
  },
  {
    id: "sc-5",
    title: "Dostal si €500 ako darček",
    context: "Žiadne dlhy, máš rezervu, stabilný príjem.",
    question: "Čo s nimi?",
    optionA: { label: "Investujem do indexového fondu 📈", correct: true, explanation: "Dlhodobé investovanie do diverzifikovaných fondov je najlepšia cesta k bohatstvu." },
    optionB: { label: "Idem na drahú večeru 🍽️", correct: false, explanation: "Občasná odmena je OK, ale väčšinu treba pracovať pre teba." },
  },
  {
    id: "sc-6",
    title: "Auto sa pokazilo, oprava €600",
    context: "Máš na účte €700, žiadnu kreditku.",
    question: "Čo urobíš?",
    optionA: { label: "Zaplatím opravu z účtu 🔧", correct: true, explanation: "Práve preto existuje rezerva — kryť nečakané výdavky bez dlhu." },
    optionB: { label: "Zoberiem si rýchlu pôžičku 💸", correct: false, explanation: "Nebankové pôžičky majú úroky 100%+ ročne. Vyhni sa im." },
  },
  {
    id: "sc-7",
    title: "Influencer odporúča kryptomincu",
    context: "Cena vyletela o 200% za týždeň.",
    question: "Investuješ?",
    optionA: { label: "Áno, kým je čas! ⚡", correct: false, explanation: "FOMO investovanie končí takmer vždy stratou. Trh už 'zjedol' výnos." },
    optionB: { label: "Najprv si o nej naštudujem 📚", correct: true, explanation: "Investuj len do toho, čomu rozumieš. Influenceri sú často platení." },
  },
  {
    id: "sc-8",
    title: "Nájomné €500, výplata €1 000",
    context: "Po nájme ti zostane €500 na celý mesiac.",
    question: "Aký je tvoj plán?",
    optionA: { label: "Minúť všetko, zajtra je tiež deň 🎉", correct: false, explanation: "Bez plánu sa peniaze stratia. Pravidlo 50/30/20 ti pomôže." },
    optionB: { label: "Rozdeliť: 50% potreby, 30% chcene, 20% úspory 📊", correct: true, explanation: "Pravidlo 50/30/20 je overený základ rozpočtu." },
  },
  {
    id: "sc-9",
    title: "Šéf ti ponúka prácu navyše + €200/mesiac",
    context: "Znamená to o 10 hodín týždenne menej voľna.",
    question: "Súhlasíš?",
    optionA: { label: "Áno, peniaze navyše sa hodia 💼", correct: false, explanation: "Záleží na cene tvojho času. Občas oddych = vyššia produktivita." },
    optionB: { label: "Spočítam, či sa mi to oplatí ⚖️", correct: true, explanation: "€200 / 40h = €5/hod. Možno tvoj čas má vyššiu hodnotu." },
  },
  {
    id: "sc-10",
    title: "Máš dlh €1 000 na kreditke (úrok 20%)",
    context: "Dostal si bonus €1 000.",
    question: "Čo s ním?",
    optionA: { label: "Splatím dlh okamžite ✅", correct: true, explanation: "Splatenie 20% dlhu = garantovaný 20% výnos. Žiadna investícia to neporazí." },
    optionB: { label: "Investujem do akcií 📈", correct: false, explanation: "Akcie robia priemerne 7-10%, ale dlh ti zožerie 20%. Najprv splať dlh." },
  },
];
