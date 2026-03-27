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

const defaultHatPos: ItemPosition = { top: -18, left: 50, width: 55 };
const defaultGlassesPos: ItemPosition = { top: 32, left: 50, width: 50 };

// Custom positions per character. Keys match character IDs.
export const CHARACTER_POSITIONS: Record<string, CharacterPositions> = {
  buffett: {
    hat: {
      hat_tophat: { top: -20, left: 50, width: 50 },
      hat_cap: { top: -12, left: 50, width: 55 },
      hat_cowboy: { top: -15, left: 50, width: 60 },
      hat_crown: { top: -18, left: 50, width: 45 },
    },
    glasses: {
      glasses_sun: { top: 35, left: 50, width: 45 },
      glasses_nerd: { top: 33, left: 50, width: 42 },
      glasses_monocle: { top: 32, left: 50, width: 40 },
    },
  },
  satoshi: {
    hat: {
      hat_tophat: { top: -22, left: 50, width: 48 },
      hat_cap: { top: -14, left: 50, width: 52 },
      hat_cowboy: { top: -16, left: 50, width: 58 },
      hat_crown: { top: -20, left: 50, width: 42 },
    },
    glasses: {
      glasses_sun: { top: 34, left: 50, width: 44 },
      glasses_nerd: { top: 32, left: 50, width: 40 },
      glasses_monocle: { top: 33, left: 50, width: 38 },
    },
  },
  trump: {
    hat: {
      hat_tophat: { top: -18, left: 50, width: 50 },
      hat_cap: { top: -10, left: 50, width: 55 },
      hat_cowboy: { top: -14, left: 50, width: 60 },
      hat_crown: { top: -16, left: 50, width: 45 },
    },
    glasses: {
      glasses_sun: { top: 36, left: 50, width: 46 },
      glasses_nerd: { top: 34, left: 50, width: 42 },
      glasses_monocle: { top: 35, left: 50, width: 40 },
    },
  },
  bezos: {
    hat: {
      hat_tophat: { top: -22, left: 50, width: 48 },
      hat_cap: { top: -14, left: 50, width: 52 },
      hat_cowboy: { top: -16, left: 50, width: 56 },
      hat_crown: { top: -20, left: 50, width: 44 },
    },
    glasses: {
      glasses_sun: { top: 34, left: 50, width: 44 },
      glasses_nerd: { top: 32, left: 50, width: 40 },
      glasses_monocle: { top: 33, left: 50, width: 38 },
    },
  },
  zuckerberg: {
    hat: {
      hat_tophat: { top: -20, left: 50, width: 48 },
      hat_cap: { top: -12, left: 50, width: 54 },
      hat_cowboy: { top: -15, left: 50, width: 58 },
      hat_crown: { top: -18, left: 50, width: 44 },
    },
    glasses: {
      glasses_sun: { top: 33, left: 50, width: 44 },
      glasses_nerd: { top: 31, left: 50, width: 40 },
      glasses_monocle: { top: 32, left: 50, width: 38 },
    },
  },
  musk: {
    hat: {
      hat_tophat: { top: -20, left: 50, width: 50 },
      hat_cap: { top: -12, left: 50, width: 54 },
      hat_cowboy: { top: -15, left: 50, width: 58 },
      hat_crown: { top: -18, left: 50, width: 44 },
    },
    glasses: {
      glasses_sun: { top: 34, left: 50, width: 46 },
      glasses_nerd: { top: 32, left: 50, width: 42 },
      glasses_monocle: { top: 33, left: 50, width: 40 },
    },
  },
  dalio: {
    hat: {
      hat_tophat: { top: -20, left: 50, width: 48 },
      hat_cap: { top: -12, left: 50, width: 52 },
      hat_cowboy: { top: -14, left: 50, width: 56 },
      hat_crown: { top: -18, left: 50, width: 44 },
    },
    glasses: {
      glasses_sun: { top: 34, left: 50, width: 44 },
      glasses_nerd: { top: 32, left: 50, width: 40 },
      glasses_monocle: { top: 33, left: 50, width: 38 },
    },
  },
  bull: {
    hat: {
      hat_tophat: { top: -22, left: 50, width: 45 },
      hat_cap: { top: -14, left: 50, width: 50 },
      hat_cowboy: { top: -16, left: 50, width: 55 },
      hat_crown: { top: -20, left: 50, width: 42 },
    },
    glasses: {
      glasses_sun: { top: 38, left: 50, width: 42 },
      glasses_nerd: { top: 36, left: 50, width: 38 },
      glasses_monocle: { top: 37, left: 50, width: 36 },
    },
  },
  bear: {
    hat: {
      hat_tophat: { top: -18, left: 50, width: 48 },
      hat_cap: { top: -10, left: 50, width: 52 },
      hat_cowboy: { top: -14, left: 50, width: 56 },
      hat_crown: { top: -16, left: 50, width: 44 },
    },
    glasses: {
      glasses_sun: { top: 36, left: 50, width: 44 },
      glasses_nerd: { top: 34, left: 50, width: 40 },
      glasses_monocle: { top: 35, left: 50, width: 38 },
    },
  },
  unicorn: {
    hat: {
      hat_tophat: { top: -24, left: 50, width: 45 },
      hat_cap: { top: -16, left: 50, width: 50 },
      hat_cowboy: { top: -18, left: 50, width: 55 },
      hat_crown: { top: -22, left: 50, width: 42 },
    },
    glasses: {
      glasses_sun: { top: 36, left: 50, width: 42 },
      glasses_nerd: { top: 34, left: 50, width: 38 },
      glasses_monocle: { top: 35, left: 50, width: 36 },
    },
  },
  whale: {
    hat: {
      hat_tophat: { top: -20, left: 50, width: 46 },
      hat_cap: { top: -12, left: 50, width: 50 },
      hat_cowboy: { top: -14, left: 50, width: 54 },
      hat_crown: { top: -18, left: 50, width: 42 },
    },
    glasses: {
      glasses_sun: { top: 32, left: 50, width: 42 },
      glasses_nerd: { top: 30, left: 50, width: 38 },
      glasses_monocle: { top: 31, left: 50, width: 36 },
    },
  },
  diamond_hands: {
    hat: {
      hat_tophat: { top: -20, left: 50, width: 48 },
      hat_cap: { top: -12, left: 50, width: 52 },
      hat_cowboy: { top: -14, left: 50, width: 56 },
      hat_crown: { top: -18, left: 50, width: 44 },
    },
    glasses: {
      glasses_sun: { top: 34, left: 50, width: 44 },
      glasses_nerd: { top: 32, left: 50, width: 40 },
      glasses_monocle: { top: 33, left: 50, width: 38 },
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
