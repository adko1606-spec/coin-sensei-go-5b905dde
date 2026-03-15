import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GraduationCap } from "lucide-react";
import StatsBar from "@/components/StatsBar";
import LessonCard from "@/components/LessonCard";
import CategoryFilter from "@/components/CategoryFilter";
import QuizModal from "@/components/QuizModal";
import { lessons as initialLessons, type Lesson } from "@/data/lessons";
import mascot from "@/assets/mascot.png";

const Index = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [xp, setXp] = useState(0);
  const [streak] = useState(3);

  const completedCount = lessons.filter((l) => l.completed).length;
  const level = Math.floor(xp / 50) + 1;

  const filteredLessons = selectedCategory
    ? lessons.filter((l) => l.category === selectedCategory)
    : lessons;

  const handleComplete = (earnedXp: number) => {
    if (!activeLesson) return;
    setXp((prev) => prev + earnedXp);
    setLessons((prev) => {
      const updated = prev.map((l) =>
        l.id === activeLesson.id ? { ...l, completed: true } : l
      );
      // Unlock next lesson
      const currentIdx = updated.findIndex((l) => l.id === activeLesson.id);
      if (currentIdx < updated.length - 1) {
        updated[currentIdx + 1] = { ...updated[currentIdx + 1], locked: false };
      }
      return updated;
    });
    setActiveLesson(null);
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-blue">
              <GraduationCap className="h-7 w-7 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">FinAp</h1>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">
              {completedCount}/{lessons.length}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center gap-4"
        >
          <img src={mascot} alt="FinAp korytnačka" className="h-16 w-16" />
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Ahoj! 👋</h2>
            <p className="text-muted-foreground">
              Nauč sa ovládať svoje financie
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-6">
          <StatsBar xp={xp} streak={streak} level={level} />
        </div>

        {/* Categories */}
        <div className="mt-6">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Learning Path */}
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

      {/* Quiz Modal */}
      <AnimatePresence>
        {activeLesson && (
          <QuizModal
            lesson={activeLesson}
            onClose={() => setActiveLesson(null)}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
