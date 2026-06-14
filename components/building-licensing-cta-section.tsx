"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import {
  IconFacebook,
  IconInstagram,
} from "@/components/building-licensing-social-icons";
import { Link } from "@/i18n/navigation";
import type { LicensingNamespace } from "@/lib/licensing-page-config";
import { SITE_SOCIAL, type SiteSocialPlatform } from "@/lib/site-social";

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
      className={`bl-cta__button-arrow ${rtl ? "bl-cta__button-arrow--rtl" : ""}`}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
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

type BuildingLicensingCtaSectionProps = {
  namespace?: LicensingNamespace;
  mailtoSubject?: string;
};

export function BuildingLicensingCtaSection({
  namespace = "BuildingLicensing",
  mailtoSubject = "Building planning inquiry",
}: BuildingLicensingCtaSectionProps) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const isRtl = locale === "he";
  const titleId = useId();

  return (
    <section
      id="contact"
      aria-labelledby={titleId}
      className="bl-cta relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 scroll-mt-24 overflow-hidden sm:scroll-mt-28"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bl-cta__ambient" aria-hidden>
        <div className="bl-cta__ambient-grid" />
        <div className="bl-cta__ambient-glow" />
        <div className="bl-cta__ambient-line" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="bl-cta__frame">
          <span className="bl-cta__corner bl-cta__corner--tl" aria-hidden />
          <span className="bl-cta__corner bl-cta__corner--tr" aria-hidden />
          <span className="bl-cta__corner bl-cta__corner--bl" aria-hidden />
          <span className="bl-cta__corner bl-cta__corner--br" aria-hidden />

          <article className="bl-cta__card">
            <header className="bl-cta__header">
              <p className="bl-cta__eyebrow">
                <span className="bl-cta__eyebrow-line" aria-hidden />
                <span>{t("ctaEyebrow")}</span>
                <span className="bl-cta__eyebrow-line" aria-hidden />
              </p>
              <h2 id={titleId} className="bl-cta__title">
                {t("ctaTitle")}
              </h2>
              <p className="bl-cta__lead">{t("ctaLead")}</p>
            </header>

            <div className="bl-cta__actions">
              <Link href="/contact" className="bl-cta__button">
                <span className="bl-cta__button-text">{t("ctaButton")}</span>
                <CtaArrow rtl={isRtl} />
              </Link>
            </div>

            <div className="bl-cta__social-block">
              <div className="bl-cta__divider" aria-hidden>
                <span className="bl-cta__divider-line" />
                <span className="bl-cta__divider-gem" />
                <span className="bl-cta__divider-line" />
              </div>
              <p className="bl-cta__social-label">{t("ctaSocialLabel")}</p>
              <ul className="bl-cta__social-list" aria-label={t("ctaSocialLabel")}>
                {SOCIAL_LINKS.map(({ platform, Icon, labelKey }) => (
                  <li key={platform}>
                    <a
                      href={SITE_SOCIAL[platform]}
                      className="bl-cta__social-link"
                      data-platform={platform}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(labelKey)}
                    >
                      <Icon className="bl-cta__social-icon" />
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
