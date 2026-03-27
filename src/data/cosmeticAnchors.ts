interface VisualCenter {
  x: number;
  y: number;
}

const DEFAULT_CENTER: VisualCenter = { x: 0.5, y: 0.5 };

// Zistené z reálnej nepriehľadnej oblasti (alpha bbox) v PNG assetoch
export const CHARACTER_VISUAL_CENTERS: Record<string, VisualCenter> = {
  bear: { x: -0.327, y: -0.5 },
  bezos: { x: -0.327, y: -0.5 },
  buffett: { x: -0.327, y: -0.5 },
  bull: { x: -0.327, y: -0.5 },
  dalio: { x: -0.327, y: -0.5 },
  diamond_hands: { x: -0.327, y: -0.5 },
  musk: { x: -0.327, y: -0.5 },
  satoshi: { x: -0.327, y: -0.5 },
  trump: { x: -0.327, y: -0.5 },
  unicorn: { x: -0.327, y: -0.5 },
  whale: { x: -0.327, y: -0.5 },
  zuckerberg: { x: -0.327, y: -0.5 },
};

export const COSMETIC_VISUAL_CENTERS: Record<string, VisualCenter> = {
  glasses_monocle: { x: 0.4941, y: 0.5664 },
  glasses_nerd: { x: 0.502, y: 0.5459 },
  glasses_sun: { x: 0.5049, y: 0.3564 },
  glasses_aviator: { x: 0.4922, y: 0.4561 },
  glasses_pixel: { x: 0.5039, y: 0.4121 },
  hat_cap: { x: 0.4834, y: 0.4785 },
  hat_cowboy: { x: 0.502, y: 0.5693 },
  hat_crown: { x: 0.5, y: 0.4883 },
  hat_tophat: { x: 0.5068, y: 0.5693 },
  hat_beanie: { x: 0.498, y: 0.4814 },
  hat_wizard: { x: 0.5469, y: 0.5059 },
};

export const EFFECT_VISUAL_CENTERS: Record<string, VisualCenter> = {
  color_aura: { x: 0.78, y: 0.7 },
  color_fire: { x: 0.49, y: 0.5 },
  color_gold: { x: 0.9, y: 0.9 },
  color_ice: { x: 0.7, y: 0.5 },
  color_rainbow: { x: 0.55, y: 0.5 },
  color_rays: { x: 0.76, y: 0.7 },
  color_lightning: { x: 0.68, y: 0.67 },
  color_sakura: { x: 0.48, y: 0.4 },
};

export function getCharacterCenterOffset(characterId?: string): { x: number; y: number } {
  const center = (characterId && CHARACTER_VISUAL_CENTERS[characterId]) || DEFAULT_CENTER;
  return {
    x: (center.x - 0.5) * 100,
    y: (center.y - 0.5) * 100,
  };
}

export function getCosmeticVisualCenter(itemId?: string): VisualCenter {
  return (itemId && COSMETIC_VISUAL_CENTERS[itemId]) || DEFAULT_CENTER;
}

export function getEffectVisualCenter(itemId?: string): VisualCenter {
  return (itemId && EFFECT_VISUAL_CENTERS[itemId]) || DEFAULT_CENTER;
}

export function getCenterCorrection(center: VisualCenter, widthPercent: number): { x: number; y: number } {
  return {
    x: -widthPercent * (center.x - 0.5),
    y: -widthPercent * (center.y - 0.5),
  };
}
