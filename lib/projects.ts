export const PROJECT_SLUGS = [
  "maklaf",
  "maklaf-2",
  "shaki",
  "hulda-hanavia-4",
  "atliz-bereshit",
  "tzidkiyahu",
  "motza",
  "ein-gedi-tama-38-1",
  "haran-18-tama-38-1",
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export type ProjectViewport = "desktop" | "mobile";

/** Optional client portrait for project cards (`/projects/<slug>/client.webp`). */
export const PROJECT_CLIENT_IMAGE: Partial<Record<ProjectSlug, string>> = {
  shaki: "/projects/shaki/client.webp",
};

export function projectClientImageSrc(slug: ProjectSlug): string | undefined {
  return PROJECT_CLIENT_IMAGE[slug];
}

/** Legacy single file per phase (`before.webp` / `after.webp`). */
export function projectLegacyImageSrc(slug: ProjectSlug, kind: "before" | "after"): string {
  return `/projects/${slug}/${kind}.webp`;
}

/**
 * Before/after paths per viewport (`before-desktop.webp`, `before-mobile.webp`, …).
 * Prefer exporting these; use {@link projectLegacyImageSrc} only as fallback when missing.
 */
export function projectBeforeAfterSrc(
  slug: ProjectSlug,
  phase: "before" | "after",
  viewport: ProjectViewport,
): string {
  const v = viewport === "desktop" ? "desktop" : "mobile";
  return `/projects/${slug}/${phase}-${v}.webp`;
}

/** How many `gallery-NN-*` pairs exist per project (see `public/projects/README.md`). */
export const PROJECT_GALLERY_COUNT: Record<ProjectSlug, number> = {
  maklaf: 25,
  "maklaf-2": 6,
  shaki: 5,
  "hulda-hanavia-4": 7,
  "atliz-bereshit": 2,
  "ein-gedi-tama-38-1": 4,
  tzidkiyahu: 8,
  motza: 2,
  "haran-18-tama-38-1": 4,
};

/** 1-based index */
export function projectGalleryImageSrc(
  slug: ProjectSlug,
  index: number,
  viewport: ProjectViewport,
): string {
  const n = String(index).padStart(2, "0");
  const v = viewport === "desktop" ? "desktop" : "mobile";
  return `/projects/${slug}/gallery-${n}-${v}.webp`;
}

export function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(value);
}
