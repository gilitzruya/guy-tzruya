"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  sitePhoneTelHref,
} from "@/lib/site-contact";

export function AccessibilityStatementPage() {
  const t = useTranslations("Accessibility");
  const locale = useLocale();
  const isRtl = locale === "he";

  return (
    <div
      className="accessibility-statement mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <header className="space-y-4 text-center sm:text-start">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c4a574]">
          {t("statementEyebrow")}
        </p>
        <h1 className="text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
          {t("statementTitle")}
        </h1>
        <p className="text-sm text-[var(--color-text)]/70">{t("lastUpdated")}</p>
      </header>

      <div className="mt-10 space-y-8 text-base leading-8 text-[var(--color-text)]/88">
        <section aria-labelledby="a11y-commitment-heading">
          <h2 id="a11y-commitment-heading" className="mb-3 text-xl font-semibold text-[var(--color-text)]">
            {t("commitmentTitle")}
          </h2>
          <p>{t("commitmentBody")}</p>
        </section>

        <section aria-labelledby="a11y-standard-heading">
          <h2 id="a11y-standard-heading" className="mb-3 text-xl font-semibold text-[var(--color-text)]">
            {t("standardTitle")}
          </h2>
          <p>{t("standardBody")}</p>
        </section>

        <section aria-labelledby="a11y-measures-heading">
          <h2 id="a11y-measures-heading" className="mb-3 text-xl font-semibold text-[var(--color-text)]">
            {t("measuresTitle")}
          </h2>
          <ul className="list-disc space-y-2 ps-6">
            <li>{t("measureMenu")}</li>
            <li>{t("measureKeyboard")}</li>
            <li>{t("measureAria")}</li>
            <li>{t("measureSkip")}</li>
            <li>{t("measureContrast")}</li>
          </ul>
        </section>

        <section aria-labelledby="a11y-browsers-heading">
          <h2 id="a11y-browsers-heading" className="mb-3 text-xl font-semibold text-[var(--color-text)]">
            {t("browsersTitle")}
          </h2>
          <p>{t("browsersBody")}</p>
        </section>

        <section aria-labelledby="a11y-coordinator-heading">
          <h2 id="a11y-coordinator-heading" className="mb-3 text-xl font-semibold text-[var(--color-text)]">
            {t("coordinatorTitle")}
          </h2>
          <p>{t("coordinatorBody")}</p>
          <ul className="mt-4 space-y-2">
            <li>
              <strong>{t("coordinatorNameLabel")}:</strong> {t("coordinatorName")}
            </li>
            <li>
              <strong>{t("coordinatorEmailLabel")}:</strong>{" "}
              <a href={`mailto:${SITE_EMAIL}`} className="underline decoration-[#c4a574]/60 underline-offset-2">
                {SITE_EMAIL}
              </a>
            </li>
            <li>
              <strong>{t("coordinatorPhoneLabel")}:</strong>{" "}
              <a
                href={sitePhoneTelHref()}
                className="underline decoration-[#c4a574]/60 underline-offset-2"
                dir="ltr"
              >
                {SITE_PHONE_DISPLAY}
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="a11y-feedback-heading">
          <h2 id="a11y-feedback-heading" className="mb-3 text-xl font-semibold text-[var(--color-text)]">
            {t("feedbackTitle")}
          </h2>
          <p>{t("feedbackBody")}</p>
          <p className="mt-4">
            <Link href="/contact" className="font-medium text-[#c4a574] underline underline-offset-2">
              {t("feedbackContactLink")}
            </Link>
          </p>
        </section>

        <section aria-labelledby="a11y-limitations-heading">
          <h2 id="a11y-limitations-heading" className="mb-3 text-xl font-semibold text-[var(--color-text)]">
            {t("limitationsTitle")}
          </h2>
          <p>{t("limitationsBody")}</p>
        </section>
      </div>
    </div>
  );
}
