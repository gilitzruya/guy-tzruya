"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useScene } from "@/components/scene-provider";
import { INTERIOR_STYLES } from "@/components/interior-design-content";
import { InteriorDesignProcessSection } from "@/components/interior-design-process-section";
import { TypewriterText } from "@/components/typewriter-text";
import {
  interiorDesignHeroImageUrl,
  interiorDesignPageBackgroundUrl,
  interiorDesignPageBackgroundStyle,
} from "@/lib/interior-page-background";

/**
 * Align with gallery layout (`lg:grid-cols-2` = min-width 1024px).
 * Below this width we always use `mobile-*.webp` for both day and night.
 */
const GALLERY_DESKTOP_ASSET_MIN_WIDTH = 1024;
type CardScene = "day" | "night";

function useGalleryUsesDesktopImageAssets() {
  const [matchesDesktopBreakpoint, setMatchesDesktopBreakpoint] = useState<
    boolean | null
  >(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(
      `(min-width: ${GALLERY_DESKTOP_ASSET_MIN_WIDTH}px)`,
    ).matches;
  });

  useLayoutEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${GALLERY_DESKTOP_ASSET_MIN_WIDTH}px)`,
    );
    const apply = () => setMatchesDesktopBreakpoint(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return matchesDesktopBreakpoint;
}

function buildStyleImageSrc(slug: string, isDesktop: boolean, scene: "day" | "night") {
  const device = isDesktop ? "desktop" : "mobile";
  return `/interior-design/styles/${slug}/${device}-${scene}.webp`;
}

function DayNightToggle({
  ariaScopeName,
  scene,
  onChange,
  ariaLabel,
}: {
  ariaScopeName: string;
  scene: CardScene;
  onChange: (next: CardScene) => void;
  ariaLabel: string;
}) {
  return (
    <label
      dir="ltr"
      className="inline-flex h-[30px] w-[140px] cursor-pointer items-center rounded-full border border-black/10 bg-white/90 px-1 text-xs font-medium text-[#222] shadow-sm backdrop-blur-sm"
      aria-label={ariaLabel}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={scene === "night"}
        onChange={(e) =>
          onChange(e.target.checked ? "night" : "day")
        }
      />
      <svg
        viewBox="0 0 16 16"
        width={23}
        className="me-1 shrink-0 text-indigo-900"
        fill="currentColor"
        aria-hidden
      >
        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
      </svg>
      <span className="relative block h-[26px] flex-1 overflow-hidden rounded-full bg-[#e0e0e0] text-[#424242] peer-checked:bg-[#151515] peer-checked:text-white">
        <span className="absolute inset-y-0 left-[10px] z-10 flex items-center text-[11px]">
          יום
        </span>
        <span className="absolute inset-y-0 right-[10px] z-10 flex items-center text-[11px]">
          לילה
        </span>
        <span
          className={`absolute left-[2px] top-[2px] z-0 h-[22px] w-[34px] rounded-full shadow-[0_0_6px_-2px_#111] transition-transform duration-300 ${
            scene === "night"
              ? "translate-x-[38px] bg-[#3c3c3c]"
              : "translate-x-0 bg-white"
          }`}
        />
      </span>
      <svg
        viewBox="0 0 16 16"
        width={23}
        className="ms-1 shrink-0 text-[#c4a574]"
        fill="currentColor"
        aria-hidden
      >
        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8z" />
      </svg>
    </label>
  );
}

export function InteriorDesignPage() {
  const t = useTranslations("InteriorDesign");
  const tA11y = useTranslations("Accessibility");
  const locale = useLocale();
  const { scene } = useScene();
  const galleryViewport = useGalleryUsesDesktopImageAssets();
  /** Desktop `desktop-*.webp` only when viewport ≥ lg; otherwise `mobile-*` (day + night). */
  const useDesktopStyleImages = galleryViewport === true;
  const pageBgStyle = useMemo(
    () => interiorDesignPageBackgroundStyle(scene),
    [scene],
  );
  const processHeaderBgVar = useMemo(
    () =>
      ({
        "--bl-header-bg-url": `url("${interiorDesignPageBackgroundUrl(scene)}")`,
      }) as CSSProperties,
    [scene],
  );
  const heroImageSrc = interiorDesignHeroImageUrl(scene);
  const [cardSceneBySlug, setCardSceneBySlug] = useState<Record<string, CardScene>>({});
  const [lightboxSlug, setLightboxSlug] = useState<string | null>(null);
  const lightboxTitleId = useId();
  const interiorHeroHeadingId = useId();

  const closeLightbox = useCallback(() => setLightboxSlug(null), []);

  const cards = useMemo(
    () =>
      INTERIOR_STYLES.map((style) => ({
        slug: style.slug,
        title: t(`styles.${style.slug}.title`),
        subtitle: t(`styles.${style.slug}.subtitle`),
        description: t(`styles.${style.slug}.description`),
        cardScene: cardSceneBySlug[style.slug] ?? scene,
        src: buildStyleImageSrc(
          style.slug,
          useDesktopStyleImages,
          cardSceneBySlug[style.slug] ?? scene,
        ),
      })),
    [useDesktopStyleImages, scene, cardSceneBySlug, t],
  );

  const lightboxStyle = lightboxSlug
    ? cards.find((c) => c.slug === lightboxSlug)
    : undefined;
  const lightboxScene = lightboxSlug
    ? (cardSceneBySlug[lightboxSlug] ?? scene)
    : scene;
  const lightboxSrc =
    lightboxSlug !== null
      ? buildStyleImageSrc(lightboxSlug, useDesktopStyleImages, lightboxScene)
      : "";

  useEffect(() => {
    if (!lightboxSlug) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxSlug]);

  useEffect(() => {
    if (!lightboxSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxSlug, closeLightbox]);

  const setSlugScene = useCallback((slug: string, next: CardScene) => {
    setCardSceneBySlug((prev) => ({ ...prev, [slug]: next }));
  }, []);

  const heroTitleFx =
    scene === "night" || scene === "day"
    ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.4px_rgb(0_0_0/_0.55)] [text-shadow:0_0_22px_rgb(0_0_0/_0.88),0_2px_12px_rgb(0_0_0/_0.6),0_0_6px_rgb(255_255_255/_0.12)]"
    : "";
  const heroSubtitleFx =
    scene === "night" || scene === "day"
    ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.55px_rgb(0_0_0/_0.65)] [text-shadow:0_0_18px_rgb(0_0_0/_0.92),0_1px_8px_rgb(0_0_0/_0.7),0_0_4px_rgb(255_255_255/_0.1)]"
    : "";

  const subtitleLang = locale === "he" ? "he" : "en";

  const heroGhostBtn =
    scene === "day"
      ? "inline-flex min-h-[3rem] min-w-[10.5rem] items-center justify-center border border-white/55 bg-black/15 px-6 text-center text-xs font-medium uppercase tracking-[0.22em] text-white backdrop-blur-[3px] transition-[background-color,border-color] hover:border-white/80 hover:bg-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:min-h-[3.25rem] sm:px-8 sm:text-[0.8125rem]"
      : "inline-flex min-h-[3rem] min-w-[10.5rem] items-center justify-center border border-[color-mix(in_oklab,var(--color-text)_50%,transparent)] bg-transparent px-6 text-center text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-text)] backdrop-blur-[2px] transition-[background-color,border-color] hover:border-[color-mix(in_oklab,var(--color-text)_75%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-text)_6%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:min-h-[3.25rem] sm:px-8 sm:text-[0.8125rem]";
  const simulationCtaBtn =
    "inline-flex min-h-[3rem] items-center justify-center gap-2 border border-[color-mix(in_oklab,#c4a574_80%,transparent)] bg-transparent px-8 text-sm font-medium tracking-[0.12em] text-[#c4a574] backdrop-blur-[2px] transition-[background-color,border-color,box-shadow] hover:border-[#c4a574] hover:bg-[color-mix(in_oklab,#c4a574_10%,transparent)] hover:shadow-[0_0_28px_-6px_rgba(196,165,116,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4a574] sm:min-h-[3.25rem] sm:px-10 sm:text-[0.9375rem]";

  return (
    <div className="relative" style={processHeaderBgVar}>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={pageBgStyle}
        aria-hidden
      />
      <section
        aria-labelledby={interiorHeroHeadingId}
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={heroImageSrc}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className={`interior-hero-image${scene === "day" ? " interior-hero-image--day" : ""}`}
            key={heroImageSrc}
          />
          {scene === "day" ? (
            <div className="absolute inset-0 bg-black/40" />
          ) : null}
          <div
            className={`absolute inset-0 ${
              scene === "night"
                ? "bg-gradient-to-b from-black/50 via-black/35 to-[color-mix(in_oklab,var(--color-bg)_72%,transparent)]"
                : "bg-gradient-to-b from-black/55 via-black/40 to-black/30"
            }`}
          />
        </div>
        <div
          className={`relative z-10 mx-auto flex min-h-[min(72svh,44rem)] w-full max-w-6xl flex-col justify-start px-4 pb-6 pt-40 sm:px-6 sm:pt-44 lg:pb-8 lg:pt-48 ${
            scene === "day" ? "text-white" : "text-[var(--color-text)]"
          }`}
        >
          <div
            dir="ltr"
            className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
          >
            <h1 id={interiorHeroHeadingId}>
              <TypewriterText
                text={t("heroTitle")}
                charDelayMs={165}
                className={`english-display-title interior-design-hero-title block leading-[0.92] text-[clamp(1.45rem,5.4vw,3.75rem)] ${heroTitleFx}`}
              />
            </h1>
          </div>
          <p
            lang={subtitleLang}
            dir={locale === "he" ? "rtl" : "ltr"}
            className={`mx-auto mt-10 max-w-2xl text-pretty text-center text-base leading-8 opacity-92 sm:mt-12 sm:text-lg lg:mt-14 ${locale === "en" ? "english-display-subtitle english-display-subtitle--long" : ""} ${heroSubtitleFx}`}
          >
            {t("heroSubtitle")}
          </p>
          <div
            className={`mx-auto mt-10 flex w-full max-w-xl flex-wrap items-center justify-center gap-4 sm:mt-12 sm:gap-5 ${locale === "he" ? "flex-row-reverse" : ""}`}
          >
            <Link href="/projects" className={heroGhostBtn}>
              {t("heroCtaExplore")}
            </Link>
            <Link href="/contact" className={heroGhostBtn}>
              {t("heroCtaStart")}
            </Link>
          </div>
          <div
            className="mx-auto mt-12 flex flex-col items-center gap-2 opacity-75 sm:mt-14 lg:mt-auto lg:pt-10"
            aria-hidden
          >
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.42em]">
              {t("heroScroll")}
            </span>
            <svg
              width="18"
              height="28"
              viewBox="0 0 18 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="scroll-arrow-hint opacity-80"
            >
              <path
                d="M9 1v22M9 23l-6-6M9 23l6-6"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <header className="border-t border-[color-mix(in_oklab,var(--color-text)_12%,transparent)] pt-14 text-center sm:pt-16">
          <p
            dir="ltr"
            className="text-sm tracking-[0.35em] text-[var(--color-text)]/70 sm:text-base"
          >
            ( {t("stylesYear")} )
          </p>
          <h2
            dir={locale === "he" ? "rtl" : "ltr"}
            className={`mx-auto mt-4 max-w-4xl leading-[0.95] text-[clamp(1.35rem,4.5vw,2.75rem)] text-[var(--color-text)] [font-family:var(--font-interior-display),ui-serif,Georgia,serif] ${
              locale === "he"
                ? "font-normal tracking-[0.055em]"
                : "font-semibold uppercase tracking-[0.12em] [word-spacing:0.28em]"
            }`}
          >
            {t("stylesSectionTitle")}
          </h2>
          <div
            className="mx-auto mt-5 h-px w-16 bg-[color-mix(in_oklab,var(--color-text)_35%,transparent)]"
            aria-hidden
          />
        </header>
      </section>

      <section className="w-full px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {cards.map((card) => (
            <article key={card.slug} className="overflow-hidden rounded-2xl">
              <div className="group relative w-full overflow-hidden max-lg:aspect-[16/10] max-lg:max-h-[min(52svh,420px)] lg:aspect-[16/10] lg:h-auto lg:max-h-none lg:min-h-0">
                <Image
                  key={card.src}
                  src={card.src}
                  alt={card.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) calc((100vw - 2rem - 2rem - 1rem) / 2), 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] group-focus-within:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-within:scale-100"
                  priority
                />
                <button
                  type="button"
                  aria-label={tA11y("viewFullImage", { title: card.title })}
                  className="absolute inset-0 z-[1] cursor-zoom-in rounded-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  onClick={() => setLightboxSlug(card.slug)}
                />
                <div
                  className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/0 transition-[background-color] duration-300 group-hover:bg-black/30 group-focus-within:bg-black/30 motion-reduce:transition-none"
                  aria-hidden
                >
                  <span className="flex size-14 scale-90 items-center justify-center rounded-full border border-white/75 bg-black/40 text-white opacity-0 shadow-[0_8px_32px_rgb(0_0_0/_0.35)] backdrop-blur-[6px] transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none sm:size-16">
                    <svg
                      className="size-6 sm:size-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden
                    >
                      <path
                        d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <div className="pointer-events-auto absolute start-3 top-3 z-10 sm:start-4 sm:top-4">
                  <DayNightToggle
                    ariaScopeName={card.title}
                    ariaLabel={tA11y("dayNightToggle", { name: card.title })}
                    scene={card.cardScene}
                    onChange={(next) => setSlugScene(card.slug, next)}
                  />
                </div>
              </div>
              <div className="space-y-3 pb-2 pt-4">
                <h3 className="text-3xl font-normal tracking-[0.04em] text-[var(--color-text)] [font-family:var(--font-interior-display),ui-serif,Georgia,serif]">
                  {card.title}
                </h3>
                <p className="text-lg text-[var(--color-text)]/85">{card.subtitle}</p>
                <p className="text-base leading-7 text-[var(--color-text)]/75">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="w-full px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8"
        aria-labelledby="interior-simulation-cta-heading"
      >
        <div className="rounded-2xl border border-[color-mix(in_oklab,#c4a574_42%,transparent)] bg-transparent px-6 py-11 text-center sm:px-10 sm:py-14 lg:px-14">
          <p
            dir="ltr"
            className={`text-[0.7rem] text-[#c4a574] sm:text-xs ${locale === "en" ? "english-display-subtitle" : "font-medium uppercase tracking-[0.38em]"}`}
          >
            {t("simulationCtaEyebrow")}
          </p>
          <h2
            id="interior-simulation-cta-heading"
            dir={locale === "he" ? "rtl" : "ltr"}
            className={`mx-auto mt-4 text-[clamp(1.2rem,2.35vw,2.05rem)] leading-[1.2] text-[var(--color-text)] lg:whitespace-nowrap ${locale === "en" ? "english-display-title" : "[font-family:var(--font-interior-display),ui-serif,Georgia,serif] font-normal"}`}
          >
            {t("simulationCtaTitle")}
          </h2>
          <p
            dir={locale === "he" ? "rtl" : "ltr"}
            className={`mx-auto mt-3 max-w-md text-base leading-7 text-[var(--color-text)]/72 sm:mt-4 ${locale === "en" ? "english-display-subtitle english-display-subtitle--long" : ""}`}
          >
            {t("simulationCtaLead")}
          </p>
          <div className="mt-8 sm:mt-9">
            <Link href="/simulation" className={simulationCtaBtn}>
              {t("simulationCtaButton")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={locale === "he" ? "rotate-180" : ""}
                aria-hidden
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {lightboxSlug && lightboxStyle ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={lightboxTitleId}
          className="fixed inset-0 z-[260] bg-black"
          dir="ltr"
        >
          <button
            type="button"
            aria-label={tA11y("lightboxClose")}
            className="absolute inset-0 z-0 cursor-zoom-out"
            onClick={closeLightbox}
          />
          <h2 id={lightboxTitleId} className="sr-only">
            {tA11y("lightboxTitle", { title: lightboxStyle.title })}
          </h2>
          <div className="pointer-events-none absolute inset-0 z-[1] min-h-0">
            <Image
              key={lightboxSrc}
              src={lightboxSrc}
              alt={lightboxStyle.title}
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex justify-between gap-4 px-[max(1rem,env(safe-area-inset-left,0px))] pe-[max(1rem,env(safe-area-inset-right,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))]">
            <div className="pointer-events-auto">
              <DayNightToggle
                ariaScopeName={lightboxStyle.title}
                ariaLabel={tA11y("dayNightToggle", { name: lightboxStyle.title })}
                scene={lightboxScene}
                onChange={(next) => setSlugScene(lightboxSlug, next)}
              />
            </div>
            <button
              type="button"
              aria-label={tA11y("lightboxCloseShort")}
              className="pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-text)_24%,transparent)] text-2xl leading-none text-[var(--color-text)] backdrop-blur-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
              onClick={closeLightbox}
            >
              <span aria-hidden>×</span>
            </button>
          </div>
        </div>
      ) : null}

      <InteriorDesignProcessSection />
    </div>
  );
}
