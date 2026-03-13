import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";
import type { Lesson, Question } from "@/data/lessons";
import { Progress } from "@/components/ui/progress";

interface QuizModalProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (xp: number) => void;
}

const QuizModal = ({ lesson, onClose, onComplete }: QuizModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question: Question = lesson.questions[currentIndex];
  const progress = ((currentIndex + (isCorrect !== null ? 1 : 0)) / lesson.questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === question.correctIndex;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < lesson.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setFinished(true);
    }
  };

  const earnedXp = Math.round((score / lesson.questions.length) * lesson.xp);

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-3xl bg-card p-8 text-center shadow-float"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full gradient-gold"
          >
            <Trophy className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <h2 className="mb-2 text-2xl font-extrabold text-foreground">Výborne! 🎉</h2>
          <p className="mb-1 text-muted-foreground">
            Správne odpovede: {score}/{lesson.questions.length}
          </p>
          <p className="mb-6 text-lg font-bold text-xp">+{earnedXp} XP</p>

          <button
            onClick={() => onComplete(earnedXp)}
            className="w-full rounded-2xl gradient-primary px-6 py-4 font-bold text-primary-foreground shadow-button transition-all hover:opacity-90 active:scale-95"
          >
            Pokračovať
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md rounded-3xl bg-card p-6 shadow-float"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-foreground">{lesson.title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-6 h-3" />

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
          >
            <p className="mb-6 text-lg font-bold text-foreground">{question.text}</p>

            <div className="space-y-3">
              {question.options.map((option, i) => {
                let styles = "border-border bg-card hover:bg-muted";
                if (selectedAnswer !== null) {
                  if (i === question.correctIndex) {
                    styles = "border-primary bg-primary/10";
                  } else if (i === selectedAnswer && !isCorrect) {
                    styles = "border-destructive bg-destructive/10";
                  }
                }

                return (
                  <motion.button
                    key={i}
                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(i)}
                    className={`w-full rounded-2xl border-2 p-4 text-left font-semibold transition-all ${styles}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">{option}</span>
                      {selectedAnswer !== null && i === question.correctIndex && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                      {selectedAnswer === i && !isCorrect && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 rounded-2xl p-4 ${
                  isCorrect ? "bg-primary/10" : "bg-destructive/10"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">
                  {isCorrect ? "✅ Správne!" : "❌ Nesprávne"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        {selectedAnswer !== null && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary px-6 py-4 font-bold text-primary-foreground shadow-button transition-all hover:opacity-90 active:scale-95"
          >
            {currentIndex < lesson.questions.length - 1 ? (
              <>
                Ďalšia otázka <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              "Dokončiť"
            )}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QuizModal;
