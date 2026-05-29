"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ABOUT_JOURNEY_STEP_KEYS } from "@/components/about-content";

function subscribeNoop(): () => void {
  return () => {};
}

function useHydrated() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return reduced;
}

export function AboutJourneySection() {
  const t = useTranslations("About");
  const locale = useLocale();
  const titleId = useId();
  const isRtl = locale === "he";
  const hydrated = useHydrated();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set([0]));
  const totalSteps = ABOUT_JOURNEY_STEP_KEYS.length;

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(new Set(ABOUT_JOURNEY_STEP_KEYS.map((_, i) => i)));
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!hydrated || reducedMotion) return;
    const root = sectionRef.current;
    if (!root) return;

    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, index) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setActiveIndex(index);
            setRevealed((prev) => new Set(prev).add(index));
          }
        },
        { root: null, threshold: 0.4, rootMargin: "-15% 0px -25% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });

    const onScroll = () => {
      if (!root) return;
      const sectionTop = root.offsetTop;
      const sectionHeight = root.offsetHeight;
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      const progress = Math.min(
        1,
        Math.max(0, (scrollY - sectionTop) / (sectionHeight * 0.85)),
      );
      setLineProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observers.forEach((io) => io.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [hydrated, reducedMotion, totalSteps]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={titleId}
      className="about-journey relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 py-16 sm:py-20 lg:py-24"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative mx-auto max-w-3xl px-4 sm:max-w-4xl sm:px-6">
        <header className="about-section-header border-t-0 pt-0">
          <p className="about-eyebrow">{t("journeyEyebrow")}</p>
          <h2 id={titleId} className="about-display">
            {t("journeyTitle")}
          </h2>
          <p className="about-lead">{t("journeyLead")}</p>
        </header>

        <div className="relative mt-14">
          <div className="about-journey__track" aria-hidden>
            <div
              className="about-journey__track-fill"
              style={{
                height: `${Math.round(lineProgress * 100)}%`,
              }}
            />
          </div>

          <ol className="m-0 list-none p-0" aria-label={t("journeyProgressLabel")}>
            {ABOUT_JOURNEY_STEP_KEYS.map((key, index) => {
              const isActive = activeIndex === index;
              const isRevealed = revealed.has(index) || reducedMotion;
              return (
                <li
                  key={key}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className={`about-journey__step ${
                    isActive ? "about-journey__step--active" : ""
                  } ${isRevealed ? "about-journey__step--revealed" : ""}`}
                >
                  <span className="about-journey__dot" aria-hidden />
                  <p className="about-journey__year">{t(`journeySteps.${key}.year`)}</p>
                  <div className="about-journey__card">
                    <h3 className="about-journey__card-title">
                      {t(`journeySteps.${key}.title`)}
                    </h3>
                    <p className="about-journey__card-body">
                      {t(`journeySteps.${key}.body`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
