import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { X, Check, ChevronRight, RotateCcw, Trophy, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { swipeCards, type SwipeCard } from "@/data/swipeCards";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SwipeLearnProps {
  onClose: () => void;
  onComplete?: (correct: number, total: number, xp: number) => void;
}

const XP_PER_CORRECT = 10;

const SwipeLearn = ({ onClose, onComplete }: SwipeLearnProps) => {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string; choice: "A" | "B" } | null>(null);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const leftOpacity = useTransform(x, [-150, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, 150], [0, 1]);

  const card: SwipeCard | undefined = swipeCards[index];
  const total = swipeCards.length;

  const handleAnswer = useCallback((choice: "A" | "B") => {
    if (!card || feedback) return;
    const opt = choice === "A" ? card.optionA : card.optionB;
    const isCorrect = opt.correct;
    setFeedback({ correct: isCorrect, explanation: opt.explanation, choice });
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setXp((p) => p + XP_PER_CORRECT);
    }
  }, [card, feedback]);

  const handleNext = () => {
    setFeedback(null);
    x.set(0);
    if (index + 1 >= total) {
      setDone(true);
      onComplete?.(correct + (feedback?.correct ? 0 : 0), total, xp);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (feedback) return;
    if (info.offset.x < -100) handleAnswer("A");
    else if (info.offset.x > 100) handleAnswer("B");
    else x.set(0);
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (feedback) {
        if (e.key === "Enter" || e.key === " ") handleNext();
        return;
      }
      if (e.key === "ArrowLeft") handleAnswer("A");
      if (e.key === "ArrowRight") handleAnswer("B");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedback, handleAnswer]);

  const handleRestart = () => {
    setIndex(0);
    setCorrect(0);
    setXp(0);
    setFeedback(null);
    setDone(false);
    x.set(0);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-md">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70" aria-label="Close">
            <X className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-foreground">Swipe & Learn</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-xp/10 px-2.5 py-1">
            <span className="text-xs font-bold text-xp">+{xp} XP</span>
          </div>
        </div>
        <div className="mx-auto max-w-lg px-4 pb-3">
          <Progress value={done ? 100 : ((index) / total) * 100} className="h-2" />
          <p className="mt-1 text-center text-[11px] font-bold text-muted-foreground">
            {done ? `${total} / ${total}` : `${index + 1} / ${total}`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <div className="rounded-3xl bg-card p-8 shadow-float text-center max-w-sm w-full">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full gradient-primary">
                  <Trophy className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground">Hotovo! 🎉</h2>
                <p className="mt-2 text-muted-foreground">
                  Správne odpovede: <span className="font-bold text-primary">{correct} / {total}</span>
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-xp/10 px-4 py-2">
                  <Sparkles className="h-4 w-4 text-xp" />
                  <span className="font-bold text-xp">+{xp} XP zarobených</span>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Button onClick={handleRestart} variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4" /> Skús znova
                  </Button>
                  <Button onClick={onClose} className="w-full">Zavrieť</Button>
                </div>
              </div>
            </motion.div>
          ) : card && (
            <motion.div key={card.id} className="absolute inset-0 flex items-center justify-center px-4 py-6">
              {/* Swipe indicators */}
              <motion.div style={{ opacity: leftOpacity }} className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 z-10">
                <div className="rounded-2xl border-4 border-destructive bg-destructive/20 px-4 py-2 -rotate-12">
                  <span className="text-xl font-extrabold text-destructive">A ←</span>
                </div>
              </motion.div>
              <motion.div style={{ opacity: rightOpacity }} className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 z-10">
                <div className="rounded-2xl border-4 border-primary bg-primary/20 px-4 py-2 rotate-12">
                  <span className="text-xl font-extrabold text-primary">→ B</span>
                </div>
              </motion.div>

              <motion.div
                drag={feedback ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                style={{ x, rotate }}
                className="relative w-full max-w-sm cursor-grab active:cursor-grabbing"
              >
                <div className="rounded-3xl bg-card p-6 shadow-float border border-border">
                  <div className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1">
                    <span className="text-[11px] font-bold text-accent">🎬 Reálna situácia</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-foreground leading-tight">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{card.context}</p>
                  <div className="my-4 h-px bg-border" />
                  <p className="text-base font-bold text-foreground">{card.question}</p>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleAnswer("A")}
                      disabled={!!feedback}
                      className="w-full flex items-center gap-3 rounded-2xl border-2 border-border bg-muted/30 p-3 text-left hover:border-destructive hover:bg-destructive/5 transition-all disabled:opacity-60"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                        <ArrowLeft className="h-4 w-4 text-destructive" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{card.optionA.label}</span>
                    </button>
                    <button
                      onClick={() => handleAnswer("B")}
                      disabled={!!feedback}
                      className="w-full flex items-center gap-3 rounded-2xl border-2 border-border bg-muted/30 p-3 text-left hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-60"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{card.optionB.label}</span>
                    </button>
                  </div>

                  <p className="mt-3 text-center text-[10px] text-muted-foreground">
                    Potiahni vľavo/vpravo alebo použi šípky ← →
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="absolute inset-x-0 bottom-0 px-4 pb-6">
              <div className={`mx-auto max-w-sm rounded-3xl p-5 shadow-float border-2 ${feedback.correct ? "bg-primary/10 border-primary" : "bg-destructive/10 border-destructive"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${feedback.correct ? "bg-primary" : "bg-destructive"}`}>
                    {feedback.correct ? <Check className="h-5 w-5 text-primary-foreground" /> : <X className="h-5 w-5 text-destructive-foreground" />}
                  </div>
                  <p className={`text-base font-extrabold ${feedback.correct ? "text-primary" : "text-destructive"}`}>
                    {feedback.correct ? "✅ Lepšia voľba!" : "❌ Nie ideálne"}
                  </p>
                  {feedback.correct && (
                    <span className="ml-auto text-xs font-bold text-xp">+{XP_PER_CORRECT} XP</span>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">{feedback.explanation}</p>
                <Button onClick={handleNext} className="w-full mt-4">
                  {index + 1 >= total ? "Dokončiť" : "Ďalej"} <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SwipeLearn;
