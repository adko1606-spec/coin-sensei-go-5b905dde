import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Reorder, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { X, CheckCircle2, XCircle, ArrowRight, Trophy, GripVertical, Coins, Heart, Bot, Sparkles, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "lucide-react";
import type { Lesson, Question, ChoiceQuestion, TrueFalseQuestion, SliderQuestion, OrderQuestion, ScenarioQuestion } from "@/data/lessons";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import AIQuestionHelper from "@/components/AIQuestionHelper";
import { useSound } from "@/hooks/useSound";

// Lesson progress save/load
const PROGRESS_KEY = (lessonId: string) => `finlit-lesson-progress-${lessonId}`;

interface SavedProgress {
  currentIndex: number;
  score: number;
  errors: number;
  answeredQuestions: Record<number, { correct: boolean }>;
}

interface QuizModalProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (xp: number, score: number, totalQuestions: number) => void;
}

const ChoiceView = ({ question, selectedAnswer, isCorrect, onAnswer }: {
  question: ChoiceQuestion; selectedAnswer: number | null; isCorrect: boolean | null; onAnswer: (i: number) => void;
}) => (
  <div className="space-y-3">
    {question.options.map((option, i) => {
      let styles = "border-border bg-card hover:bg-muted";
      if (selectedAnswer !== null) {
        if (i === question.correctIndex) styles = "border-primary bg-primary/10";
        else if (i === selectedAnswer && !isCorrect) styles = "border-destructive bg-destructive/10";
      }
      return (
        <motion.button key={i} whileTap={selectedAnswer === null ? { scale: 0.98 } : {}} onClick={() => onAnswer(i)}
          className={`w-full rounded-2xl border-2 p-4 text-left font-semibold transition-all ${styles}`}>
          <div className="flex items-center justify-between">
            <span className="text-foreground">{option}</span>
            {selectedAnswer !== null && i === question.correctIndex && <CheckCircle2 className="h-5 w-5 text-primary" />}
            {selectedAnswer === i && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
          </div>
        </motion.button>
      );
    })}
  </div>
);

const TrueFalseView = ({ question, selectedAnswer, isCorrect, onAnswer }: {
  question: TrueFalseQuestion; selectedAnswer: boolean | null; isCorrect: boolean | null; onAnswer: (v: boolean) => void;
}) => {
  const options = [
    { label: "✅", emoji: "✅", value: true },
    { label: "❌", emoji: "❌", value: false },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        let styles = "border-border bg-card hover:bg-muted";
        if (selectedAnswer !== null) {
          if (opt.value === question.correctAnswer) styles = "border-primary bg-primary/10";
          else if (opt.value === selectedAnswer && !isCorrect) styles = "border-destructive bg-destructive/10";
        }
        return (
          <motion.button key={String(opt.value)} whileTap={selectedAnswer === null ? { scale: 0.95 } : {}} onClick={() => onAnswer(opt.value)}
            className={`rounded-2xl border-2 p-6 text-center font-bold transition-all ${styles}`}>
            <span className="block text-3xl mb-2">{opt.emoji}</span>
            <span className="text-foreground">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

const SliderView = ({ question, submitted, isCorrect, onSubmit }: {
  question: SliderQuestion; submitted: boolean; isCorrect: boolean | null; onSubmit: (value: number) => void;
}) => {
  const mid = Math.round((question.min + question.max) / 2 / question.step) * question.step;
  const [value, setValue] = useState(mid);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-border bg-card p-6">
        <label className="block text-sm font-bold text-muted-foreground mb-1">{question.label}</label>
        <div className="text-center text-4xl font-extrabold text-primary mb-4">{value} {question.unit}</div>
        <input type="range" min={question.min} max={question.max} step={question.step} value={value}
          onChange={(e) => !submitted && setValue(Number(e.target.value))} disabled={submitted}
          className="w-full h-3 rounded-full appearance-none bg-muted cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-foreground [&::-webkit-slider-thumb]:shadow-md disabled:opacity-60" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{question.min} {question.unit}</span><span>{question.max} {question.unit}</span>
        </div>
      </div>
      {!submitted && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.98 }} onClick={() => onSubmit(value)}
          className="w-full rounded-2xl gradient-gold px-6 py-4 font-bold text-primary-foreground shadow-button transition-all hover:opacity-90 active:scale-95" data-i18n="quiz.confirmAnswer">
          Potvrdiť
        </motion.button>
      )}
      {submitted && (
        <div className="text-center text-sm text-muted-foreground">
          Správna odpoveď: <span className="font-bold text-primary">{question.correctValue} {question.unit}</span>
          {question.tolerance > 0 && <span> (±{question.tolerance})</span>}
        </div>
      )}
    </div>
  );
};

