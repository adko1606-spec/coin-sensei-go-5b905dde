import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TapRaceProps {
  onClose: () => void;
}

const GAME_DURATION = 10000; // 10 seconds
const TICK_INTERVAL = 300; // price update every 300ms

const TapRace = ({ onClose }: TapRaceProps) => {
  const { t } = useI18n();
  const { user, refreshProfile } = useAuth();
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [price, setPrice] = useState(100);
  const [trend, setTrend] = useState<"up" | "down">("up");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [reward, setReward] = useState(0);
  const priceRef = useRef(100);
  const trendRef = useRef<"up" | "down">("up");
  const scoreRef = useRef(0);

  const startGame = useCallback(() => {
    setPhase("playing");
    setScore(0);
    setPrice(100);
    setTimeLeft(GAME_DURATION);
    priceRef.current = 100;
    trendRef.current = "up";
    scoreRef.current = 0;
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const tickInterval = setInterval(() => {
      const changeTrend = Math.random() < 0.25;
      if (changeTrend) {
        trendRef.current = trendRef.current === "up" ? "down" : "up";
        setTrend(trendRef.current);
      }

      const change = (Math.random() * 3 + 1) * (trendRef.current === "up" ? 1 : -1);
      priceRef.current = Math.max(50, Math.min(150, priceRef.current + change));
      setPrice(Math.round(priceRef.current * 100) / 100);
    }, TICK_INTERVAL);

    const timeInterval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          setPhase("done");
          const finalScore = scoreRef.current;
          const r = Math.max(0, Math.round(finalScore * 2));
          setReward(r);
          // Award Fince
          if (r > 0 && user) {
            supabase.from("profiles").select("coins").eq("user_id", user.id).single().then(({ data }) => {
              if (data) {
                supabase.from("profiles").update({ coins: (data as any).coins + r } as any).eq("user_id", user.id).then(() => refreshProfile());
              }
            });
          }
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      clearInterval(tickInterval);
      clearInterval(timeInterval);
    };
  }, [phase, user]);

  const handleAction = (action: "buy" | "sell") => {
    if (phase !== "playing") return;
    const isCorrect = (action === "buy" && trendRef.current === "up") || (action === "sell" && trendRef.current === "down");
    const points = isCorrect ? 10 : -5;
    scoreRef.current = Math.max(0, scoreRef.current + points);
    setScore(scoreRef.current);
  };

  const priceColor = trend === "up" ? "text-primary" : "text-destructive";
  const barWidth = (timeLeft / GAME_DURATION) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-card rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <h3 className="font-bold text-foreground">{t("game.tapRace")}</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {phase === "ready" && (
              <div className="text-center space-y-4">
                <p className="text-6xl">🏎️</p>
                <p className="text-sm text-muted-foreground">{t("game.tapRaceDesc")}</p>
                <Button className="w-full" size="lg" onClick={startGame}>
                  <Zap className="h-5 w-5 mr-2" />
                  {t("game.start")}
                </Button>
              </div>
            )}

            {phase === "playing" && (
              <div className="space-y-4">
                {/* Timer bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>

                {/* Price display */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t("common.price")}</p>
                  <motion.p
                    key={price}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={`text-4xl font-extrabold ${priceColor}`}
                  >
                    {price.toFixed(1)} F
                  </motion.p>
                  <p className="text-lg mt-1">
                    {trend === "up" ? "📈" : "📉"}
                  </p>
                </div>

                {/* Score */}
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">{t("game.score")}: </span>
                  <span className="font-bold text-foreground">{score}</span>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="default"
                    size="lg"
                    className="h-16 text-lg font-extrabold"
                    onClick={() => handleAction("buy")}
                  >
                    {t("game.buy")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="h-16 text-lg font-extrabold"
                    onClick={() => handleAction("sell")}
                  >
                    {t("game.sell")}
                  </Button>
                </div>
              </div>
            )}

            {phase === "done" && (
              <div className="text-center space-y-4">
                <Trophy className="h-12 w-12 text-accent mx-auto" />
                <h3 className="text-xl font-extrabold text-foreground">{t("game.timeUp")}</h3>
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">{t("game.yourScore")}</p>
                  <p className="text-3xl font-extrabold text-foreground">{score}</p>
                </div>
                {reward > 0 && (
                  <div className="rounded-xl bg-coin/10 border border-coin/20 p-3">
                    <p className="text-sm font-bold text-coin">{t("game.reward")}: +{reward} Fince 🪙</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={startGame}>{t("game.playAgain")}</Button>
                  <Button variant="outline" className="flex-1" onClick={onClose}>{t("common.close")}</Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TapRace;
