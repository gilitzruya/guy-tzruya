export const ABOUT_HERO_FEATURE_KEYS = ["0", "1", "2", "3"] as const;

export type AboutHeroFeatureIcon = "planning" | "design" | "materials" | "guidance";

export const ABOUT_HERO_FEATURE_ICONS: AboutHeroFeatureIcon[] = [
  "planning",
  "design",
  "materials",
  "guidance",
];

export const ABOUT_STAT_KEYS = ["0", "1", "2", "3"] as const;
export const ABOUT_JOURNEY_STEP_KEYS = ["0", "1", "2", "3", "4"] as const;
export const ABOUT_VALUE_KEYS = ["0", "1", "2"] as const;

export type AboutValueIcon = "craft" | "listen" | "wholeness";

export const ABOUT_VALUE_ICONS: AboutValueIcon[] = [
  "craft",
  "listen",
  "wholeness",
];

export function aboutPortraitSrc(scene: "day" | "night"): string {
  return `/about/hero/portrait-${scene}.webp`;
}
