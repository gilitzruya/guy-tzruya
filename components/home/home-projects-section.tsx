"use client";

import Image from "next/image";
import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  HOME_PROJECT_KEYS,
  type HomeProjectKey,
} from "@/components/home/home-content";
import { projectBeforeAfterSrc } from "@/lib/projects";

const PROJECT_LAYOUT: Record<HomeProjectKey, "number-left" | "number-right"> = {
  shaki: "number-right",
  maklaf: "number-right",
};

export function HomeProjectsSection() {
  const t = useTranslations("Home.projects");
  const locale = useLocale();
  const titleId = useId();
  const isRtl = locale === "he";

  return (
    <section
      id="home-projects"
      aria-labelledby={titleId}
      dir={isRtl ? "rtl" : "ltr"}
      className="home-projects-showcase scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="home-projects-showcase__inner">
        <header className="home-projects-showcase__header">
          <p className="home-projects-showcase__eyebrow">
            <span className="home-projects-showcase__eyebrow-line" aria-hidden />
            {t("eyebrow")}
            <span className="home-projects-showcase__eyebrow-line" aria-hidden />
          </p>
          <h2 id={titleId} className="home-projects-showcase__title">
            {t("title")}
          </h2>
          <p className="home-projects-showcase__lead">{t("lead")}</p>
          <span className="home-projects-showcase__ornament" aria-hidden />
        </header>

        <div className="home-projects-showcase__board">
          {HOME_PROJECT_KEYS.map((project: HomeProjectKey, index) => (
            <article
              key={project}
              className={`home-projects-showcase-card home-projects-showcase-card--${PROJECT_LAYOUT[project]}`}
            >
              <div className="home-projects-showcase-card__image-wrap">
                <Image
                  src={projectBeforeAfterSrc(project, "after", "desktop")}
                  alt={t(`items.${project}.imageAlt`)}
                  fill
                  unoptimized
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="home-projects-showcase-card__image"
                />
              </div>
              <div className="home-projects-showcase-card__body">
                <span className="home-projects-showcase-card__index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="home-projects-showcase-card__copy">
                  <h3 className="home-projects-showcase-card__title">
                    <Link href={`/projects/${project}`} className="home-projects-showcase-card__title-link">
                      {t(`items.${project}.title`)}
                    </Link>
                  </h3>
                  <p className="home-projects-showcase-card__desc">
                    {t(`items.${project}.summary`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="home-projects-showcase__footer">
          <Link className="home-projects-showcase__all-cta" href="/projects">
            <span className="home-projects-showcase__all-cta-arrow" aria-hidden>
              {isRtl ? "\u2190" : "\u2192"}
            </span>
            {t("learnMore")}
          </Link>
        </footer>
      </div>
    </section>
  );
}