const OrderView = ({ question, submitted, isCorrect, onSubmit }: {
  question: OrderQuestion; submitted: boolean; isCorrect: boolean | null; onSubmit: (order: number[]) => void;
}) => {
  const [items, setItems] = useState(() => question.items.map((text, i) => ({ id: i, text })));
  const currentOrder = items.map((it) => it.id);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">Pretiahni položky do správneho poradia ↕️</p>
      <Reorder.Group axis="y" values={items} onReorder={(newItems) => !submitted && setItems(newItems)} className="space-y-2">
        {items.map((item, idx) => {
          let borderStyle = "border-border";
          if (submitted) {
            const correctPos = question.correctOrder.indexOf(item.id);
            borderStyle = correctPos === idx ? "border-primary bg-primary/10" : "border-destructive bg-destructive/10";
          }
          return (
            <Reorder.Item key={item.id} value={item}
              className={`flex items-center gap-3 rounded-2xl border-2 p-4 bg-card transition-colors ${borderStyle} ${!submitted ? "cursor-grab active:cursor-grabbing" : ""}`}
              dragListener={!submitted}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">{idx + 1}</span>
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground font-semibold text-sm">{item.text}</span>
              {submitted && question.correctOrder.indexOf(item.id) === idx && <CheckCircle2 className="ml-auto h-5 w-5 text-primary shrink-0" />}
              {submitted && question.correctOrder.indexOf(item.id) !== idx && <XCircle className="ml-auto h-5 w-5 text-destructive shrink-0" />}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      {!submitted && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.98 }} onClick={() => onSubmit(currentOrder)}
          className="w-full rounded-2xl gradient-gold px-6 py-4 font-bold text-primary-foreground shadow-button transition-all hover:opacity-90 active:scale-95">
          Potvrdiť poradie
        </motion.button>
      )}
    </div>
  );
};

