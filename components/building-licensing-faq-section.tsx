"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { PageTranslationNamespace } from "@/lib/licensing-page-config";

const FAQ_ITEM_IDS = [
  "scope",
  "timeline",
  "authority",
  "documents",
  "changeOfUse",
  "start",
] as const;

type FaqItemId = (typeof FAQ_ITEM_IDS)[number];

function FaqChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`bl-faq__chevron ${open ? "bl-faq__chevron--open" : ""}`}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type BuildingLicensingFaqSectionProps = {
  namespace?: PageTranslationNamespace;
};

export function BuildingLicensingFaqSection({
  namespace = "BuildingLicensing",
}: BuildingLicensingFaqSectionProps) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const isRtl = locale === "he";
  const titleId = useId();
  const [openId, setOpenId] = useState<FaqItemId | null>(null);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = (id: FaqItemId) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      aria-labelledby={titleId}
      className={`bl-faq relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 scroll-mt-24 sm:scroll-mt-28 ${revealed ? "bl-faq--revealed" : ""}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bl-faq__bg" aria-hidden />
      <div className="bl-faq__grid" aria-hidden />

      <div className="relative mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        <header className="bl-faq__header text-center">
          <p className="bl-faq__eyebrow">— {t("faqEyebrow")} —</p>
          <h2 id={titleId} className="bl-faq__title">
            {t("faqTitle")}
          </h2>
          <p className="bl-faq__lead">{t("faqLead")}</p>
        </header>

        <div className="bl-faq__list" role="presentation">
          {FAQ_ITEM_IDS.map((id, index) => {
            const open = openId === id;
            const panelId = `bl-faq-panel-${id}`;
            const triggerId = `bl-faq-trigger-${id}`;
            return (
              <div
                key={id}
                className={`bl-faq__item ${open ? "bl-faq__item--open" : ""}`}
                style={{ "--bl-faq-delay": `${index * 70}ms` } as CSSProperties}
              >
                <h3 className="bl-faq__item-heading">
                  <button
                    id={triggerId}
                    type="button"
                    className="bl-faq__trigger"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(id)}
                  >
                    <span className="bl-faq__question">{t(`faq.items.${id}.question`)}</span>
                    <FaqChevron open={open} />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!open}
                  className="bl-faq__panel"
                >
                  <p className="bl-faq__answer">{t(`faq.items.${id}.answer`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
