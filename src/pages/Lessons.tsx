import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BookOpen, Coins } from "lucide-react";
import LessonCard from "@/components/LessonCard";
import CategoryFilter from "@/components/CategoryFilter";
import QuizModal from "@/components/QuizModal";
import BottomNav from "@/components/BottomNav";
import { lessons as initialLessons, type Lesson } from "@/data/lessons";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-new.png";

const Lessons = () => {
  const { user, profile, totalXp, loading, saveProgress, isLessonCompleted } = useAuth();

  const [searchParams] = useSearchParams();
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const coins = (profile as any)?.coins ?? 0;

  useEffect(() => {
    if (!loading && user) {
      setLessons((prev) => {
        const updated = prev.map((l) => ({
          ...l,
          completed: isLessonCompleted(l.id),
        }));
        for (let i = 0; i < updated.length; i++) {
          if (i === 0) {
            updated[i].locked = false;
          } else {
            updated[i].locked = !updated[i - 1].completed;
          }
        }
        return updated;
      });
    }
  }, [loading, user, isLessonCompleted]);

  const completedCount = lessons.filter((l) => l.completed).length;

  const filteredLessons = selectedCategory
    ? lessons.filter((l) => l.category === selectedCategory)
    : lessons;

  const handleComplete = async (earnedXp: number, score: number, totalQuestions: number) => {
    if (!activeLesson) return;
    await saveProgress(activeLesson.id, score, earnedXp, activeLesson.questions.length);
    setLessons((prev) => {
      const updated = prev.map((l) =>
        l.id === activeLesson.id ? { ...l, completed: true } : l
      );
      const currentIdx = updated.findIndex((l) => l.id === activeLesson.id);
      if (currentIdx < updated.length - 1) {
        updated[currentIdx + 1] = { ...updated[currentIdx + 1], locked: false };
      }
      return updated;
    });
    setActiveLesson(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">Načítavam...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FinAp logo" className="h-20 w-20" />
            <h1 className="text-2xl font-extrabold text-primary">FinAp</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                {completedCount}/{lessons.length}
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1">
              <Coins className="h-4 w-4 text-coin" />
              <span className="text-sm font-bold text-coin">{coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-8">
        <div className="mt-6">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          {filteredLessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              index={index}
              onStart={setActiveLesson}
            />
          ))}
        </div>
      </main>

      <AnimatePresence>
        {activeLesson && (
          <QuizModal
            lesson={activeLesson}
            onClose={() => setActiveLesson(null)}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Lessons;
