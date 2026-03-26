import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatsBar from "@/components/StatsBar";
import LessonCard from "@/components/LessonCard";
import CategoryFilter from "@/components/CategoryFilter";
import QuizModal from "@/components/QuizModal";
import { lessons as initialLessons, type Lesson } from "@/data/lessons";
import { useAuth } from "@/contexts/AuthContext";
import mascot from "@/assets/mascot.png";
import logo from "@/assets/logo.png";

const Index = () => {
  const { user, profile, totalXp, loading, signOut, saveProgress, isLessonCompleted } = useAuth();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [streak] = useState(3);

  // Sync progress from DB
  useEffect(() => {
    if (!loading && user) {
      setLessons((prev) => {
        const updated = prev.map((l) => ({
          ...l,
          completed: isLessonCompleted(l.id),
        }));
        // Unlock lessons based on completion
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

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const completedCount = lessons.filter((l) => l.completed).length;
  const level = Math.floor(totalXp / 50) + 1;

  const filteredLessons = selectedCategory
    ? lessons.filter((l) => l.category === selectedCategory)
    : lessons;

  const handleComplete = async (earnedXp: number, score: number) => {
    if (!activeLesson) return;
    await saveProgress(activeLesson.id, score, earnedXp);
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

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Študent";

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FinAp logo" className="h-20 w-20" />
            <h1 className="text-2xl font-extrabold text-foreground">FinAp</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                {completedCount}/{lessons.length}
              </span>
            </div>
            <button
              onClick={signOut}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              title="Odhlásiť sa"
            >
              <LogOut className="h-5 w-5" />
            </button>
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
          <img src={mascot} alt="FinAp maskot" className="h-16 w-16" />
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Ahoj, {displayName}! 👋</h2>
            <p className="text-muted-foreground">
              Nauč sa ovládať svoje financie
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-6">
          <StatsBar xp={totalXp} streak={streak} level={level} />
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
