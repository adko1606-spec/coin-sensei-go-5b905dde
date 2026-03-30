import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-new.png";

const EMOJIS = ["💰", "📈", "🏦", "💳", "🪙", "📊", "💎", "🎯", "🔥", "⭐", "🚀", "🏆"];

function playJingle() {
  try {
    const ctx = new AudioContext();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3 + i * 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + 0.4 + i * 0.12);
    });
  } catch {}
}

const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    playJingle();
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Floating emojis background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {EMOJIS.map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-3xl opacity-10"
                initial={{
                  x: `${(i * 37) % 100}%`,
                  y: `${(i * 23 + 10) % 100}%`,
                  scale: 0.5 + (i % 3) * 0.3,
                }}
                animate={{
                  y: [`${(i * 23 + 10) % 100}%`, `${((i * 23 + 10) % 100) - 15}%`],
                  opacity: [0.08, 0.15, 0.08],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          {/* Logo + Name */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center z-10"
          >
            <img src={logo} alt="FinAp" className="h-28 w-28 mb-4" />
            <h1 className="text-4xl font-black text-primary tracking-tight">FinAp</h1>
            <p className="text-sm text-muted-foreground mt-2">Nauč sa ovládať financie</p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="mt-8 w-48 h-1.5 rounded-full bg-muted overflow-hidden z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
