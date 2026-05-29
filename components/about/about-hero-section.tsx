"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import { useScene } from "@/components/scene-provider";
import {
  ABOUT_HERO_FEATURE_ICONS,
  ABOUT_HERO_FEATURE_KEYS,
} from "@/components/about-content";
import { AboutHeroFeatureIcon } from "@/components/about/about-hero-icons";
import { AboutPortrait } from "@/components/about/about-portrait";

export function AboutHeroSection() {
  const t = useTranslations("About");
  const locale = useLocale();
  const { scene } = useScene();
  const headingId = useId();
  const isRtl = locale === "he";

  return (
    <section
      aria-labelledby={headingId}
      className="about-hero about-hero--split relative left-1/2 z-[1] w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
      data-scene={scene}
    >
      <div className="about-hero__grid" dir="ltr">
        <div
          className="about-hero__content"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <span className="about-hero__watermark" aria-hidden>
            GT
          </span>

          <p className="about-hero__welcome">
            <span className="about-hero__welcome-line" aria-hidden />
            <span>{t("heroEyebrow")}</span>
            <span className="about-hero__welcome-line" aria-hidden />
          </p>

          <h1 id={headingId} className="about-hero__title">
            {t("heroTitle")}
          </h1>

          <p className="about-hero__subtitle">{t("heroSubtitle")}</p>

          <span className="about-hero__divider" aria-hidden />

          <p className="about-hero__lead">{t("heroLead")}</p>

          <ul className="about-hero__features">
            {ABOUT_HERO_FEATURE_KEYS.map((key, index) => (
              <li key={key} className="about-hero__feature">
                <span className="about-hero__feature-icon">
                  <AboutHeroFeatureIcon
                    icon={ABOUT_HERO_FEATURE_ICONS[index] ?? "guidance"}
                  />
                </span>
                <span className="about-hero__feature-label">
                  {t(`heroFeatures.${key}.label`)}
                </span>
              </li>
            ))}
          </ul>

          <a href="#about-story" className="about-hero__scroll-cta">
            <span>{t("heroScrollCta")}</span>
            <svg
              className="about-hero__scroll-cta-arrow scroll-arrow-hint"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path
                d="M12 5v14M6 13l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="about-hero__visual" aria-hidden={false}>
          <AboutPortrait scene={scene} priority variant="cover" />
        </div>
      </div>
    </section>
  );
}
