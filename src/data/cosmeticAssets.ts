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
export const CHARACTER_POSITIONS: Record<string, CharacterPositions> = {
  buffett: {
    // Big head portrait, already wears glasses, eyes at ~35%
    hat: {
      hat_tophat: { top: -35, left: 15, width: 75 },
      hat_cap: { top: -6, left: 52, width: 65 },
      hat_cowboy: { top: -10, left: 50, width: 70 },
      hat_crown: { top: -8, left: 50, width: 50 },
    },
    glasses: {
      glasses_sun: { top: 30, left: 50, width: 55 },
      glasses_nerd: { top: 28, left: 50, width: 50 },
      glasses_monocle: { top: 30, left: 40, width: 30 },
    },
  },
  satoshi: {
    // Hooded character with mask, eyes at ~32%
    hat: {
      hat_tophat: { top: -12, left: 48, width: 55 },
      hat_cap: { top: -4, left: 50, width: 58 },
      hat_cowboy: { top: -8, left: 48, width: 62 },
      hat_crown: { top: -6, left: 48, width: 45 },
    },
    glasses: {
      glasses_sun: { top: 28, left: 48, width: 48 },
      glasses_nerd: { top: 26, left: 48, width: 44 },
      glasses_monocle: { top: 28, left: 40, width: 28 },
    },
  },
  trump: {
    // Big hair, eyes at ~30%
    hat: {
      hat_tophat: { top: -10, left: 50, width: 62 },
      hat_cap: { top: -2, left: 52, width: 65 },
      hat_cowboy: { top: -6, left: 50, width: 68 },
      hat_crown: { top: -4, left: 50, width: 50 },
    },
    glasses: {
      glasses_sun: { top: 28, left: 50, width: 52 },
      glasses_nerd: { top: 26, left: 50, width: 48 },
      glasses_monocle: { top: 28, left: 42, width: 30 },
    },
  },
  bezos: {
    // Bald, laughing, eyes at ~30%
    hat: {
      hat_tophat: { top: -15, left: 50, width: 58 },
      hat_cap: { top: -6, left: 52, width: 62 },
      hat_cowboy: { top: -10, left: 50, width: 66 },
      hat_crown: { top: -8, left: 50, width: 48 },
    },
    glasses: {
      glasses_sun: { top: 26, left: 50, width: 50 },
      glasses_nerd: { top: 24, left: 50, width: 46 },
      glasses_monocle: { top: 26, left: 42, width: 28 },
    },
  },
  zuckerberg: {
    // Young face, eyes at ~30%
    hat: {
      hat_tophat: { top: -12, left: 50, width: 58 },
      hat_cap: { top: -4, left: 52, width: 62 },
      hat_cowboy: { top: -8, left: 50, width: 66 },
      hat_crown: { top: -6, left: 50, width: 48 },
    },
    glasses: {
      glasses_sun: { top: 28, left: 50, width: 50 },
      glasses_nerd: { top: 26, left: 50, width: 46 },
      glasses_monocle: { top: 28, left: 42, width: 28 },
    },
  },
  musk: {
    // Similar portrait, eyes at ~33%
    hat: {
      hat_tophat: { top: -12, left: 50, width: 58 },
      hat_cap: { top: -4, left: 52, width: 62 },
      hat_cowboy: { top: -8, left: 50, width: 66 },
      hat_crown: { top: -6, left: 50, width: 48 },
    },
    glasses: {
      glasses_sun: { top: 30, left: 50, width: 50 },
      glasses_nerd: { top: 28, left: 50, width: 46 },
      glasses_monocle: { top: 30, left: 42, width: 28 },
    },
  },
  dalio: {
    // Similar to buffett, eyes at ~30%
    hat: {
      hat_tophat: { top: -14, left: 50, width: 58 },
      hat_cap: { top: -5, left: 52, width: 62 },
      hat_cowboy: { top: -9, left: 50, width: 66 },
      hat_crown: { top: -7, left: 50, width: 48 },
    },
    glasses: {
      glasses_sun: { top: 28, left: 50, width: 50 },
      glasses_nerd: { top: 26, left: 50, width: 46 },
      glasses_monocle: { top: 28, left: 42, width: 28 },
    },
  },
  bull: {
    // Full body, eyes at ~25%, horns on top
    hat: {
      hat_tophat: { top: -4, left: 50, width: 42 },
      hat_cap: { top: 2, left: 52, width: 45 },
      hat_cowboy: { top: -2, left: 50, width: 48 },
      hat_crown: { top: 0, left: 50, width: 38 },
    },
    glasses: {
      glasses_sun: { top: 22, left: 50, width: 38 },
      glasses_nerd: { top: 20, left: 50, width: 35 },
      glasses_monocle: { top: 22, left: 44, width: 22 },
    },
  },
  bear: {
    // Full body, eyes at ~22%
    hat: {
      hat_tophat: { top: -2, left: 50, width: 40 },
      hat_cap: { top: 4, left: 52, width: 44 },
      hat_cowboy: { top: 0, left: 50, width: 46 },
      hat_crown: { top: 2, left: 50, width: 36 },
    },
    glasses: {
      glasses_sun: { top: 20, left: 50, width: 36 },
      glasses_nerd: { top: 18, left: 50, width: 32 },
      glasses_monocle: { top: 20, left: 44, width: 22 },
    },
  },
  unicorn: {
    // Side view full body, eye at ~28%, horn on top-left
    hat: {
      hat_tophat: { top: -2, left: 45, width: 38 },
      hat_cap: { top: 4, left: 47, width: 42 },
      hat_cowboy: { top: 0, left: 45, width: 44 },
      hat_crown: { top: 2, left: 45, width: 35 },
    },
    glasses: {
      glasses_sun: { top: 24, left: 40, width: 32 },
      glasses_nerd: { top: 22, left: 40, width: 28 },
      glasses_monocle: { top: 24, left: 35, width: 20 },
    },
  },
  whale: {
    // Sideways body, small eye at ~28%
    hat: {
      hat_tophat: { top: 0, left: 42, width: 35 },
      hat_cap: { top: 6, left: 44, width: 38 },
      hat_cowboy: { top: 2, left: 42, width: 40 },
      hat_crown: { top: 4, left: 42, width: 32 },
    },
    glasses: {
      glasses_sun: { top: 24, left: 38, width: 30 },
      glasses_nerd: { top: 22, left: 38, width: 26 },
      glasses_monocle: { top: 24, left: 32, width: 18 },
    },
  },
  diamond_hands: {
    // Hands with diamonds, top ~10%
    hat: {
      hat_tophat: { top: -8, left: 50, width: 45 },
      hat_cap: { top: 0, left: 52, width: 48 },
      hat_cowboy: { top: -4, left: 50, width: 50 },
      hat_crown: { top: -2, left: 50, width: 40 },
    },
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
