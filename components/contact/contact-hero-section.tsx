"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";

export function ContactHeroSection() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const headingId = useId();
  const isRtl = locale === "he";

  return (
    <section
      aria-labelledby={headingId}
      className="contact-hero"
    >
      <div
        className="contact-hero__content"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <p className="contact-hero__eyebrow">
          <span className="contact-hero__eyebrow-line" aria-hidden />
          <span>{t("heroEyebrow")}</span>
          <span className="contact-hero__eyebrow-line" aria-hidden />
        </p>

        <h1 id={headingId} className="contact-hero__title">
          {t("heroTitle")}
        </h1>

        <p className="contact-hero__lead">{t("heroLead")}</p>

        <a href="#contact-details" className="contact-hero__scroll-cta">
          <span>{t("heroScrollCta")}</span>
          <svg
            className="contact-hero__scroll-arrow scroll-arrow-hint"
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
    </section>
  );
}
