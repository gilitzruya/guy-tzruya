"use client";

import Image from "next/image";
import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  HOME_ABOUT_FEATURE_KEYS,
  homeAboutPortraitSrc,
} from "@/components/home/home-content";
import { useScene } from "@/components/scene-provider";

function AboutFeatureIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.6 6.8 19.3l1-5.9L3.5 9.2l5.9-.9L12 3Z" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3 4 7v5c0 5 3.3 8.6 8 9 4.7-.4 8-4 8-9V7l-8-4Z" />
        <path d="m9.5 12 1.8 1.8L15 10" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 19c3-4 13-4 16 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </svg>
  );
}

export function HomeAboutSection() {
  const t = useTranslations("Home.about");
  const locale = useLocale();
  const { scene } = useScene();
  const titleId = useId();
  const isRtl = locale === "he";

  return (
    <section
      id="home-about"
      aria-labelledby={titleId}
      dir={isRtl ? "rtl" : "ltr"}
      className="home-about-premium-section relative scroll-mt-24 py-16 sm:scroll-mt-28 sm:py-20 lg:py-24"
    >
      <div className="home-about-premium-section__veil" aria-hidden />
      <div className="home-about-premium-section__inner">
        <div className="home-about-premium">
        <div className="home-about-premium__hero">
          <div className="home-about-premium__copy">
            <p className="home-about-premium__eyebrow">
              <span className="home-about-premium__eyebrow-line" aria-hidden />
              {t("eyebrow")}
            </p>
            <h2 id={titleId} className="home-about-premium__name">
              {t("name")}
            </h2>
            <p className="home-about-premium__subtitle">{t("subtitle")}</p>
            <div className="home-about-premium__rule" aria-hidden />
            <p className="home-about-premium__body">{t("body1")}</p>
            <p className="home-about-premium__body">{t("body2")}</p>
            <Link className="home-about-premium__cta" href="/about">
              <span>{t("learnMore")}</span>
              <span className="home-about-premium__cta-arrow" aria-hidden>
                ›
              </span>
            </Link>
          </div>

          <div className="home-about-premium__divider" aria-hidden />

          <div className="home-about-premium__visual">
            <div className="home-about-premium__arch-bg" aria-hidden />
            <div className="home-about-premium__portrait-wrap">
              <Image
                src={homeAboutPortraitSrc(scene)}
                alt={t("portraitAlt")}
                width={420}
                height={520}
                unoptimized
                className="home-about-premium__portrait"
              />
            </div>
            <p className="home-about-premium__signature">{t("signature")}</p>
            <p className="home-about-premium__role">{t("role")}</p>
          </div>
        </div>

        <div className="home-about-premium__features">
          {HOME_ABOUT_FEATURE_KEYS.map((key, index) => (
            <div key={key} className="home-about-premium-feature">
              <span className="home-about-premium-feature__icon">
                <AboutFeatureIcon index={index} />
              </span>
              <h3 className="home-about-premium-feature__title">
                {t(`features.${key}.title`)}
              </h3>
              <p className="home-about-premium-feature__desc">
                {t(`features.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
