"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { ABOUT_STAT_KEYS } from "@/components/about-content";

function StoryStatIcon({ index }: { index: number }) {
  const common = {
    width: 34,
    height: 34,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.15,
    "aria-hidden": true as const,
  };

  switch (index) {
    case 0:
      return (
        <svg {...common}>
          <path d="M6 26h20M8.5 26V13.5h5V26M15 26V8h5V26M21.5 26V16.5h3V26" />
          <path d="M7.5 13.5h6.5M14.8 8h6.2M21.3 16.5h3.3" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M8 26v-8l8-5 8 5v8M8 18h16M12 26v-5h8v5M9.5 14l6.5-4 6.5 4" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <path d="M6 26h20M7 23l8-8 4 4 6-6M10 10l8 8" />
          <path d="M10 10V6h4M18 18h4v4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="7" y="7" width="18" height="18" rx="1.5" />
          <path d="M12 7v18M20 7v18M7 12h18M7 20h18" />
          <path d="M12 12h3v3h-3zM17 17h3v3h-3z" />
        </svg>
      );
  }
}

function AnimatedStatValue({
  value,
  animationTrigger,
}: {
  value: string;
  animationTrigger: number;
}) {
  const suffix = value.replace(/[\d]/g, "");
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    const target = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
    if (!Number.isFinite(target) || target <= 0) {
      setDisplay(value);
      return;
    }

    setDisplay(`0${suffix}`);
    const durationMs = 3000;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(target * eased);
      setDisplay(`${next}${suffix}`);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, suffix, animationTrigger]);

  return <>{display}</>;
}

export function AboutStorySection() {
  const t = useTranslations("About");
  const locale = useLocale();
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const wasInViewRef = useRef(false);
  const isRtl = locale === "he";
  const bodyParagraphs = t("storyBody").split("\n\n");
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const orderedStatKeys = [1, 0, 3, 2]
    .map((index) => ABOUT_STAT_KEYS[index])
    .filter((key): key is (typeof ABOUT_STAT_KEYS)[number] => Boolean(key));

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = Boolean(entry?.isIntersecting);
        if (inView && !wasInViewRef.current) {
          setAnimationTrigger((prev) => prev + 1);
        }
        wasInViewRef.current = inView;
      },
      { threshold: 0.45, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-story"
      aria-labelledby={titleId}
      className="relative mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 sm:scroll-mt-28 lg:px-8 lg:pb-24 lg:pt-36"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="about-story-cinematic" dir="ltr">
        <div className="about-story-cinematic__visual" aria-hidden>
          <Image
            src="/about/story/archway-editorial.png"
            alt=""
            fill
            className="about-story-cinematic__visual-image"
            sizes="(min-width: 900px) 18rem, 0px"
            priority={false}
            unoptimized
          />
        </div>

        <div className="about-story-cinematic__content" dir={isRtl ? "rtl" : "ltr"}>
          <div className="about-story-cinematic__top" dir="ltr">
            <aside className="about-story-cinematic__body" dir={isRtl ? "rtl" : "ltr"}>
              {bodyParagraphs.map((paragraph, i) => (
                <p key={i} className="about-story__paragraph">
                  {paragraph}
                </p>
              ))}
            </aside>

            <header className="about-story-cinematic__header" dir={isRtl ? "rtl" : "ltr"}>
              <p className="about-eyebrow">{t("storyEyebrow")}</p>
              <h2 id={titleId} className="about-display about-story-cinematic__title">
                {t("storyTitle")}
              </h2>
              <span className="about-story-cinematic__title-divider" aria-hidden />
              <p className="about-story-cinematic__lead">{t("storyLead")}</p>
            </header>
          </div>

          <div className="about-story-cinematic__bottom" dir="ltr">
            <blockquote className="about-story__quote" dir={isRtl ? "rtl" : "ltr"}>
              {t("storyQuote")}
            </blockquote>

            <aside className="about-stats" aria-label={t("storyTitle")} dir="ltr">
              {orderedStatKeys.map((key, index) => (
                <div key={key} className="about-stats__item">
                  <span className="about-stats__icon">
                    <StoryStatIcon index={index} />
                  </span>
                  <span className="about-stats__value">
                    <AnimatedStatValue
                      value={t(`stats.${key}.value`)}
                      animationTrigger={animationTrigger}
                    />
                  </span>
                  <span className="about-stats__label">
                    {t(`stats.${key}.label`)}
                  </span>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
