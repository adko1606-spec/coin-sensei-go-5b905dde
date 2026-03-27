import { motion } from "framer-motion";
import { Lock, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import type { Lesson } from "@/data/lessons";
import { useAuth } from "@/contexts/AuthContext";

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  onStart: (lesson: Lesson) => void;
}

const LessonCard = ({ lesson, index, onStart }: LessonCardProps) => {
  const { getLessonScore } = useAuth();
  const isEven = index % 2 === 0;
  const lessonScore = getLessonScore(lesson.id);
  const hasErrors = lessonScore !== null && lessonScore.score < 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex items-center gap-4"
      style={{ justifyContent: isEven ? "flex-start" : "flex-end" }}
    >
      {index > 0 && (
        <div
          className="absolute h-8 w-0.5 bg-border"
          style={{ top: -16, left: "50%" }}
        />
      )}

      <button
        onClick={() => !lesson.locked && onStart(lesson)}
        disabled={lesson.locked}
        className={`
          group relative flex w-72 items-center gap-4 rounded-2xl p-4 transition-all duration-300
          ${lesson.completed && hasErrors
            ? "bg-destructive/5 border-2 border-destructive/60"
            : lesson.completed
              ? "bg-primary/10 border-2 border-primary"
              : lesson.locked
                ? "bg-muted/50 border-2 border-border opacity-60 cursor-not-allowed"
                : "bg-card border-2 border-border shadow-card hover:shadow-float hover:scale-[1.02] cursor-pointer"
          }
        `}
      >
        <div
          className={`
            flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl
            ${lesson.completed && hasErrors
              ? "bg-destructive/10"
              : lesson.completed
                ? "gradient-primary"
                : lesson.locked
                  ? "bg-muted"
                  : "bg-primary/10"
            }
          `}
        >
          {lesson.locked ? (
            <Lock className="h-6 w-6 text-muted-foreground" />
          ) : lesson.completed && hasErrors ? (
            <AlertCircle className="h-6 w-6 text-destructive" />
          ) : lesson.completed ? (
            <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
          ) : (
            <span>{lesson.icon}</span>
          )}
        </div>

        <div className="flex-1 text-left">
          <h3 className="font-bold text-foreground">{lesson.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {lesson.description}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs font-bold text-xp">+{lesson.xp} XP</span>
            {lessonScore && (
              <span className={`text-xs font-bold ${hasErrors ? "text-destructive" : "text-primary"}`}>
                {lessonScore.score}%
              </span>
            )}
          </div>
        </div>

        {!lesson.locked && !lesson.completed && (
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>
    </motion.div>
  );
};

export default LessonCard;
