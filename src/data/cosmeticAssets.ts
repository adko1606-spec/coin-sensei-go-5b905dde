// Cosmetic image imports
import hatTophat from "@/assets/cosmetics/hat_tophat.png";
import hatCap from "@/assets/cosmetics/hat_cap.png";
import hatCowboy from "@/assets/cosmetics/hat_cowboy.png";
import hatCrown from "@/assets/cosmetics/hat_crown.png";
import glassesSun from "@/assets/cosmetics/glasses_sun.png";
import glassesNerd from "@/assets/cosmetics/glasses_nerd.png";
import glassesMonocle from "@/assets/cosmetics/glasses_monocle.png";

// Effect image imports
import fireEffect from "@/assets/effects/fire_effect.png";
import iceEffect from "@/assets/effects/ice_effect.png";
import goldEffect from "@/assets/effects/gold_effect.png";
import rainbowEffect from "@/assets/effects/rainbow_effect.png";
import raysEffect from "@/assets/effects/rays_effect.png";
import auraEffect from "@/assets/effects/aura_effect.png";

export const COSMETIC_IMAGES: Record<string, string> = {
  hat_tophat: hatTophat,
  hat_cap: hatCap,
  hat_cowboy: hatCowboy,
  hat_crown: hatCrown,
  glasses_sun: glassesSun,
  glasses_nerd: glassesNerd,
  glasses_monocle: glassesMonocle,
};

export const EFFECT_IMAGES: Record<string, string> = {
  color_fire: fireEffect,
  color_ice: iceEffect,
  color_gold: goldEffect,
  color_rainbow: rainbowEffect,
  color_rays: raysEffect,
  color_aura: auraEffect,
};

// Per-character positioning for hats and glasses (percentages)
// top/left are % of container, width is % of container width
interface ItemPosition {
  top: number;
  left: number;
  width: number;
  rotation?: number;
}

interface CharacterPositions {
  hat: Record<string, ItemPosition>;
  glasses: Record<string, ItemPosition>;
}

const defaultHatPos: ItemPosition = { top: -15, left: 50, width: 65 };
const defaultGlassesPos: ItemPosition = { top: 30, left: 50, width: 55 };

// Custom positions per character. Keys match character IDs.
// top/left in %, width in %, rotation in degrees
// Human portraits: eyes ~28-35%, head top ~-10 to -5%
// Animal full-body: eyes ~20-28%, head top ~-2 to 5%
const defaultHats: Record<string, ItemPosition> = {
  hat_tophat: { top: -35, left: 12, width: 75 },
  hat_cap: { top: -30, left: 12, width: 75 },
  hat_cowboy: { top: -35, left: 12, width: 75 },
  hat_crown: { top: -42, left: 12, width: 75 },
};

export const CHARACTER_POSITIONS: Record<string, CharacterPositions> = {
  buffett: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 30, left: 50, width: 55 },
      glasses_nerd: { top: 28, left: 50, width: 50 },
      glasses_monocle: { top: 30, left: 40, width: 30 },
    },
  },
  satoshi: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 28, left: 48, width: 48 },
      glasses_nerd: { top: 26, left: 48, width: 44 },
      glasses_monocle: { top: 28, left: 40, width: 28 },
    },
  },
  trump: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 28, left: 50, width: 52 },
      glasses_nerd: { top: 26, left: 50, width: 48 },
      glasses_monocle: { top: 28, left: 42, width: 30 },
    },
  },
  bezos: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 26, left: 50, width: 50 },
      glasses_nerd: { top: 24, left: 50, width: 46 },
      glasses_monocle: { top: 26, left: 42, width: 28 },
    },
  },
  zuckerberg: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 28, left: 50, width: 50 },
      glasses_nerd: { top: 26, left: 50, width: 46 },
      glasses_monocle: { top: 28, left: 42, width: 28 },
    },
  },
  musk: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 30, left: 50, width: 50 },
      glasses_nerd: { top: 28, left: 50, width: 46 },
      glasses_monocle: { top: 30, left: 42, width: 28 },
    },
  },
  dalio: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 28, left: 50, width: 50 },
      glasses_nerd: { top: 26, left: 50, width: 46 },
      glasses_monocle: { top: 28, left: 42, width: 28 },
    },
  },
  bull: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 22, left: 50, width: 38 },
      glasses_nerd: { top: 20, left: 50, width: 35 },
      glasses_monocle: { top: 22, left: 44, width: 22 },
    },
  },
  bear: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 20, left: 50, width: 36 },
      glasses_nerd: { top: 18, left: 50, width: 32 },
      glasses_monocle: { top: 20, left: 44, width: 22 },
    },
  },
  unicorn: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 24, left: 40, width: 32 },
      glasses_nerd: { top: 22, left: 40, width: 28 },
      glasses_monocle: { top: 24, left: 35, width: 20 },
    },
  },
  whale: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 24, left: 38, width: 30 },
      glasses_nerd: { top: 22, left: 38, width: 26 },
      glasses_monocle: { top: 24, left: 32, width: 18 },
    },
  },
  diamond_hands: {
    hat: { ...defaultHats },
    glasses: {
      glasses_sun: { top: 18, left: 50, width: 40 },
      glasses_nerd: { top: 16, left: 50, width: 36 },
      glasses_monocle: { top: 18, left: 44, width: 24 },
    },
  },
};

export function getItemPosition(
  characterId: string | undefined,
  category: "hat" | "glasses",
  itemId: string,
): ItemPosition {
  if (characterId && CHARACTER_POSITIONS[characterId]) {
    const charPos = CHARACTER_POSITIONS[characterId][category];
    if (charPos[itemId]) return charPos[itemId];
  }
  return category === "hat" ? defaultHatPos : defaultGlassesPos;
}
