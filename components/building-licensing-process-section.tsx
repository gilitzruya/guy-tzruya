"use client";

import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { BuildingLicensingStepIcon } from "@/components/building-licensing-icons";
import {
  BUILDING_LICENSING_PROCESS_CTA_BUTTON,
  BUILDING_LICENSING_PROCESS_CTA_LEAD,
  BUILDING_LICENSING_PROCESS_EYEBROW,
  BUILDING_LICENSING_PROCESS_STEPS,
  BUILDING_LICENSING_PROCESS_SUBTITLE,
  BUILDING_LICENSING_PROCESS_TITLE,
  type BuildingLicensingProcessStep,
} from "@/components/building-licensing-content";
import { useScene } from "@/components/scene-provider";
import { buildingLicensingHeroButtonClass } from "@/lib/building-licensing-hero-button";
import type {
  LicensingProcessContent,
  PageTranslationNamespace,
} from "@/lib/licensing-page-config";

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

type BuildingLicensingProcessSectionProps = {
  namespace?: PageTranslationNamespace;
  content?: LicensingProcessContent;
  mailtoSubject?: string;
};

const DEFAULT_CONTENT: LicensingProcessContent = {
  eyebrow: BUILDING_LICENSING_PROCESS_EYEBROW,
  title: BUILDING_LICENSING_PROCESS_TITLE,
  subtitle: BUILDING_LICENSING_PROCESS_SUBTITLE,
  ctaLead: BUILDING_LICENSING_PROCESS_CTA_LEAD,
  ctaButton: BUILDING_LICENSING_PROCESS_CTA_BUTTON,
  steps: BUILDING_LICENSING_PROCESS_STEPS,
};

export function BuildingLicensingProcessSection({
  namespace = "BuildingLicensing",
  content = DEFAULT_CONTENT,
  mailtoSubject = "Building planning inquiry",
}: BuildingLicensingProcessSectionProps) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const isRtl = locale === "he";
  const hydrated = useHydrated();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const totalSteps = content.steps.length;

  useEffect(() => {
    if (!hydrated || reducedMotion) return;
    const root = sectionRef.current;
    if (!root) return;

    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((el, index) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActiveIndex(index);
        },
        { root: null, threshold: 0.55, rootMargin: "-20% 0px -35% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });

    const onScroll = () => {
      const first = stepRefs.current[0];
      const last = stepRefs.current[totalSteps - 1];
      if (!first || !last || !root) return;
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

  const progressPercent = Math.round(
    ((activeIndex + 1) / totalSteps) * 100,
  );
  const { scene } = useScene();
  const ctaButtonClass = buildingLicensingHeroButtonClass(scene, {
    onLightSurface: scene === "day",
  });

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="building-licensing-process-title"
      className="bl-process bl-full-bleed scroll-mt-24 overflow-x-clip sm:scroll-mt-28"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bl-process__bg" aria-hidden />
      <div className="bl-process__glow" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        <div className="bl-process__layout">
          <aside className="bl-process__aside">
            <div className="bl-process__aside-inner">
              <p className="bl-process__eyebrow">— {content.eyebrow} —</p>
              <h2 id="building-licensing-process-title" className="bl-process__title">
                {content.title}
              </h2>
              <p className="bl-process__lead">{content.subtitle}</p>

              <div
                className="bl-process__ring"
                role="img"
                aria-label={`${t("processProgressLabel")}: ${progressPercent}%`}
              >
                <svg viewBox="0 0 120 120" className="size-[7.5rem]">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="bl-process__ring-track"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-[var(--bl-copper)]"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - (activeIndex + 1) / totalSteps)}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="bl-process__ring-label">
                  <span className="bl-process__ring-value">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="bl-process__ring-of">/{String(totalSteps).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="bl-process__timeline">
            <div
              className="bl-process__track"
              aria-hidden
              style={{ "--bl-line-progress": lineProgress } as CSSProperties}
            />
            <ol className="bl-process__steps">
              {content.steps.map((step: BuildingLicensingProcessStep, index) => {
                const isActive = index === activeIndex;
                const isPast = index < activeIndex;
                return (
                  <li
                    key={step.title}
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
                    className={`bl-process__step ${isActive ? "bl-process__step--active" : ""} ${isPast ? "bl-process__step--past" : ""}`}
                  >
                    <div className="bl-process__node" aria-hidden>
                      <span className="bl-process__node-dot" />
                    </div>
                    <article className="bl-process__card">
                      <div className="bl-process__card-head">
                        <span className="bl-process__index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <BuildingLicensingStepIcon
                          index={index}
                          className="bl-process__icon size-10 text-[var(--bl-copper)]"
                        />
                      </div>
                      <h3 className="bl-process__step-title">{step.title}</h3>
                      <p className="bl-process__step-desc">{step.description}</p>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <footer className="bl-process__footer">
          <p>{content.ctaLead}</p>
          <a
            href={`mailto:studio@guytzruya.com?subject=${encodeURIComponent(mailtoSubject)}`}
            className={`mt-5 ${ctaButtonClass}`}
          >
            {content.ctaButton}
          </a>
        </footer>
      </div>
    </section>
  );
}
