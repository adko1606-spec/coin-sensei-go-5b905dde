import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { characters } from "@/data/characters";
import logo from "@/assets/logo-new.png";

const Onboarding = () => {
  const { completeOnboarding } = useAuth();
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const steps = [
    { title: t("onboarding.howOld"), options: ["14–17", "18–24", "25–34", "35+"] },
    { title: t("onboarding.knowledge"), options: [t("onboarding.beginner"), t("onboarding.intermediate"), t("onboarding.advanced"), t("onboarding.expert")] },
    { title: t("onboarding.work"), options: [t("onboarding.student"), t("onboarding.employed"), t("onboarding.entrepreneur"), t("onboarding.other")] },
    { title: t("onboarding.interest"), options: [t("onboarding.savingMoney"), t("onboarding.investingMoney"), t("onboarding.budgeting"), t("onboarding.everything")] },
  ];

  const isQuizStep = step < steps.length;
  const isCharStep = step === steps.length;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isQuizStep && !answers[step]) return;
    setStep((s) => s + 1);
  };

  const handleFinish = async () => {
    if (!selectedChar) return;
    localStorage.setItem("finap_onboarding", JSON.stringify(answers));
    await completeOnboarding(selectedChar);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="FinLit" className="h-20 w-20 mb-2" />
          <h1 className="text-2xl font-extrabold text-foreground">{t("onboarding.welcome")}</h1>
          <p className="text-muted-foreground text-sm">{t("onboarding.tellUsAbout")}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[...steps, { title: t("onboarding.character") }].map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/50" : "w-2 bg-muted"}`} />
          ))}
        </div>

        <div className="rounded-3xl bg-card p-6 shadow-float">
          <AnimatePresence mode="wait">
            {isQuizStep && (
              <motion.div key={step} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h2 className="text-xl font-extrabold text-foreground mb-4">{steps[step].title}</h2>
                <div className="space-y-3">
                  {steps[step].options.map((opt) => (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      className={`w-full rounded-2xl border-2 p-4 text-left font-semibold transition-all ${
                        answers[step] === opt ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {isCharStep && (
              <motion.div key="char" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h2 className="text-xl font-extrabold text-foreground mb-4">{t("onboarding.chooseCharacter")}</h2>
                <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                  {characters.map((char) => (
                    <button key={char.id} onClick={() => setSelectedChar(char.id)}
                      className={`flex flex-col items-center gap-2 rounded-2xl p-3 transition-all ${
                        selectedChar === char.id ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"
                      }`}>
                      <img src={char.image} alt={char.name} className="h-14 w-14 rounded-xl object-cover" />
                      <p className="text-xs font-bold text-foreground">{char.name}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-center gap-3">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)}
                className="rounded-2xl border-2 border-border px-4 py-3 font-bold text-foreground hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            {isQuizStep && (
              <button onClick={handleNext} disabled={!answers[step]}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl gradient-primary px-6 py-3 font-bold text-primary-foreground shadow-button disabled:opacity-50">
                {t("onboarding.next")} <ArrowRight className="h-5 w-5" />
              </button>
            )}
            {isCharStep && (
              <button onClick={handleFinish} disabled={!selectedChar}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl gradient-primary px-6 py-3 font-bold text-primary-foreground shadow-button disabled:opacity-50">
                {t("onboarding.startPlaying")} <Check className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
