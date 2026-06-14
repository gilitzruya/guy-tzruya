"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import {
  IconFacebook,
  IconInstagram,
} from "@/components/building-licensing-social-icons";
import { SITE_SOCIAL, type SiteSocialPlatform } from "@/lib/site-social";

const MAILTO =
  "mailto:studio@guytzruya.com?subject=Architecture%20and%20design%20inquiry";

const SOCIAL_LINKS: {
  platform: Extract<SiteSocialPlatform, "instagram" | "facebook">;
  Icon: typeof IconInstagram;
  labelKey: "ctaSocialInstagram" | "ctaSocialFacebook";
}[] = [
  { platform: "instagram", Icon: IconInstagram, labelKey: "ctaSocialInstagram" },
  { platform: "facebook", Icon: IconFacebook, labelKey: "ctaSocialFacebook" },
];

function CtaArrow({ rtl }: { rtl: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={rtl ? "rtl:-scale-x-100" : undefined}
    >
      <path
        d="M3.5 9h11M10 5.5L13.5 9 10 12.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AboutCtaSection() {
  const t = useTranslations("About");
  const locale = useLocale();
  const isRtl = locale === "he";
  const titleId = useId();

  return (
    <section
      id="contact"
      aria-labelledby={titleId}
      className="about-cta relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 scroll-mt-24 pb-20 sm:scroll-mt-28 sm:pb-24"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="about-cta__ambient" aria-hidden>
        <div className="about-cta__ambient-glow" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="about-cta__frame">
          <span className="about-cta__corner about-cta__corner--tl" aria-hidden />
          <span className="about-cta__corner about-cta__corner--tr" aria-hidden />
          <span className="about-cta__corner about-cta__corner--bl" aria-hidden />
          <span className="about-cta__corner about-cta__corner--br" aria-hidden />

          <article className="about-cta__card">
            <header>
              <p className="about-cta__eyebrow">
                <span className="about-cta__eyebrow-line" aria-hidden />
                <span>{t("ctaEyebrow")}</span>
                <span className="about-cta__eyebrow-line" aria-hidden />
              </p>
              <h2 id={titleId} className="about-cta__title">
                {t("ctaTitle")}
              </h2>
              <p className="about-cta__lead">{t("ctaLead")}</p>
            </header>

            <a href={MAILTO} className="about-cta__button">
              <span>{t("ctaButton")}</span>
              <CtaArrow rtl={isRtl} />
            </a>

            <div className="about-cta__social-block">
              <p className="about-cta__social-label">{t("ctaSocialLabel")}</p>
              <ul
                className="about-cta__social-list"
                aria-label={t("ctaSocialLabel")}
              >
                {SOCIAL_LINKS.map(({ platform, Icon, labelKey }) => (
                  <li key={platform}>
                    <a
                      href={SITE_SOCIAL[platform]}
                      className="about-cta__social-link"
                      data-platform={platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(labelKey)}
                    >
                      <Icon className="about-cta__social-icon" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
