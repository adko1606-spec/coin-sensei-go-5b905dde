// Cosmetic image imports
import hatTophat from "@/assets/cosmetics/hat_tophat.png";
import hatCap from "@/assets/cosmetics/hat_cap.png";
import hatCowboy from "@/assets/cosmetics/hat_cowboy.png";
import hatCrown from "@/assets/cosmetics/hat_crown.png";
import hatBeanie from "@/assets/cosmetics/hat_beanie.png";
import hatWizard from "@/assets/cosmetics/hat_wizard.png";
import glassesSun from "@/assets/cosmetics/glasses_sun.png";
import glassesNerd from "@/assets/cosmetics/glasses_nerd.png";
import glassesMonocle from "@/assets/cosmetics/glasses_monocle.png";
import glassesAviator from "@/assets/cosmetics/glasses_aviator.png";
import glassesPixel from "@/assets/cosmetics/glasses_pixel.png";

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
  glasses_sun: glassesSun,
  glasses_nerd: glassesNerd,
  glasses_monocle: glassesMonocle,
  glasses_aviator: glassesAviator,
  glasses_pixel: glassesPixel,
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
// Human portraits: eyes ~28-35%, head top ~-10 to -5%
// Animal full-body: eyes ~20-28%, head top ~-2 to 5%
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
      glasses_sun: { top: 30, left: 50, width: 55 },
      glasses_nerd: { top: 28, left: 50, width: 50 },
      glasses_monocle: { top: 30, left: 40, width: 30 },
      glasses_aviator: { top: 28, left: 50, width: 55 },
      glasses_pixel: { top: 28, left: 50, width: 50 },
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
      glasses_sun: { top: 28, left: 48, width: 48 },
      glasses_nerd: { top: 26, left: 48, width: 44 },
      glasses_monocle: { top: 28, left: 40, width: 28 },
      glasses_aviator: { top: 26, left: 48, width: 50 },
      glasses_pixel: { top: 26, left: 48, width: 44 },
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
      glasses_sun: { top: 28, left: 50, width: 52 },
      glasses_nerd: { top: 26, left: 50, width: 48 },
      glasses_monocle: { top: 28, left: 42, width: 30 },
      glasses_aviator: { top: 26, left: 50, width: 52 },
      glasses_pixel: { top: 26, left: 50, width: 48 },
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
      glasses_sun: { top: 26, left: 50, width: 50 },
      glasses_nerd: { top: 24, left: 50, width: 46 },
      glasses_monocle: { top: 26, left: 42, width: 28 },
      glasses_aviator: { top: 24, left: 50, width: 50 },
      glasses_pixel: { top: 24, left: 50, width: 46 },
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
      glasses_sun: { top: 28, left: 50, width: 50 },
      glasses_nerd: { top: 26, left: 50, width: 46 },
      glasses_monocle: { top: 28, left: 42, width: 28 },
      glasses_aviator: { top: 26, left: 50, width: 50 },
      glasses_pixel: { top: 26, left: 50, width: 46 },
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
      glasses_sun: { top: 30, left: 50, width: 50 },
      glasses_nerd: { top: 28, left: 50, width: 46 },
      glasses_monocle: { top: 30, left: 42, width: 28 },
      glasses_aviator: { top: 28, left: 50, width: 50 },
      glasses_pixel: { top: 28, left: 50, width: 46 },
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
      glasses_sun: { top: 28, left: 50, width: 50 },
      glasses_nerd: { top: 26, left: 50, width: 46 },
      glasses_monocle: { top: 28, left: 42, width: 28 },
      glasses_aviator: { top: 26, left: 50, width: 50 },
      glasses_pixel: { top: 26, left: 50, width: 46 },
    },
  },
  bull: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 22, left: 50, width: 38 },
      glasses_nerd: { top: 20, left: 50, width: 35 },
      glasses_monocle: { top: 22, left: 44, width: 22 },
      glasses_aviator: { top: 20, left: 50, width: 38 },
      glasses_pixel: { top: 20, left: 50, width: 35 },
    },
  },
  bear: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 20, left: 50, width: 36 },
      glasses_nerd: { top: 18, left: 50, width: 32 },
      glasses_monocle: { top: 20, left: 44, width: 22 },
      glasses_aviator: { top: 18, left: 50, width: 36 },
      glasses_pixel: { top: 18, left: 50, width: 32 },
    },
  },
  unicorn: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 24, left: 40, width: 32 },
      glasses_nerd: { top: 22, left: 40, width: 28 },
      glasses_monocle: { top: 24, left: 35, width: 20 },
      glasses_aviator: { top: 22, left: 40, width: 32 },
      glasses_pixel: { top: 22, left: 40, width: 28 },
    },
  },
  whale: {
    hat: {
      hat_tophat: { top: -35, left: 12, width: 75 },
      hat_cap: { top: -30, left: 12, width: 75 },
      hat_cowboy: { top: -35, left: 12, width: 75 },
      hat_crown: { top: -42, left: 12, width: 75 },
      hat_beanie: { top: -48, left: 8, width: 85 },
      hat_wizard: { top: -40, left: 15, width: 75 },
    },
    glasses: {
      glasses_sun: { top: 24, left: 38, width: 30 },
      glasses_nerd: { top: 22, left: 38, width: 26 },
      glasses_monocle: { top: 24, left: 32, width: 18 },
      glasses_aviator: { top: 22, left: 38, width: 30 },
      glasses_pixel: { top: 22, left: 38, width: 26 },
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
      glasses_sun: { top: 18, left: 50, width: 40 },
      glasses_nerd: { top: 16, left: 50, width: 36 },
      glasses_monocle: { top: 18, left: 44, width: 24 },
      glasses_aviator: { top: 16, left: 50, width: 40 },
      glasses_pixel: { top: 16, left: 50, width: 36 },
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
