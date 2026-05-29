import type { Scene } from "@/lib/scene-storage";

const GHOST_ON_DARK =
  "inline-flex min-h-[3rem] min-w-[10.5rem] items-center justify-center border border-white/55 bg-black/15 px-6 text-center text-xs font-medium uppercase tracking-[0.22em] text-white backdrop-blur-[3px] transition-[background-color,border-color] hover:border-white/80 hover:bg-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:min-h-[3.25rem] sm:px-8 sm:text-[0.8125rem]";

const GHOST_ON_LIGHT =
  "inline-flex min-h-[3rem] min-w-[10.5rem] items-center justify-center border border-[color-mix(in_oklab,var(--color-text)_50%,transparent)] bg-transparent px-6 text-center text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-text)] backdrop-blur-[2px] transition-[background-color,border-color] hover:border-[color-mix(in_oklab,var(--color-text)_75%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-text)_6%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:min-h-[3.25rem] sm:px-8 sm:text-[0.8125rem]";

/** Ghost CTA — shared by building-licensing hero and process footer. */
export function buildingLicensingHeroButtonClass(
  scene: Scene,
  options?: { onLightSurface?: boolean },
): string {
  const onLightSurface = options?.onLightSurface ?? false;
  if (onLightSurface) {
    return scene === "day" ? GHOST_ON_LIGHT : GHOST_ON_DARK;
  }
  return scene === "day" ? GHOST_ON_DARK : GHOST_ON_LIGHT;
}
