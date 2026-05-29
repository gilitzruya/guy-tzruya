"use client";

import { useTranslations } from "next-intl";
import { useLayoutEffect, useState } from "react";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import type { ProjectSlug } from "@/lib/projects";
import {
  projectBeforeAfterSrc,
  projectLegacyImageSrc,
} from "@/lib/projects";

const DESKTOP_MIN_WIDTH = 1024;

export function ProjectBeforeAfterSlider({
  slug,
  title,
  priority = false,
  imageObjectFit = "cover",
  fillHeight = false,
  compactMobileHeight = false,
  className = "",
  sizes = "100vw",
}: {
  slug: ProjectSlug;
  title: string;
  priority?: boolean;
  imageObjectFit?: "cover" | "contain";
  fillHeight?: boolean;
  compactMobileHeight?: boolean;
  className?: string;
  sizes?: string;
}) {
  const t = useTranslations("Projects");
  const [isDesktop, setIsDesktop] = useState(true);

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const viewport = isDesktop ? "desktop" : "mobile";
  const beforeSrc = projectBeforeAfterSrc(slug, "before", viewport);
  const afterSrc = projectBeforeAfterSrc(slug, "after", viewport);
  const beforeFallback = projectLegacyImageSrc(slug, "before");
  const afterFallback = projectLegacyImageSrc(slug, "after");

  return (
    <BeforeAfterSlider
      beforeSrc={beforeSrc}
      afterSrc={afterSrc}
      beforeFallback={beforeFallback}
      afterFallback={afterFallback}
      title={title}
      beforeLabel={t("beforeLabel")}
      afterLabel={t("afterLabel")}
      sliderAriaLabel={t("sliderAriaLabel", { title })}
      priority={priority}
      imageObjectFit={imageObjectFit}
      fillHeight={fillHeight}
      compactMobileHeight={compactMobileHeight}
      className={className}
      sizes={sizes}
    />
  );
}