const ScenarioView = ({ question, selectedChoice, onAnswer }: {
  question: ScenarioQuestion; selectedChoice: "A" | "B" | null; onAnswer: (choice: "A" | "B") => void;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const leftOpacity = useTransform(x, [-120, -30, 0], [1, 0, 0]);
  const rightOpacity = useTransform(x, [0, 30, 120], [0, 0, 1]);
  const cardOpacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const [exitDir, setExitDir] = useState<null | "left" | "right">(null);

  const triggerSwipe = (dir: "left" | "right") => {
    if (selectedChoice || exitDir) return;
    setExitDir(dir);
    setTimeout(() => onAnswer(dir === "left" ? "A" : "B"), 220);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (selectedChoice) return;
    const SWIPE_DIST = 80;
    const SWIPE_VEL = 500;
    if (info.offset.x < -SWIPE_DIST || info.velocity.x < -SWIPE_VEL) triggerSwipe("left");
    else if (info.offset.x > SWIPE_DIST || info.velocity.x > SWIPE_VEL) triggerSwipe("right");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedChoice) return;
      if (e.key === "ArrowLeft") triggerSwipe("left");
      if (e.key === "ArrowRight") triggerSwipe("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedChoice]);

  // Po odpovedi farby; pred odpoveďou neutrálne
  const getBtnStyle = (choice: "A" | "B") => {
    if (!selectedChoice) return "border-border bg-muted/40";
    const opt = choice === "A" ? question.optionA : question.optionB;
    if (opt.correct) return "border-primary bg-primary/10";
    if (selectedChoice === choice && !opt.correct) return "border-destructive bg-destructive/10";
    return "border-border bg-muted/30 opacity-60";
  };

  return (
    <div className="relative" style={{ minHeight: 380 }}>
      <motion.div
        drag={selectedChoice || exitDir ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={
          exitDir
            ? { x: exitDir === "left" ? -500 : 500, rotate: exitDir === "left" ? -25 : 25, opacity: 0 }
            : undefined
        }
        transition={exitDir ? { duration: 0.22, ease: "easeOut" } : { type: "spring", stiffness: 500, damping: 35 }}
        style={{ x, rotate, opacity: cardOpacity, touchAction: "pan-y" }}
        whileTap={{ cursor: "grabbing" }}
        className="cursor-grab active:cursor-grabbing select-none touch-pan-y"
      >
        <div className="relative rounded-3xl border-2 border-border bg-card p-5 shadow-float overflow-hidden">
          {/* Swipe overlay labels — INSIDE card so they move with it */}
          {!selectedChoice && (
            <>
              <motion.div style={{ opacity: leftOpacity }} className="pointer-events-none absolute left-3 top-3 z-10">
                <div className="rounded-xl border-2 border-destructive bg-destructive/20 px-3 py-1 -rotate-12">
                  <span className="text-sm font-extrabold text-destructive">A</span>
                </div>
              </motion.div>
              <motion.div style={{ opacity: rightOpacity }} className="pointer-events-none absolute right-3 top-3 z-10">
                <div className="rounded-xl border-2 border-primary bg-primary/20 px-3 py-1 rotate-12">
                  <span className="text-sm font-extrabold text-primary">B</span>
                </div>
              </motion.div>
            </>
          )}

          <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1">
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="text-[11px] font-bold text-accent">Reálna situácia · 👈 swipe 👉</span>
          </div>
          <h4 className="text-lg font-extrabold text-foreground leading-tight">{question.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{question.context}</p>

          {/* Options INSIDE the card so they move together */}
          <div className="mt-4 space-y-2">
            <button
              onClick={() => !selectedChoice && triggerSwipe("left")}
              disabled={!!selectedChoice || !!exitDir}
              className={`w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${getBtnStyle("A")}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                <ArrowLeftIcon className="h-4 w-4 text-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground flex-1">{question.optionA.label}</span>
              {selectedChoice && question.optionA.correct && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
              {selectedChoice === "A" && !question.optionA.correct && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
            </button>
            <button
              onClick={() => !selectedChoice && triggerSwipe("right")}
              disabled={!!selectedChoice || !!exitDir}
              className={`w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${getBtnStyle("B")}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10">
                <ArrowRightIcon className="h-4 w-4 text-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground flex-1">{question.optionB.label}</span>
              {selectedChoice && question.optionB.correct && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
              {selectedChoice === "B" && !question.optionB.correct && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
            </button>
          </div>
        </div>
      </motion.div>

      {!selectedChoice && (
        <p className="mt-2 text-center text-[10px] text-muted-foreground">Potiahni vľavo (A) alebo vpravo (B) · alebo použi šípky ← →</p>
      )}
    </div>
  );
};

const QuizModal = ({ lesson, onClose, onComplete }: QuizModalProps) => {
  const { currentLives, loseLife } = useAuth();
  const { t } = useI18n();
  const { playCorrect, playWrongMild, playWrongSerious, playReward, playLifeLost } = useSound();

  // Load saved progress
  const savedProgress = (() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY(lesson.id));
      if (raw) return JSON.parse(raw) as SavedProgress;
    } catch {}
    return null;
  })();

  const [currentIndex, setCurrentIndex] = useState(savedProgress?.currentIndex ?? 0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(savedProgress?.score ?? 0);
  const [errors, setErrors] = useState(savedProgress?.errors ?? 0);
  const [finished, setFinished] = useState(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [selectedTF, setSelectedTF] = useState<boolean | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<"A" | "B" | null>(null);
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, { correct: boolean }>>(savedProgress?.answeredQuestions ?? {});

  const question: Question = lesson.questions[currentIndex];
  const progressVal = ((currentIndex + (answered ? 1 : 0)) / lesson.questions.length) * 100;

  // Save progress on each answered question
  useEffect(() => {
    if (finished) {
      localStorage.removeItem(PROGRESS_KEY(lesson.id));
      return;
    }
    if (Object.keys(answeredQuestions).length > 0) {
      const data: SavedProgress = { currentIndex, score, errors, answeredQuestions };
      localStorage.setItem(PROGRESS_KEY(lesson.id), JSON.stringify(data));
    }
  }, [currentIndex, score, errors, answeredQuestions, finished, lesson.id]);

  const markCorrect = useCallback((correct: boolean) => {
    setAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      playCorrect();
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);
      if (newErrors >= 3) {
        playWrongSerious();
      } else {
        playWrongMild();
      }
    }
    setShowAIHelp(false);
    setAnsweredQuestions(prev => ({ ...prev, [currentIndex]: { correct } }));
  }, [playCorrect, playWrongMild, playWrongSerious, errors, currentIndex]);

  const handleChoiceAnswer = useCallback((index: number) => {
    if (answered) return;
    setSelectedChoiceIdx(index);
    markCorrect(index === (question as ChoiceQuestion).correctIndex);
  }, [answered, question, markCorrect]);

  const handleTFAnswer = useCallback((value: boolean) => {
    if (answered) return;
    setSelectedTF(value);
    markCorrect(value === (question as TrueFalseQuestion).correctAnswer);
  }, [answered, question, markCorrect]);

  const handleSliderSubmit = useCallback((value: number) => {
    const q = question as SliderQuestion;
    markCorrect(Math.abs(value - q.correctValue) <= q.tolerance);
  }, [question, markCorrect]);

  const handleOrderSubmit = useCallback((order: number[]) => {
    const q = question as OrderQuestion;
    markCorrect(q.correctOrder.every((v, i) => v === order[i]));
  }, [question, markCorrect]);

  const handleScenarioAnswer = useCallback((choice: "A" | "B") => {
    if (answered) return;
    setSelectedScenario(choice);
    const q = question as ScenarioQuestion;
    const opt = choice === "A" ? q.optionA : q.optionB;
    markCorrect(opt.correct);
  }, [answered, question, markCorrect]);

  const handleNext = () => {
    if (currentIndex < lesson.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setIsCorrect(null);
      setSelectedChoiceIdx(null);
      setSelectedTF(null);
      setSelectedScenario(null);
      setShowAIHelp(false);
    } else {
      setFinished(true);
      if (errors > 3) {
        loseLife();
        playLifeLost();
      }
      playReward();
    }
  };

  const earnedXp = Math.round((score / lesson.questions.length) * lesson.xp);
  const coinsEarned = Math.round(earnedXp / 2);
  const isPerfect = score === lesson.questions.length;

  // No lives = can't play
  if (currentLives <= 0 && !finished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
          className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-float">
          <Heart className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-foreground mb-2">{t("quiz.noLives")}</h2>
          <p className="text-muted-foreground mb-6">{t("quiz.waitForLives")}</p>
          <button onClick={onClose}
            className="w-full rounded-2xl gradient-primary px-6 py-4 font-bold text-primary-foreground shadow-button">
            {t("common.close")}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const motivationalPhrases = [
    "Takmer dokonalé… dáš to bez chyby? 🔥",
    "Skús to ešte raz a ukáž, že na to máš! 💪",
    "Len kúsok chýbal k dokonalosti! 🎯",
    "Toto zvládneš lepšie, vieš to! 🚀",
    "Každý pokus ťa robí múdrejším! 🧠",
  ];

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-float">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${isPerfect ? "gradient-gold" : "gradient-primary"}`}>
            <Trophy className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h2 className="mb-2 text-2xl font-extrabold text-foreground">{isPerfect ? t("quiz.perfect") : t("quiz.excellent")}</h2>
          <p className="mb-1 text-muted-foreground">{t("quiz.correctAnswers")}: {score}/{lesson.questions.length}</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <p className="text-lg font-bold text-xp">+{earnedXp} XP</p>
            <div className="flex items-center gap-1">
              <span className="text-lg">🪙</span><p className="text-lg font-bold text-coin">+{coinsEarned} F</p>
            </div>
          </div>
          {errors > 3 && (
            <p className="text-sm text-destructive mb-2 flex items-center justify-center gap-1">
              <Heart className="h-4 w-4" /> {t("quiz.lostLife")} ({errors} {t("quiz.errors")})
            </p>
          )}
          {!isPerfect && <p className="text-sm text-destructive mb-4">{t("quiz.notPerfectHint")}</p>}
          <button onClick={() => onComplete(earnedXp, score, lesson.questions.length)}
            className="w-full rounded-2xl gradient-primary px-6 py-4 font-bold text-primary-foreground shadow-button transition-all hover:opacity-90 active:scale-95">
            {t("quiz.continue")}
          </button>
          {!isPerfect && (
            <div className="mt-3">
              <button onClick={() => {
                setCurrentIndex(0); setAnswered(false); setIsCorrect(null); setScore(0); setErrors(0); setFinished(false);
                setSelectedChoiceIdx(null); setSelectedTF(null); setSelectedScenario(null); setShowAIHelp(false); setAnsweredQuestions({});
                localStorage.removeItem(PROGRESS_KEY(lesson.id));
              }}
                className="w-full rounded-2xl bg-accent/10 border border-accent/20 px-6 py-3 font-bold text-accent transition-all hover:bg-accent/20 active:scale-95">
                🔄 {t("quiz.tryAgain")}
              </button>
              <p className="mt-2 text-xs text-muted-foreground italic">
                {motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  const typeBadge = {
    choice: t("quiz.choice"), truefalse: t("quiz.trueFalse"), slider: t("quiz.slider"), order: t("quiz.order"),
    scenario: "🎬 Reálna situácia",
  }[question.type];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md rounded-3xl bg-card p-6 shadow-float max-h-[85vh] overflow-y-auto pb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-foreground">{lesson.title}</h3>
          <div className="flex items-center gap-2">
            {/* Lives in quiz */}
            <div className="flex items-center gap-1 text-destructive">
              <Heart className="h-4 w-4 fill-destructive" />
              <span className="text-xs font-bold">{currentLives}</span>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Progress value={progressVal} className="mb-4 h-3" />

        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{typeBadge}</span>
          <span className="text-xs text-muted-foreground">{currentIndex + 1}/{lesson.questions.length}</span>
          {errors > 0 && <span className="text-xs text-destructive font-bold ml-auto">{errors} {t("quiz.errors")}</span>}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={question.id} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
            {question.type !== "scenario" && (
              <p className="mb-6 text-lg font-bold text-foreground">{question.text}</p>
            )}
            {question.type === "choice" && <ChoiceView question={question} selectedAnswer={selectedChoiceIdx} isCorrect={isCorrect} onAnswer={handleChoiceAnswer} />}
            {question.type === "truefalse" && <TrueFalseView question={question} selectedAnswer={selectedTF} isCorrect={isCorrect} onAnswer={handleTFAnswer} />}
            {question.type === "slider" && <SliderView question={question} submitted={answered} isCorrect={isCorrect} onSubmit={handleSliderSubmit} />}
            {question.type === "order" && <OrderView question={question} submitted={answered} isCorrect={isCorrect} onSubmit={handleOrderSubmit} />}
            {question.type === "scenario" && (
              <>
                <ScenarioView question={question} selectedChoice={selectedScenario} onAnswer={handleScenarioAnswer} />
                <p className="mt-4 text-sm font-semibold text-foreground">{question.text}</p>
              </>
            )}

            {answered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-4 rounded-2xl p-4 ${isCorrect ? "bg-primary/10" : "bg-destructive/10"}`}>
                <p className="text-sm font-semibold text-foreground">{isCorrect ? t("quiz.correct") : t("quiz.incorrect")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{question.explanation}</p>
              </motion.div>
            )}

            {/* AI Help after answer */}
            {answered && (
              <div className="mt-3">
                {!showAIHelp ? (
                  <button onClick={() => setShowAIHelp(true)}
                    className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 font-semibold transition-colors">
                    <Bot className="h-4 w-4" /> {t("quiz.askAI")}
                  </button>
                ) : (
                  <AIQuestionHelper questionText={question.text} explanation={question.explanation} onClose={() => setShowAIHelp(false)} />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {answered && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={handleNext}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary px-6 py-4 font-bold text-primary-foreground shadow-button transition-all hover:opacity-90 active:scale-95">
            {currentIndex < lesson.questions.length - 1 ? (<>{t("quiz.nextQuestion")} <ArrowRight className="h-5 w-5" /></>) : t("quiz.finish")}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QuizModal;
