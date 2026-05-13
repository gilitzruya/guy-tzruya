import type { CSSProperties } from "react";
import type { Scene } from "@/lib/scene-storage";

/** Tiled page backdrop used on interior-design and projects listings (day/night). */
export function interiorDesignPageBackgroundUrl(scene: Scene): string {
  return `/backgrounds/pages/interior-design-${scene}.webp`;
}

export function interiorDesignPageBackgroundStyle(scene: Scene): CSSProperties {
  return {
    backgroundImage: `url(${interiorDesignPageBackgroundUrl(scene)})`,
    backgroundRepeat: "repeat",
    backgroundSize: "auto",
    backgroundPosition: "top left",
  };
}
