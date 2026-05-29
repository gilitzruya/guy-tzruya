export const HOME_SERVICE_KEYS = [
  "interiorDesign",
  "buildingLicensing",
  "businessLicensing",
] as const;

export type HomeServiceKey = (typeof HOME_SERVICE_KEYS)[number];

/** Homepage showcase order: 01 shaki, 02 maklaf (matches editorial layout). */
export const HOME_PROJECT_KEYS = ["shaki", "maklaf"] as const;

export type HomeProjectKey = (typeof HOME_PROJECT_KEYS)[number];

/** Homepage “קצת עלי” section only — separate from /about hero portraits. */
export function homeAboutPortraitSrc(scene: "day" | "night"): string {
  return `/home/about/portrait-${scene}.webp`;
}

export const HOME_ABOUT_FEATURE_KEYS = ["0", "1", "2", "3"] as const;
export type HomeAboutFeatureKey = (typeof HOME_ABOUT_FEATURE_KEYS)[number];
