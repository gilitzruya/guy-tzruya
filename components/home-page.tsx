"use client";

import { useMemo } from "react";
import { HomeAboutSection } from "@/components/home/home-about-section";
import { HomeProjectsSection } from "@/components/home/home-projects-section";
import { HomeServicesSection } from "@/components/home/home-services-section";
import { useScene } from "@/components/scene-provider";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";

export function HomePage() {
  const { scene } = useScene();
  const headerBackgroundStyle = useMemo(
    () => ({
      ...interiorDesignPageBackgroundStyle(scene, "scroll"),
    }),
    [scene],
  );

  return (
    <div className="home-page relative overflow-x-clip bg-[var(--color-bg)] pb-8 sm:pb-10">
      <div
        className="home-page__header-backdrop"
        aria-hidden
        style={headerBackgroundStyle}
      />
      <div className="home-page__grain" aria-hidden />
      <div className="home-page__ambient" aria-hidden />
      <HomeServicesSection />
      <HomeAboutSection />
      <HomeProjectsSection />
    </div>
  );
}
