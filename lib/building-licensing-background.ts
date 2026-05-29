import type { CSSProperties } from "react";
import type { Scene } from "@/lib/scene-storage";

/** Full-bleed hero image on the building-licensing page (day/night). */
export function buildingLicensingHeroImageUrl(scene: Scene): string {
  return `/building-licensing/hero/hero-${scene}.png`;
}

/** Tiled page backdrop (reuses interior-design tiles until dedicated art exists). */
export function buildingLicensingPageBackgroundUrl(scene: Scene): string {
  return `/backgrounds/pages/interior-design-${scene}.webp`;
}

export function buildingLicensingPageBackgroundStyle(scene: Scene): CSSProperties {
  return {
    backgroundImage: `url(${buildingLicensingPageBackgroundUrl(scene)})`,
    backgroundRepeat: "repeat",
    backgroundSize: "auto",
    backgroundPosition: "top left",
    backgroundAttachment: "fixed",
  };
}
