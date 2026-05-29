import type { Scene } from "@/lib/scene-storage";

/** Full-bleed hero background on the contact page (day/night). */
export function contactPageHeroImageUrl(scene: Scene): string {
  return `/interior-design/hero/hero-${scene}.webp`;
}
