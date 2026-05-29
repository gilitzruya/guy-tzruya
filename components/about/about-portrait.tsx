"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { aboutPortraitSrc } from "@/components/about-content";

type AboutPortraitProps = {
  scene: "day" | "night";
  priority?: boolean;
  variant?: "contain" | "cover";
};

export function AboutPortrait({
  scene,
  priority = false,
  variant = "contain",
}: AboutPortraitProps) {
  const t = useTranslations("About");
  const [failed, setFailed] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const src = aboutPortraitSrc(scene);
  const isCover = variant === "cover";

  if (failed) {
    return (
      <div
        className={
          isCover
            ? "about-hero__portrait-fallback about-hero__portrait-fallback--cover"
            : "about-hero__portrait-fallback"
        }
        role="img"
        aria-label={t("portraitAlt")}
      >
        GT
      </div>
    );
  }

  if (isCover) {
    return (
      <Image
        src={src}
        alt={t("portraitAlt")}
        fill
        priority={priority}
        unoptimized
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="about-hero__portrait-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  const width = naturalSize?.width ?? 800;
  const height = naturalSize?.height ?? 1000;

  return (
    <Image
      src={src}
      alt={t("portraitAlt")}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      sizes="(max-width: 1024px) 100vw, min(42vw, 560px)"
      className="about-hero__portrait-image"
      onLoad={(e) => {
        const img = e.currentTarget;
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          setNaturalSize({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }
      }}
      onError={() => setFailed(true)}
    />
  );
}
