// Cosmetic image imports
import hatTophat from "@/assets/cosmetics/hat_tophat.png";
import hatCap from "@/assets/cosmetics/hat_cap.png";
import hatCowboy from "@/assets/cosmetics/hat_cowboy.png";
import hatCrown from "@/assets/cosmetics/hat_crown.png";
import hatBeanie from "@/assets/cosmetics/hat_beanie.png";
import hatWizard from "@/assets/cosmetics/hat_wizard.png";

// Effect image imports
import fireEffect from "@/assets/effects/fire_effect.png";
import iceEffect from "@/assets/effects/ice_effect.png";
import goldEffect from "@/assets/effects/gold_effect.png";
import rainbowEffect from "@/assets/effects/rainbow_effect.png";
import raysEffect from "@/assets/effects/rays_effect.png";
import auraEffect from "@/assets/effects/aura_effect.png";
import lightningEffect from "@/assets/effects/lightning_effect.png";
import sakuraEffect from "@/assets/effects/sakura_effect.png";

export const COSMETIC_IMAGES: Record<string, string> = {
  hat_tophat: hatTophat,
  hat_cap: hatCap,
  hat_cowboy: hatCowboy,
  hat_crown: hatCrown,
  hat_beanie: hatBeanie,
  hat_wizard: hatWizard,
};

export const EFFECT_SCALE_MULTIPLIERS: Record<string, number> = {
  color_fire: 1.0,
  color_ice: 1.13,
  color_gold: 2.2,
  color_rainbow: 1.13,
  color_rays: 2.2,
  color_aura: 2.2,
  color_lightning: 1.65,
  color_sakura: 1.1,
};

