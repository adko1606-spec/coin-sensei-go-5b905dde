import { motion } from "framer-motion";

interface CosmeticItem {
  id: string;
  category: string;
  icon: string;
  name: string;
}

interface CharacterAvatarProps {
  characterImage?: string;
  characterName?: string;
  equippedItems: CosmeticItem[];
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showEffects?: boolean;
}

const SIZE_MAP = {
  sm: { container: "h-10 w-10", hat: "text-sm -top-2", glasses: "text-[10px] top-[30%]", effect: "inset-[-6px]" },
  md: { container: "h-20 w-20", hat: "text-2xl -top-4", glasses: "text-lg top-[28%]", effect: "inset-[-12px]" },
  lg: { container: "h-24 w-24", hat: "text-3xl -top-5", glasses: "text-xl top-[28%]", effect: "inset-[-16px]" },
  xl: { container: "h-32 w-32", hat: "text-4xl -top-6", glasses: "text-2xl top-[28%]", effect: "inset-[-20px]" },
};

const EFFECT_STYLES: Record<string, {
  className: string;
  animate?: Record<string, any>;
}> = {
  color_fire: {
    className: "fire-effect",
    animate: { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] },
  },
  color_ice: {
    className: "ice-effect",
    animate: { scale: [1, 1.03, 1], opacity: [0.7, 0.9, 0.7] },
  },
  color_gold: {
    className: "gold-effect",
    animate: { rotate: [0, 360] },
  },
  color_rainbow: {
    className: "rainbow-effect",
    animate: { rotate: [0, 360] },
  },
  color_rays: {
    className: "rays-effect",
    animate: { rotate: [0, 360], scale: [0.95, 1.05, 0.95] },
  },
  color_aura: {
    className: "aura-effect",
    animate: { scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] },
  },
};

const CharacterAvatar = ({
  characterImage,
  characterName,
  equippedItems,
  size = "md",
  className = "",
  showEffects = true,
}: CharacterAvatarProps) => {
  const s = SIZE_MAP[size];

  const hat = equippedItems.find((i) => i.category === "hat");
  const glasses = equippedItems.find((i) => i.category === "glasses");
  const accessories = equippedItems.filter((i) => i.category === "accessory");
  const effect = equippedItems.find((i) => i.category === "color");

  const effectStyle = effect ? EFFECT_STYLES[effect.id] : null;

  return (
    <div className={`relative ${s.container} ${className}`}>
      {/* Background effect */}
      {showEffects && effectStyle && (
        <motion.div
          className={`absolute ${s.effect} rounded-full ${effectStyle.className} z-0`}
          animate={effectStyle.animate}
          transition={{
            duration: effect?.id === "color_gold" || effect?.id === "color_rainbow" || effect?.id === "color_rays"
              ? 8 : 2,
            repeat: Infinity,
            ease: effect?.id === "color_gold" || effect?.id === "color_rainbow" || effect?.id === "color_rays"
              ? "linear" : "easeInOut",
          }}
        />
      )}

      {/* Character image */}
      <div className="relative z-10 h-full w-full rounded-2xl overflow-hidden">
        {characterImage ? (
          <img src={characterImage} alt={characterName || "Character"} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-accent/20">
            <span className={size === "sm" ? "text-lg" : "text-4xl"}>🎓</span>
          </div>
        )}
      </div>

      {/* Hat - positioned on top of head */}
      {hat && (
        <motion.div
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`absolute ${s.hat} left-1/2 -translate-x-1/2 z-20 drop-shadow-lg`}
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
        >
          {hat.icon}
        </motion.div>
      )}

      {/* Glasses - positioned on eyes */}
      {glasses && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`absolute ${s.glasses} left-1/2 -translate-x-1/2 z-20 drop-shadow-md`}
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}
        >
          {glasses.icon}
        </motion.div>
      )}

      {/* Accessories - small badges */}
      {accessories.length > 0 && (
        <div className="absolute -bottom-1 -right-1 flex gap-0.5 z-20">
          {accessories.map((acc) => (
            <span key={acc.id} className="text-xs bg-card rounded-full p-0.5 shadow-sm">
              {acc.icon}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterAvatar;
