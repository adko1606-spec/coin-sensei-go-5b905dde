import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, ArrowLeft, Lightbulb, GraduationCap, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studyContent, type StudyCategory, type StudyTopic } from "@/data/studyContent";
import { getLocalizedStudyCategory } from "@/data/studyLocales";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/logo-new.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Study = () => {
  const { profile, loading } = useAuth();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<StudyCategory | null>(null);
  const localizedContent = studyContent.map((c) => getLocalizedStudyCategory(c, language));

  const coins = (profile as any)?.coins ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {selectedCategory ? (
              <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-primary font-bold">
                <ArrowLeft className="h-5 w-5" />
                <span className="text-lg">{t("study.back")}</span>
              </button>
            ) : (
              <>
                <img src={logo} alt="FinLit logo" className="h-8 w-8" />
                <h1 className="text-lg font-extrabold text-primary">{t("study.title")}</h1>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">{localizedContent.length} {t("study.areas")}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1">
              <Coins className="h-4 w-4 text-coin" />
              <span className="text-sm font-bold text-coin">{coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-8">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div key="categories" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-6 flex flex-col gap-4">
              <p className="text-muted-foreground text-sm text-center mb-2">{t("study.selectArea")}</p>
              {localizedContent.map((category, idx) => (
                <motion.button key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-3xl">{category.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                    <span className="mt-1 inline-block text-xs text-primary font-bold">{category.topics.length} {t("study.topics")}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="mt-6">
              <div className="mb-6 text-center">
                <span className="text-5xl">{selectedCategory.emoji}</span>
                <h2 className="mt-2 text-2xl font-extrabold text-foreground">{selectedCategory.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selectedCategory.description}</p>
              </div>

              <Accordion type="single" collapsible className="flex flex-col gap-3">
                {selectedCategory.topics.map((topic, idx) => (
                  <AccordionItem key={topic.id} value={topic.id} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{idx + 1}</div>
                        <span className="font-bold text-foreground">{topic.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <TopicContent topic={topic} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate(`/lessons?category=${selectedCategory.id}`)}
                className="mt-6 w-full rounded-2xl gradient-primary py-4 text-center font-bold text-primary-foreground shadow-button text-lg">
                📝 {t("study.goToLessonsArea")}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

const TopicContent = ({ topic }: { topic: StudyTopic }) => {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <p className="text-foreground leading-relaxed">{topic.content}</p>
      {topic.example && (
        <div className="rounded-xl bg-accent/10 border border-accent/20 p-3">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-accent uppercase">{t("study.example")}</span>
          </div>
          <p className="text-sm text-foreground">{topic.example}</p>
        </div>
      )}
      {topic.tip && (
        <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-secondary" />
            <span className="text-xs font-bold text-secondary uppercase">{t("study.tip")}</span>
          </div>
          <p className="text-sm text-foreground">{topic.tip}</p>
        </div>
      )}
    </div>
  );
};

export default Study;
