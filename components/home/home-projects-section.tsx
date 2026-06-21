"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
  type TransitionEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  HOME_PROJECT_KEYS,
  type HomeProjectKey,
} from "@/components/home/home-content";
import { projectBeforeAfterSrc } from "@/lib/projects";

const AUTOPLAY_MS = 3000;
const DESKTOP_CROSSFADE_MS = 1000;

function prefersReducedMotion(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.a11yReduceMotion === "true";
}

function CarouselDots({
  carouselId,
  activeIndex,
  onSelect,
  label,
}: {
  carouselId: string;
  activeIndex: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  const t = useTranslations("Home.projects");

  return (
    <div className="home-projects-carousel__dots" role="tablist" aria-label={label}>
      {HOME_PROJECT_KEYS.map((project: HomeProjectKey, index) => {
        const title = t(`items.${project}.title`);
        return (
          <button
            key={project}
            type="button"
            role="tab"
            className={`home-projects-carousel__dot${activeIndex === index ? " home-projects-carousel__dot--active" : ""}`}
            aria-selected={activeIndex === index}
            aria-controls={carouselId}
            aria-label={t("carouselSlideLabel", { title })}
            onClick={() => onSelect(index)}
          />
        );
      })}
    </div>
  );
}

function useCarouselAutoplay(
  sectionRef: RefObject<HTMLDivElement | null>,
  activeIndex: number,
  isPaused: boolean,
  onAdvance: () => void,
) {
  const [isVisible, setIsVisible] = useState(false);
  const pauseUntilRef = useRef(0);

  const pauseAutoplay = useCallback((durationMs = AUTOPLAY_MS * 2) => {
    pauseUntilRef.current = Date.now() + durationMs;
    return durationMs;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  useEffect(() => {
    if (!isVisible || isPaused || prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      onAdvance();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused, isVisible, onAdvance]);

  return { pauseAutoplay };
}

function useSectionVisibility(sectionRef: RefObject<HTMLDivElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  return isVisible;
}

function useDesktopCarouselAutoplay(
  sectionRef: RefObject<HTMLDivElement | null>,
  isTransitioning: boolean,
  isPaused: boolean,
  onAdvance: () => void,
) {
  const isVisible = useSectionVisibility(sectionRef);
  const pauseUntilRef = useRef(0);

  const pauseAutoplay = useCallback((durationMs = AUTOPLAY_MS * 2) => {
    pauseUntilRef.current = Date.now() + durationMs;
  }, []);

  useEffect(() => {
    if (!isVisible || isPaused || isTransitioning || prefersReducedMotion()) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (Date.now() < pauseUntilRef.current) return;
      onAdvance();
    }, AUTOPLAY_MS);

    return () => window.clearTimeout(timer);
  }, [isPaused, isTransitioning, isVisible, onAdvance]);

  return { pauseAutoplay };
}

function getLayerClassName(
  index: number,
  activeIndex: number,
  exitingIndex: number | null,
  baseClass: string,
): string {
  const isActive = index === activeIndex;
  const isExiting = exitingIndex === index;
  return `${baseClass}${isActive ? " is-active" : ""}${isExiting ? " is-exiting" : ""}`;
}

/** Mobile: horizontal scroll + snap (unchanged). */
function HomeProjectsCarouselMobile() {
  const t = useTranslations("Home.projects");
  const locale = useLocale();
  const isRtl = locale === "he";
  const carouselId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      const slide = slideRefs.current[index];
      if (!track || !slide) return;
      track.scrollTo({ left: slide.offsetLeft, behavior });
      setActiveIndex(index);
    },
    [],
  );

  const syncActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const scrollLeft = track.scrollLeft;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const distance = Math.abs(slide.offsetLeft - scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setActiveIndex(closest);
  }, []);

  const advance = useCallback(() => {
    setActiveIndex((current) => {
      const next = (current + 1) % HOME_PROJECT_KEYS.length;
      const track = trackRef.current;
      const slide = slideRefs.current[next];
      if (track && slide) {
        track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
      }
      return next;
    });
  }, []);

  const { pauseAutoplay } = useCarouselAutoplay(
    sectionRef,
    activeIndex,
    isPaused,
    advance,
  );

  const pauseAndSet = useCallback(
    (durationMs?: number) => {
      pauseAutoplay(durationMs);
      setIsPaused(true);
    },
    [pauseAutoplay],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => syncActiveIndex();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [syncActiveIndex]);

  useEffect(() => {
    if (!isPaused) return;
    const timer = window.setTimeout(() => setIsPaused(false), AUTOPLAY_MS * 2);
    return () => window.clearTimeout(timer);
  }, [isPaused]);

  return (
    <div
      ref={sectionRef}
      className="home-projects-carousel home-projects-carousel--mobile md:hidden"
      aria-roledescription="carousel"
      aria-label={t("eyebrow")}
    >
      <div
        ref={trackRef}
        id={carouselId}
        className="home-projects-carousel__track"
        dir="ltr"
        onPointerDown={() => pauseAndSet()}
        onFocusCapture={() => pauseAndSet()}
      >
        {HOME_PROJECT_KEYS.map((project: HomeProjectKey, index) => (
          <article
            key={project}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            className="home-projects-carousel__slide"
            aria-hidden={activeIndex !== index}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <Link
              href={`/projects/${project}`}
              className="home-projects-carousel__image-link"
            >
              <div className="home-projects-carousel__image-wrap home-projects-carousel__image-wrap--mobile">
                <Image
                  src={projectBeforeAfterSrc(project, "after", "mobile")}
                  alt={t(`items.${project}.imageAlt`)}
                  fill
                  unoptimized
                  priority={index === 0}
                  sizes="100vw"
                  className="home-projects-carousel__image"
                />
              </div>
              <div className="home-projects-carousel__image-wrap home-projects-carousel__image-wrap--desktop">
                <Image
                  src={projectBeforeAfterSrc(project, "after", "desktop")}
                  alt={t(`items.${project}.imageAlt`)}
                  fill
                  unoptimized
                  priority={index === 0}
                  sizes="(min-width: 768px) 92rem, 0px"
                  className="home-projects-carousel__image"
                />
              </div>
            </Link>
            <div className="home-projects-carousel__body">
              <h3 className="home-projects-carousel__title">
                <Link
                  href={`/projects/${project}`}
                  className="home-projects-carousel__title-link"
                >
                  {t(`items.${project}.title`)}
                </Link>
              </h3>
              <p className="home-projects-carousel__teaser">
                {t(`items.${project}.teaser`)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <CarouselDots
        carouselId={carouselId}
        activeIndex={activeIndex}
        label={t("eyebrow")}
        onSelect={(index) => {
          pauseAndSet();
          scrollToIndex(index);
        }}
      />

      <p className="sr-only" aria-live="polite">
        {t(`items.${HOME_PROJECT_KEYS[activeIndex]}.title`)}
      </p>
    </div>
  );
}

/** Desktop: symmetric CSS crossfade between stacked slides. */
function HomeProjectsCarouselDesktop() {
  const t = useTranslations("Home.projects");
  const locale = useLocale();
  const isRtl = locale === "he";
  const carouselId = useId();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isTransitioning = exitingIndex !== null;

  const clearExiting = useCallback(() => {
    setExitingIndex(null);
  }, []);

  const goToIndex = useCallback((index: number) => {
    setActiveIndex((current) => {
      if (current === index) return current;
      if (prefersReducedMotion()) {
        setExitingIndex(null);
      } else {
        setExitingIndex(current);
      }
      return index;
    });
  }, []);

  const advance = useCallback(() => {
    setActiveIndex((current) => {
      const next = (current + 1) % HOME_PROJECT_KEYS.length;
      if (current === next) return current;
      if (prefersReducedMotion()) {
        setExitingIndex(null);
      } else {
        setExitingIndex(current);
      }
      return next;
    });
  }, []);

  const { pauseAutoplay } = useDesktopCarouselAutoplay(
    sectionRef,
    isTransitioning,
    isPaused,
    advance,
  );

  const pauseAndGo = useCallback(
    (index: number) => {
      pauseAutoplay();
      setIsPaused(true);
      goToIndex(index);
    },
    [goToIndex, pauseAutoplay],
  );

  const goToRelative = useCallback(
    (delta: number) => {
      const next =
        (activeIndex + delta + HOME_PROJECT_KEYS.length) %
        HOME_PROJECT_KEYS.length;
      pauseAndGo(next);
    },
    [activeIndex, pauseAndGo],
  );

  const handleLayerTransitionEnd = useCallback(
    (index: number, event: TransitionEvent<HTMLElement>) => {
      if (event.propertyName !== "opacity") return;
      if (index !== exitingIndex) return;
      clearExiting();
    },
    [clearExiting, exitingIndex],
  );

  useEffect(() => {
    if (exitingIndex === null) return;
    if (prefersReducedMotion()) {
      clearExiting();
      return;
    }
    const timer = window.setTimeout(clearExiting, DESKTOP_CROSSFADE_MS + 50);
    return () => window.clearTimeout(timer);
  }, [clearExiting, exitingIndex]);

  useEffect(() => {
    for (const project of HOME_PROJECT_KEYS) {
      const img = new window.Image();
      img.src = projectBeforeAfterSrc(project, "after", "desktop");
    }
  }, []);

  useEffect(() => {
    if (!isPaused) return;
    const timer = window.setTimeout(() => setIsPaused(false), AUTOPLAY_MS * 2);
    return () => window.clearTimeout(timer);
  }, [isPaused]);

  return (
    <div
      ref={sectionRef}
      className="home-projects-carousel home-projects-carousel--desktop hidden md:block"
      aria-roledescription="carousel"
      aria-label={t("eyebrow")}
    >
      <div className="home-projects-carousel__viewport">
        <button
          type="button"
          className="home-projects-carousel__arrow home-projects-carousel__arrow--prev"
          aria-label={t("carouselPrev")}
          onClick={() => goToRelative(-1)}
        >
          <span aria-hidden>{isRtl ? "\u2039" : "\u203a"}</span>
        </button>

        <div
          id={carouselId}
          className="home-projects-carousel__fade-stage"
          onPointerDown={() => {
            pauseAutoplay();
            setIsPaused(true);
          }}
          onFocusCapture={() => {
            pauseAutoplay();
            setIsPaused(true);
          }}
        >
          {HOME_PROJECT_KEYS.map((project: HomeProjectKey, index) => {
            const isActive = activeIndex === index;
            const isExiting = exitingIndex === index;
            const isVisible = isActive || isExiting;
            return (
              <article
                key={project}
                className={getLayerClassName(
                  index,
                  activeIndex,
                  exitingIndex,
                  "home-projects-carousel__fade-slide",
                )}
                onTransitionEnd={(event) =>
                  handleLayerTransitionEnd(index, event)
                }
                aria-hidden={!isVisible}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <Link
                  href={`/projects/${project}`}
                  className="home-projects-carousel__image-link"
                  tabIndex={isActive && !isTransitioning ? 0 : -1}
                >
                  <div className="home-projects-carousel__image-wrap home-projects-carousel__image-wrap--desktop">
                    <Image
                      src={projectBeforeAfterSrc(project, "after", "desktop")}
                      alt={t(`items.${project}.imageAlt`)}
                      fill
                      unoptimized
                      priority
                      sizes="(min-width: 768px) 92rem"
                      className="home-projects-carousel__image"
                    />
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          className="home-projects-carousel__arrow home-projects-carousel__arrow--next"
          aria-label={t("carouselNext")}
          onClick={() => goToRelative(1)}
        >
          <span aria-hidden>{isRtl ? "\u203a" : "\u2039"}</span>
        </button>
      </div>

      <CarouselDots
        carouselId={carouselId}
        activeIndex={activeIndex}
        label={t("eyebrow")}
        onSelect={pauseAndGo}
      />

      <div className="home-projects-carousel__footer-row">
        <div className="home-projects-carousel__meta-stage">
          {HOME_PROJECT_KEYS.map((project: HomeProjectKey, index) => {
            const isActive = activeIndex === index;
            const isExiting = exitingIndex === index;
            const isVisible = isActive || isExiting;
            return (
              <div
                key={project}
                className={getLayerClassName(
                  index,
                  activeIndex,
                  exitingIndex,
                  "home-projects-carousel__meta",
                )}
                onTransitionEnd={(event) =>
                  handleLayerTransitionEnd(index, event)
                }
                dir={isRtl ? "rtl" : "ltr"}
                aria-hidden={!isVisible}
              >
                <h3 className="home-projects-carousel__title">
                  <Link
                    href={`/projects/${project}`}
                    className="home-projects-carousel__title-link"
                    tabIndex={isActive && !isTransitioning ? 0 : -1}
                  >
                    {t(`items.${project}.title`)}
                  </Link>
                </h3>
                <p className="home-projects-carousel__teaser">
                  {t(`items.${project}.teaser`)}
                </p>
              </div>
            );
          })}
        </div>
        <Link className="home-projects-showcase__all-cta" href="/projects">
          <span className="home-projects-showcase__all-cta-arrow" aria-hidden>
            {isRtl ? "\u2190" : "\u2192"}
          </span>
          {t("learnMore")}
        </Link>
      </div>

      <p className="sr-only" aria-live="polite">
        {t(`items.${HOME_PROJECT_KEYS[activeIndex]}.title`)}
      </p>
    </div>
  );
}

function HomeProjectsCarousel() {
  return (
    <>
      <HomeProjectsCarouselMobile />
      <HomeProjectsCarouselDesktop />
    </>
  );
}

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

        <HomeProjectsCarousel />

        <footer className="home-projects-showcase__footer md:hidden">
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