export const EFFECT_IMAGES: Record<string, string> = {
  color_fire: fireEffect,
  color_ice: iceEffect,
  color_gold: goldEffect,
  color_rainbow: rainbowEffect,
  color_rays: raysEffect,
  color_aura: auraEffect,
  color_lightning: lightningEffect,
  color_sakura: sakuraEffect,
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
export const CHARACTER_POSITIONS: Record<string, CharacterPositions> = {
  buffett: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 3, left: 12, width: 75 },
      glasses_nerd: { top: 3, left: 12, width: 75 },
      glasses_monocle: { top: 0, left: -3, width: 105 },
      glasses_aviator: { top: 3, left: 17, width: 75 },
      glasses_pixel: { top: -5, left: 6, width: 90 },
    },
  },
  satoshi: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 0, left: 12, width: 75 },
      glasses_nerd: { top: 0, left: 12, width: 75 },
      glasses_monocle: { top: -3, left: -3, width: 105 },
      glasses_aviator: { top: 0, left: 17, width: 75 },
      glasses_pixel: { top: -8, left: 6, width: 90 },
    },
  },
  trump: {
    hat: {
      hat_tophat: { top: -35, left: 16, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 13, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -40, left: 14, width: 75 },
      hat_wizard: { top: -40, left: 20, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 3, left: 12, width: 75 },
      glasses_nerd: { top: 3, left: 12, width: 75 },
      glasses_monocle: { top: 0, left: -3, width: 105 },
      glasses_aviator: { top: 3, left: 17, width: 75 },
      glasses_pixel: { top: -5, left: 6, width: 90 },
    },
  },
  bezos: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -45, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 10, left: 12, width: 75 },
      glasses_nerd: { top: 10, left: 12, width: 75 },
      glasses_monocle: { top: 7, left: -3, width: 105 },
      glasses_aviator: { top: 10, left: 17, width: 75 },
      glasses_pixel: { top: 2, left: 6, width: 90 },
    },
  },
  zuckerberg: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 7, left: 12, width: 75 },
      glasses_nerd: { top: 7, left: 12, width: 75 },
      glasses_monocle: { top: 4, left: -3, width: 105 },
      glasses_aviator: { top: 7, left: 17, width: 75 },
      glasses_pixel: { top: -1, left: 6, width: 90 },
    },
  },
  musk: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 7, left: 12, width: 75 },
      glasses_nerd: { top: 7, left: 12, width: 75 },
      glasses_monocle: { top: 4, left: -3, width: 105 },
      glasses_aviator: { top: 7, left: 17, width: 75 },
      glasses_pixel: { top: -1, left: 6, width: 90 },
    },
  },
  dalio: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 7, left: 12, width: 75 },
      glasses_nerd: { top: 7, left: 12, width: 75 },
      glasses_monocle: { top: 4, left: -3, width: 105 },
      glasses_aviator: { top: 7, left: 17, width: 75 },
      glasses_pixel: { top: -1, left: 6, width: 90 },
    },
  },
  bull: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -20, left: 14, width: 65 },
      hat_cowboy: { top: -22, left: 18, width: 65 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -35, left: 16, width: 70 },
      hat_wizard: { top: -32, left: 19, width: 70 },
    },
    glasses: {
      glasses_sun: { top: -2, left: 12, width: 75 },
      glasses_nerd: { top: -2, left: 12, width: 75 },
      glasses_monocle: { top: -5, left: -3, width: 105 },
      glasses_aviator: { top: -2, left: 17, width: 75 },
      glasses_pixel: { top: -10, left: 6, width: 90 },
    },
  },
  bear: {
    hat: {
      hat_tophat: { top: -43, left: 14, width: 75 },
      hat_cap: { top: -34, left: 12, width: 75 },
      hat_cowboy: { top: -43, left: 14, width: 75 },
      hat_crown: { top: -45, left: 14, width: 75 },
      hat_beanie: { top: -45, left: 15, width: 73 },
      hat_wizard: { top: -47, left: 17, width: 75 },
    },
    glasses: {
      glasses_sun: { top: -7, left: 12, width: 75 },
      glasses_nerd: { top: -7, left: 12, width: 75 },
      glasses_monocle: { top: -10, left: -3, width: 105 },
      glasses_aviator: { top: -7, left: 17, width: 75 },
      glasses_pixel: { top: -15, left: 6, width: 90 },
    },
  },
  unicorn: {
    hat: {
      hat_tophat: { top: -30, left: 7, width: 75 },
      hat_cap: { top: -25, left: 7, width: 75 },
      hat_cowboy: { top: -30, left: 7, width: 75 },
      hat_crown: { top: -37, left: 7, width: 75 },
      hat_beanie: { top: -27, left: 6, width: 70 },
      hat_wizard: { top: -35, left: 9, width: 75 },
    },
    glasses: {
      glasses_sun: { top: -3, left: 5, width: 75 },
      glasses_nerd: { top: -3, left: 5, width: 75 },
      glasses_monocle: { top: -6, left: -10, width: 105 },
      glasses_aviator: { top: -3, left: 10, width: 75 },
      glasses_pixel: { top: -11, left: -1, width: 90 },
    },
  },
  whale: {
    hat: {
      hat_tophat: { top: -26, left: 5, width: 75 },
      hat_cap: { top: -20, left: 1, width: 75 },
      hat_cowboy: { top: -26, left: 5, width: 75 },
      hat_crown: { top: -30, left: 5, width: 75 },
      hat_beanie: { top: -29, left: 6, width: 70 },
      hat_wizard: { top: -30, left: 6, width: 75 },
    },
    glasses: {
      glasses_sun: { top: -5, left: 3, width: 75 },
      glasses_nerd: { top: -5, left: 3, width: 75 },
      glasses_monocle: { top: -8, left: -12, width: 105 },
      glasses_aviator: { top: -5, left: 8, width: 75 },
      glasses_pixel: { top: -13, left: -3, width: 90 },
    },
  },
  diamond_hands: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: -5, left: 12, width: 75 },
      glasses_nerd: { top: -5, left: 12, width: 75 },
      glasses_monocle: { top: -8, left: -3, width: 105 },
      glasses_aviator: { top: -5, left: 17, width: 75 },
      glasses_pixel: { top: -13, left: 6, width: 90 },
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
