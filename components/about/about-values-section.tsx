"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import {
  ABOUT_VALUE_ICONS,
  ABOUT_VALUE_KEYS,
  type AboutValueIcon,
} from "@/components/about-content";

const DISPLAY_ORDER = ["2", "1", "0"] as const;

function ValueIcon({ icon }: { icon: AboutValueIcon }) {
  const common = {
    width: 42,
    height: 42,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.15,
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "craft":
      return (
        <svg {...common}>
          <path d="M6 24l6-10 4 6 5-8 5 12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 24h22" strokeLinecap="round" />
        </svg>
      );
    case "listen":
      return (
        <svg {...common}>
          <path d="M16 8v4M12 12a4 4 0 0 1 8 0v2a3 3 0 0 1-6 0v-2" strokeLinecap="round" />
          <path d="M16 18v3M13 21h6" strokeLinecap="round" />
          <circle cx="16" cy="10" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="8" y="12" width="16" height="12" rx="1" />
          <path d="M11 12V9h10v3M8 16h16" strokeLinecap="round" />
          <path d="M13 18h6" strokeLinecap="round" />
        </svg>
      );
  }
}

export function AboutValuesSection() {
  const t = useTranslations("About");
  const locale = useLocale();
  const titleId = useId();
  const isRtl = locale === "he";

  const orderedKeys = DISPLAY_ORDER.map((index) => ABOUT_VALUE_KEYS[Number(index)])
    .filter((key): key is (typeof ABOUT_VALUE_KEYS)[number] => Boolean(key));

  return (
    <section
      aria-labelledby={titleId}
      className="about-values-editorial relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <header className="about-values-editorial__header">
        <p className="about-eyebrow">{t("valuesEyebrow")}</p>
        <h2 id={titleId} className="about-display about-values-editorial__title">
          {t("valuesTitle")}
        </h2>
        <span className="about-values-editorial__title-divider" aria-hidden />
        <p className="about-values-editorial__lead">{t("valuesLead")}</p>
      </header>

      <div className="about-values-editorial__grid">
        {orderedKeys.map((key, index) => {
          const sourceIndex = Number(key);
          const icon = ABOUT_VALUE_ICONS[sourceIndex] ?? "wholeness";
          const numberLabel = String(index + 1).padStart(2, "0");

          return (
            <article key={key} className="about-values-editorial__pillar">
              <div className="about-values-editorial__icon-ring" aria-hidden>
                <span className="about-values-editorial__icon-arc" />
                <span className="about-values-editorial__icon">
                  <ValueIcon icon={icon} />
                </span>
              </div>

              <p className="about-values-editorial__index">
                <span className="about-values-editorial__index-line" aria-hidden />
                <span>{numberLabel}</span>
                <span className="about-values-editorial__index-line" aria-hidden />
              </p>

              <h3 className="about-values-editorial__pillar-title">
                {t(`values.${key}.title`)}
              </h3>
              <p className="about-values-editorial__pillar-body">
                {t(`values.${key}.body`)}
              </p>
            </article>
          );
        })}
      </div>

      <div className="about-values-editorial__footer" aria-hidden>
        <span className="about-values-editorial__footer-line" />
        <span className="about-values-editorial__footer-mark">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 3v12M6 6l3-3 3 3M6 12l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="about-values-editorial__footer-line" />
      </div>
    </section>
  );
}
