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

const defaultHatPos: ItemPosition = { top: -8, left: 50, width: 70 };
const defaultGlassesPos: ItemPosition = { top: 38, left: 50, width: 60 };

// Custom positions per character. Keys match character IDs.
// top/left in %, width in %, rotation in degrees
export const CHARACTER_POSITIONS: Record<string, CharacterPositions> = {
  buffett: {
    hat: {
      hat_tophat: { top: -10, left: 50, width: 65 },
      hat_cap: { top: -2, left: 52, width: 70 },
      hat_cowboy: { top: -5, left: 50, width: 75 },
      hat_crown: { top: -5, left: 50, width: 55 },
    },
    glasses: {
      glasses_sun: { top: 40, left: 50, width: 55 },
      glasses_nerd: { top: 38, left: 50, width: 50 },
      glasses_monocle: { top: 38, left: 42, width: 35 },
    },
  },
  satoshi: {
    hat: {
      hat_tophat: { top: -12, left: 50, width: 60 },
      hat_cap: { top: -4, left: 52, width: 68 },
      hat_cowboy: { top: -6, left: 50, width: 72 },
      hat_crown: { top: -6, left: 50, width: 52 },
    },
    glasses: {
      glasses_sun: { top: 38, left: 50, width: 52 },
      glasses_nerd: { top: 36, left: 50, width: 48 },
      glasses_monocle: { top: 37, left: 42, width: 32 },
    },
  },
  trump: {
    hat: {
      hat_tophat: { top: -8, left: 50, width: 62 },
      hat_cap: { top: 0, left: 52, width: 70 },
      hat_cowboy: { top: -4, left: 50, width: 74 },
      hat_crown: { top: -4, left: 50, width: 54 },
    },
    glasses: {
      glasses_sun: { top: 42, left: 50, width: 55 },
      glasses_nerd: { top: 40, left: 50, width: 50 },
      glasses_monocle: { top: 40, left: 42, width: 34 },
    },
  },
  bezos: {
    hat: {
      hat_tophat: { top: -12, left: 50, width: 60 },
      hat_cap: { top: -4, left: 52, width: 68 },
      hat_cowboy: { top: -6, left: 50, width: 72 },
      hat_crown: { top: -6, left: 50, width: 52 },
    },
    glasses: {
      glasses_sun: { top: 38, left: 50, width: 52 },
      glasses_nerd: { top: 36, left: 50, width: 48 },
      glasses_monocle: { top: 37, left: 42, width: 32 },
    },
  },
  zuckerberg: {
    hat: {
      hat_tophat: { top: -10, left: 50, width: 62 },
      hat_cap: { top: -2, left: 52, width: 68 },
      hat_cowboy: { top: -5, left: 50, width: 72 },
      hat_crown: { top: -5, left: 50, width: 52 },
    },
    glasses: {
      glasses_sun: { top: 38, left: 50, width: 52 },
      glasses_nerd: { top: 36, left: 50, width: 48 },
      glasses_monocle: { top: 37, left: 42, width: 32 },
    },
  },
  musk: {
    hat: {
      hat_tophat: { top: -10, left: 50, width: 62 },
      hat_cap: { top: -2, left: 52, width: 70 },
      hat_cowboy: { top: -5, left: 50, width: 74 },
      hat_crown: { top: -5, left: 50, width: 54 },
    },
    glasses: {
      glasses_sun: { top: 40, left: 50, width: 54 },
      glasses_nerd: { top: 38, left: 50, width: 50 },
      glasses_monocle: { top: 39, left: 42, width: 34 },
    },
  },
  dalio: {
    hat: {
      hat_tophat: { top: -10, left: 50, width: 60 },
      hat_cap: { top: -2, left: 52, width: 66 },
      hat_cowboy: { top: -5, left: 50, width: 70 },
      hat_crown: { top: -5, left: 50, width: 52 },
    },
    glasses: {
      glasses_sun: { top: 38, left: 50, width: 52 },
      glasses_nerd: { top: 36, left: 50, width: 48 },
      glasses_monocle: { top: 37, left: 42, width: 32 },
    },
  },
  bull: {
    hat: {
      hat_tophat: { top: -12, left: 50, width: 58 },
      hat_cap: { top: -4, left: 52, width: 64 },
      hat_cowboy: { top: -6, left: 50, width: 68 },
      hat_crown: { top: -6, left: 50, width: 50 },
    },
    glasses: {
      glasses_sun: { top: 42, left: 50, width: 50 },
      glasses_nerd: { top: 40, left: 50, width: 46 },
      glasses_monocle: { top: 41, left: 42, width: 30 },
    },
  },
  bear: {
    hat: {
      hat_tophat: { top: -8, left: 50, width: 60 },
      hat_cap: { top: 0, left: 52, width: 66 },
      hat_cowboy: { top: -4, left: 50, width: 70 },
      hat_crown: { top: -4, left: 50, width: 52 },
    },
    glasses: {
      glasses_sun: { top: 40, left: 50, width: 52 },
      glasses_nerd: { top: 38, left: 50, width: 48 },
      glasses_monocle: { top: 39, left: 42, width: 32 },
    },
  },
  unicorn: {
    hat: {
      hat_tophat: { top: -14, left: 50, width: 56 },
      hat_cap: { top: -6, left: 52, width: 62 },
      hat_cowboy: { top: -8, left: 50, width: 66 },
      hat_crown: { top: -8, left: 50, width: 50 },
    },
    glasses: {
      glasses_sun: { top: 40, left: 50, width: 50 },
      glasses_nerd: { top: 38, left: 50, width: 46 },
      glasses_monocle: { top: 39, left: 42, width: 30 },
    },
  },
  whale: {
    hat: {
      hat_tophat: { top: -10, left: 50, width: 58 },
      hat_cap: { top: -2, left: 52, width: 64 },
      hat_cowboy: { top: -4, left: 50, width: 68 },
      hat_crown: { top: -5, left: 50, width: 50 },
    },
    glasses: {
      glasses_sun: { top: 36, left: 50, width: 50 },
      glasses_nerd: { top: 34, left: 50, width: 46 },
      glasses_monocle: { top: 35, left: 42, width: 30 },
    },
  },
  diamond_hands: {
    hat: {
      hat_tophat: { top: -10, left: 50, width: 60 },
      hat_cap: { top: -2, left: 52, width: 66 },
      hat_cowboy: { top: -4, left: 50, width: 70 },
      hat_crown: { top: -5, left: 50, width: 52 },
    },
    glasses: {
      glasses_sun: { top: 38, left: 50, width: 52 },
      glasses_nerd: { top: 36, left: 50, width: 48 },
      glasses_monocle: { top: 37, left: 42, width: 32 },
    },
  },
};

export function getItemPosition(
  characterId: string | undefined,
  category: "hat" | "glasses",
  itemId: string
): ItemPosition {
  if (characterId && CHARACTER_POSITIONS[characterId]) {
    const charPos = CHARACTER_POSITIONS[characterId][category];
    if (charPos[itemId]) return charPos[itemId];
  }
  return category === "hat" ? defaultHatPos : defaultGlassesPos;
}
