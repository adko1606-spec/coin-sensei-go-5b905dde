import { motion } from "framer-motion";
import { COSMETIC_IMAGES, EFFECT_IMAGES, getItemPosition } from "@/data/cosmeticAssets";
import {
  getCenterCorrection,
  getCharacterCenterOffset,
  getCosmeticVisualCenter,
  getEffectVisualCenter,
} from "@/data/cosmeticAnchors";

interface CosmeticItem {
  id: string;
  category: string;
  icon: string;
  name: string;
}

interface CharacterAvatarProps {
  characterId?: string;
  characterImage?: string;
  characterName?: string;
  equippedItems: CosmeticItem[];
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showEffects?: boolean;
  effectScale?: number;
}

const SIZE_MAP = {
  sm: { container: "h-10 w-10", effectScale: 1.6 },
  md: { container: "h-20 w-20", effectScale: 1.6 },
  lg: { container: "h-24 w-24", effectScale: 1.6 },
  xl: { container: "h-32 w-32", effectScale: 1.6 },
};

const EFFECT_ANIMATIONS: Record<string, {
  animate?: Record<string, any>;
  duration: number;
  ease: string;
}> = {
  color_fire: { animate: { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }, duration: 1.5, ease: "easeInOut" },
  color_ice: { animate: { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }, duration: 2, ease: "easeInOut" },
  color_gold: { animate: { rotate: [0, 360] }, duration: 10, ease: "linear" },
  color_rainbow: { animate: { rotate: [0, 360] }, duration: 8, ease: "linear" },
  color_rays: { animate: { rotate: [0, 360], scale: [0.95, 1.05, 0.95] }, duration: 6, ease: "linear" },
  color_aura: { animate: { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }, duration: 2.5, ease: "easeInOut" },
  color_lightning: { animate: { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }, duration: 1.2, ease: "easeInOut" },
  color_sakura: { animate: { rotate: [0, 10, -10, 0], opacity: [0.8, 1, 0.8] }, duration: 4, ease: "easeInOut" },
};

const CharacterAvatar = ({
  characterId,
  characterImage,
  characterName,
  equippedItems,
  size = "md",
  className = "",
  showEffects = true,
  effectScale: customEffectScale,
}: CharacterAvatarProps) => {
  const s = SIZE_MAP[size];
  const finalEffectScale = customEffectScale ?? s.effectScale;

  const hat = equippedItems.find((i) => i.category === "hat");
  const glasses = equippedItems.find((i) => i.category === "glasses");
  const accessories = equippedItems.filter((i) => i.category === "accessory");
  const effect = equippedItems.find((i) => i.category === "color");

  const hatImage = hat ? COSMETIC_IMAGES[hat.id] : null;
  const glassesImage = glasses ? COSMETIC_IMAGES[glasses.id] : null;
  const effectImage = effect ? EFFECT_IMAGES[effect.id] : null;
  const effectAnim = effect ? EFFECT_ANIMATIONS[effect.id] : null;

  const hatPos = hat ? getItemPosition(characterId, "hat", hat.id) : null;
  const glassesPos = glasses ? getItemPosition(characterId, "glasses", glasses.id) : null;
  const characterCenterOffset = getCharacterCenterOffset(characterId);

  const hatCenter = hat ? getCosmeticVisualCenter(hat.id) : null;
  const glassesCenter = glasses ? getCosmeticVisualCenter(glasses.id) : null;
  const effectCenter = effect ? getEffectVisualCenter(effect.id) : null;

  const hatCorrection = hat && hatPos && hatCenter ? getCenterCorrection(hatCenter, hatPos.width) : null;
  const glassesCorrection =
    glasses && glassesPos && glassesCenter ? getCenterCorrection(glassesCenter, glassesPos.width) : null;

  const effectSizePercent = finalEffectScale * 100;
  const effectCorrection = effectCenter ? getCenterCorrection(effectCenter, effectSizePercent) : { x: 0, y: 0 };

  return (
    <div className={`relative ${s.container} ${className}`} style={{ overflow: "visible" }}>
      {/* Background effect image */}
      {showEffects && effectImage && (
        <motion.div
          className="absolute z-0 pointer-events-none"
          style={{
            top: `${50 + characterCenterOffset.y + effectCorrection.y}%`,
            left: `${50 + characterCenterOffset.x + effectCorrection.x}%`,
            width: `${finalEffectScale * 100}%`,
            height: `${finalEffectScale * 100}%`,
            transform: "translate(-50%, -50%)",
            transformOrigin: "center center",
          }}
          animate={effectAnim?.animate}
          transition={{
            duration: effectAnim?.duration ?? 2,
            repeat: Infinity,
            ease: effectAnim?.ease as any ?? "easeInOut",
          }}
        >
          <img
            src={effectImage}
            alt="effect"
            className="w-full h-full object-contain"
            style={{ display: "block" }}
            loading="lazy"
          />
        </motion.div>
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

      {/* Hat image overlay */}
      {hat && hatImage && hatPos && (
        <motion.div
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute z-20 pointer-events-none"
          style={{
            top: `${hatPos.top + (hatCorrection?.y ?? 0)}%`,
            left: `${hatPos.left + (hatCorrection?.x ?? 0)}%`,
            width: `${hatPos.width}%`,
            transform: `translateX(-50%) rotate(${hatPos.rotation ?? 0}deg)`,
          }}
        >
          <img src={hatImage} alt={hat.name} className="w-full h-auto" loading="lazy" />
        </motion.div>
      )}

      {/* Glasses image overlay */}
      {glasses && glassesImage && glassesPos && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute z-20 pointer-events-none"
          style={{
            top: `${glassesPos.top + (glassesCorrection?.y ?? 0)}%`,
            left: `${glassesPos.left + (glassesCorrection?.x ?? 0)}%`,
            width: `${glassesPos.width}%`,
            transform: `translateX(-50%) rotate(${glassesPos.rotation ?? 0}deg)`,
          }}
        >
          <img src={glassesImage} alt={glasses.name} className="w-full h-auto" loading="lazy" />
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
