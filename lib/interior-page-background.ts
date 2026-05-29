import type { CSSProperties } from "react";
import type { Scene } from "@/lib/scene-storage";

/** Full-bleed hero image on the interior-design page (day/night). */
export function interiorDesignHeroImageUrl(scene: Scene): string {
  return `/interior-design/hero/hero-${scene}.webp`;
}

/** Tiled page backdrop used on interior-design and projects listings (day/night). */
export function interiorDesignPageBackgroundUrl(scene: Scene): string {
  return `/backgrounds/pages/interior-design-${scene}.webp`;
}

export function interiorDesignPageBackgroundStyle(
  scene: Scene,
  attachment: "fixed" | "scroll" = "fixed",
): CSSProperties {
  return {
    backgroundImage: `url(${interiorDesignPageBackgroundUrl(scene)})`,
    backgroundRepeat: "repeat",
    backgroundSize: "auto",
    backgroundPosition: "top left",
    backgroundAttachment: attachment,
  };
}
