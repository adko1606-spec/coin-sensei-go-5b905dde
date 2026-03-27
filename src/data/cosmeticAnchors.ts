interface VisualCenter {
  x: number;
  y: number;
}

const DEFAULT_CENTER: VisualCenter = { x: 0.5, y: 0.5 };

// Zistené z reálnej nepriehľadnej oblasti (alpha bbox) v PNG assetoch
export const CHARACTER_VISUAL_CENTERS: Record<string, VisualCenter> = {
  bear: { x: 0.5723, y: 0.5059 },
  bezos: { x: 0.5645, y: 0.5312 },
  buffett: { x: 0.5322, y: 0.5146 },
  bull: { x: 0.5215, y: 0.4873 },
  dalio: { x: 0.4805, y: 0.5195 },
  diamond_hands: { x: 0.502, y: 0.46 },
  musk: { x: 0.498, y: 0.5234 },
  satoshi: { x: 0.4863, y: 0.5234 },
  trump: { x: 0.5791, y: 0.541 },
  unicorn: { x: 0.5273, y: 0.5205 },
  whale: { x: 0.541, y: 0.5215 },
  zuckerberg: { x: 0.4834, y: 0.5264 },
};

export const COSMETIC_VISUAL_CENTERS: Record<string, VisualCenter> = {
  glasses_monocle: { x: 0.4941, y: 0.5664 },
  glasses_nerd: { x: 0.502, y: 0.5459 },
  glasses_sun: { x: 0.5049, y: 0.3564 },
  hat_cap: { x: 0.499, y: 0.5586 },
  hat_cowboy: { x: 0.502, y: 0.5693 },
  hat_crown: { x: 0.5, y: 0.4883 },
  hat_tophat: { x: 0.5068, y: 0.5693 },
};

export const EFFECT_VISUAL_CENTERS: Record<string, VisualCenter> = {
  color_aura: { x: 0.5124, y: 0.4564 },
  color_fire: { x: 0.485, y: 0.4798 },
  color_gold: { x: 0.526, y: 0.4993 },
  color_ice: { x: 0.4896, y: 0.4766 },
  color_rainbow: { x: 0.5215, y: 0.4824 },
  color_rays: { x: 0.5, y: 0.5 },
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

export function getCenterCorrection(
  center: VisualCenter,
  widthPercent: number,
): { x: number; y: number } {
  return {
    x: -widthPercent * (center.x - 0.5),
    y: -widthPercent * (center.y - 0.5),
  };
}
