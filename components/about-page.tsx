"use client";

import { useMemo } from "react";
import { AboutHeroSection } from "@/components/about/about-hero-section";
import { AboutJourneySection } from "@/components/about/about-journey-section";
import { AboutStorySection } from "@/components/about/about-story-section";
import { AboutValuesSection } from "@/components/about/about-values-section";
import { useScene } from "@/components/scene-provider";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";

export function AboutPage() {
  const { scene } = useScene();
  const headerBackgroundStyle = useMemo(
    () => interiorDesignPageBackgroundStyle(scene, "scroll"),
    [scene],
  );

  return (
    <div className="about-page relative overflow-x-clip bg-[var(--color-bg)]">
      <div
        className="about-page__header-backdrop"
        aria-hidden
        style={headerBackgroundStyle}
      />
      <div className="about-page__grain" aria-hidden />
      <div className="about-page__ambient" aria-hidden />
      <AboutHeroSection />
      <AboutStorySection />
      <AboutJourneySection />
      <AboutValuesSection />
    </div>
  );
}
