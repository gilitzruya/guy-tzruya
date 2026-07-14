export const HOME_SERVICE_KEYS = [
  "interiorDesign",
  "buildingLicensing",
  "businessLicensing",
] as const;

export type HomeServiceKey = (typeof HOME_SERVICE_KEYS)[number];

/** Content keys under Home.projects.items (translations). */
export type HomeProjectKey = "shaki" | "maklaf";

export type HomeProjectSlide = {
  id: string;
  project: HomeProjectKey;
  /** When set, use gallery-NN assets; otherwise project after image. */
  galleryIndex?: number;
};

/** Homepage showcase: featured projects + selected Maklaf gallery images. */
export const HOME_PROJECT_SLIDES: readonly HomeProjectSlide[] = [
  { id: "shaki", project: "shaki" },
  { id: "maklaf-g02", project: "maklaf", galleryIndex: 2 },
  { id: "maklaf-g04", project: "maklaf", galleryIndex: 4 },
  { id: "maklaf-g06", project: "maklaf", galleryIndex: 6 },
];

/** Homepage “קצת עלי” section only — separate from /about hero portraits. */
export function homeAboutPortraitSrc(scene: "day" | "night"): string {
  return `/home/about/portrait-${scene}.webp`;
}

export const HOME_ABOUT_FEATURE_KEYS = ["0", "1", "2", "3"] as const;
export type HomeAboutFeatureKey = (typeof HOME_ABOUT_FEATURE_KEYS)[number];
