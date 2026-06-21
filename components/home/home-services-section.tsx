"use client";

import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { type HomeServiceKey } from "@/components/home/home-content";

const PRIMARY_SERVICE: HomeServiceKey = "interiorDesign";
const LEFT_SERVICE: HomeServiceKey = "buildingLicensing";
const RIGHT_SERVICE: HomeServiceKey = "businessLicensing";

const SERVICE_HREF: Record<HomeServiceKey, string> = {
  interiorDesign: "/interior-design",
  buildingLicensing: "/building-licensing",
  businessLicensing: "/business-licensing",
};

function ServiceIcon({ service }: { service: HomeServiceKey }) {
  if (service === "interiorDesign") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden>
        <path d="M8 30v-7l6-6 6 6v7" />
        <rect x="20" y="13" width="11" height="17" rx="1.5" />
        <path d="M24 23h3M24 19h3M12 30h4" />
      </svg>
    );
  }

  if (service === "buildingLicensing") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden>
        <path d="M6 28h28M8 28V14l12-7 12 7v14" />
        <rect x="16" y="20" width="8" height="8" rx="1.5" />
        <path d="M14 10h12" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" aria-hidden>
      <path d="M6 30V16l14-8 14 8v14" />
      <path d="M12 20h16M12 24h16M12 28h16" />
      <path d="M8 16h24" />
    </svg>
  );
}

function HighlightIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 19c3-4 13-4 16 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3 4 7v5c0 5 3.3 8.6 8 9 4.7-.4 8-4 8-9V7l-8-4Z" />
        <path d="m9.5 12 1.8 1.8L15 10" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.6 6.8 19.3l1-5.9L3.5 9.2l5.9-.9L12 3Z" />
    </svg>
  );
}

export function HomeServicesSection() {
  const t = useTranslations("Home.services");
  const locale = useLocale();
  const titleId = useId();
  const isRtl = locale === "he";

  const sideCards: Array<{ service: HomeServiceKey; side: "left" | "right" }> = [
    { service: LEFT_SERVICE, side: "left" },
    { service: RIGHT_SERVICE, side: "right" },
  ];
  const highlights = [0, 1, 2, 3] as const;

  return (
    <section
      id="home-services"
      aria-labelledby={titleId}
      dir={isRtl ? "rtl" : "ltr"}
      className="home-services-premium relative scroll-mt-24 py-10 sm:scroll-mt-28 sm:py-20 lg:py-24"
    >
      <div className="home-services-premium__inner">
        <header className="home-services-premium__header">
          <p className="home-services-premium__eyebrow">
            <span className="home-services-premium__eyebrow-line" aria-hidden />
            {t("eyebrow")}
            <span className="home-services-premium__eyebrow-line" aria-hidden />
          </p>
          <h2 id={titleId} className="home-services-premium__title">
            <span>{t("displayTitlePrefix")}</span>{" "}
            <em>{t("displayTitleAccent")}</em>{" "}
            <span>{t("displayTitleSuffix")}</span>
          </h2>
          <p className="home-services-premium__lead">{t("lead")}</p>
        </header>

        <div
          className="home-services-premium__grid home-services-premium__carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label={t("eyebrow")}
        >
          {sideCards.map(({ service, side }) => (
            <article
              key={service}
              className={`home-services-premium-card home-services-premium-card--side home-services-premium-card--${side}`}
            >
              <div className="home-services-premium-card__icon-ring">
                <ServiceIcon service={service} />
              </div>
              <h3 className="home-services-premium-card__title">
                {t(`${service}.title`)}
              </h3>
              <p className="home-services-premium-card__desc">
                {t(`${service}.description`)}
              </p>
              <Link
                className="home-services-premium-card__link"
                href={SERVICE_HREF[service]}
              >
                {t("learnMore")}
              </Link>
            </article>
          ))}

          <article className="home-services-premium-card home-services-premium-card--featured">
            <div className="home-services-premium-card__image" aria-hidden />
            <div className="home-services-premium-card__shade" aria-hidden />
            <div className="home-services-premium-card__icon-ring home-services-premium-card__icon-ring--featured">
              <ServiceIcon service={PRIMARY_SERVICE} />
            </div>
            <h3 className="home-services-premium-card__featured-title">
              {t(`${PRIMARY_SERVICE}.title`)}
            </h3>
            <p className="home-services-premium-card__desc home-services-premium-card__desc--featured">
              {t(`${PRIMARY_SERVICE}.description`)}
            </p>
            <Link
              className="home-services-premium-card__link home-services-premium-card__link--featured"
              href={SERVICE_HREF[PRIMARY_SERVICE]}
            >
              {t("learnMore")}
            </Link>
          </article>
        </div>

        <div className="home-services-premium__highlights">
          {highlights.map((item, index) => (
            <div key={item} className="home-services-premium-highlight">
              <span className="home-services-premium-highlight__icon">
                <HighlightIcon index={index} />
              </span>
              <span>{t(`highlights.${item}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
