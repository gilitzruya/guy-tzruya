"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useScene } from "@/components/scene-provider";
import {
  INTERIOR_STYLES,
  INTERIOR_STYLES_TITLE,
} from "@/components/interior-design-content";
import { InteriorDesignProcessSection } from "@/components/interior-design-process-section";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";

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
}: {
  ariaScopeName: string;
  scene: CardScene;
  onChange: (next: CardScene) => void;
}) {
  return (
    <label
      dir="ltr"
      className="inline-flex h-[30px] w-[140px] cursor-pointer items-center rounded-full border border-black/10 bg-white/90 px-1 text-xs font-medium text-[#222] shadow-sm backdrop-blur-sm"
      aria-label={`החלפת מצב יום/לילה עבור ${ariaScopeName}`}
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
        className="ms-1 shrink-0 text-amber-500"
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
  const locale = useLocale();
  const { scene } = useScene();
  const galleryViewport = useGalleryUsesDesktopImageAssets();
  /** Desktop `desktop-*.webp` only when viewport ≥ lg; otherwise `mobile-*` (day + night). */
  const useDesktopStyleImages = galleryViewport === true;
  const pageBgStyle = useMemo(
    () => interiorDesignPageBackgroundStyle(scene),
    [scene],
  );
  const [cardSceneBySlug, setCardSceneBySlug] = useState<Record<string, CardScene>>({});
  const [lightboxSlug, setLightboxSlug] = useState<string | null>(null);
  const lightboxTitleId = useId();
  const interiorHeroHeadingId = useId();

  const closeLightbox = useCallback(() => setLightboxSlug(null), []);

  const cards = useMemo(
    () =>
      INTERIOR_STYLES.map((style) => ({
        ...style,
        cardScene: cardSceneBySlug[style.slug] ?? scene,
        src: buildStyleImageSrc(
          style.slug,
          useDesktopStyleImages,
          cardSceneBySlug[style.slug] ?? scene,
        ),
      })),
    [useDesktopStyleImages, scene, cardSceneBySlug],
  );

  const lightboxStyle = lightboxSlug
    ? INTERIOR_STYLES.find((s) => s.slug === lightboxSlug)
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
    scene === "night"
      ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.4px_rgb(0_0_0/_0.55)] [text-shadow:0_0_22px_rgb(0_0_0/_0.88),0_2px_12px_rgb(0_0_0/_0.6),0_0_6px_rgb(255_255_255/_0.12)]"
      : "[paint-order:stroke_fill] [-webkit-text-stroke:0.5px_rgb(255_255_255/_0.95)] [text-shadow:0_0_28px_rgb(255_255_255/_0.92),0_1px_10px_rgb(0_0_0/_0.38),0_2px_34px_rgb(255_255_255/_0.55)]";
  const heroSubtitleFx =
    scene === "night"
      ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.55px_rgb(0_0_0/_0.65)] [text-shadow:0_0_18px_rgb(0_0_0/_0.92),0_1px_8px_rgb(0_0_0/_0.7),0_0_4px_rgb(255_255_255/_0.1)]"
      : "[paint-order:stroke_fill] [-webkit-text-stroke:0.7px_rgb(255_255_255/_0.98)] [text-shadow:0_0_24px_rgb(255_255_255/_0.98),0_1px_10px_rgb(0_0_0/_0.45),0_2px_26px_rgb(255_255_255/_0.65)]";

  const subtitleLang = locale === "he" ? "he" : "en";

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={pageBgStyle}
        aria-hidden
      />
      <section
        aria-labelledby={interiorHeroHeadingId}
        className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6"
      >
        <div className="flex flex-col justify-center pb-8 pt-28 sm:pt-32 lg:min-h-[50svh] lg:pb-10 lg:pt-28">
          <div
            dir="ltr"
            className="mx-auto flex w-full max-w-5xl flex-col items-center text-center [font-family:var(--font-interior-display),ui-serif,Georgia,serif]"
          >
            <h1 id={interiorHeroHeadingId} className="text-[var(--color-text)]">
              <span
                className={`block uppercase leading-[0.92] tracking-[0.14em] [word-spacing:0.35em] text-[clamp(1.75rem,6.8vw,4.25rem)] font-semibold ${heroTitleFx}`}
              >
                {t("heroTitle")}
              </span>
            </h1>
          </div>
          <p
            lang={subtitleLang}
            dir={locale === "he" ? "rtl" : "ltr"}
            className={`mx-auto mt-5 max-w-2xl text-pretty text-center text-base leading-7 text-[var(--color-text)]/92 sm:text-lg ${heroSubtitleFx}`}
          >
            {t("heroSubtitle")}
          </p>
        </div>
        <h2 className="mt-10 text-start text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
          {INTERIOR_STYLES_TITLE}
        </h2>
      </section>

      <section className="w-full px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {cards.map((card) => (
            <article key={card.slug} className="overflow-hidden rounded-2xl">
              <div className="relative w-full overflow-hidden max-lg:aspect-[16/10] max-lg:max-h-[min(52svh,420px)] lg:aspect-[16/10] lg:h-auto lg:max-h-none lg:min-h-0">
                <Image
                  key={card.src}
                  src={card.src}
                  alt={card.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) calc((100vw - 2rem - 2rem - 1rem) / 2), 100vw"
                  className="object-cover"
                  priority
                />
                <button
                  type="button"
                  aria-label={`הצגת ${card.title} במסך מלא`}
                  className="absolute inset-0 z-[1] cursor-zoom-in rounded-[inherit]"
                  onClick={() => setLightboxSlug(card.slug)}
                />
                <div className="pointer-events-auto absolute start-3 top-3 z-10 sm:start-4 sm:top-4">
                  <DayNightToggle
                    ariaScopeName={card.title}
                    scene={card.cardScene}
                    onChange={(next) => setSlugScene(card.slug, next)}
                  />
                </div>
              </div>
              <div className="space-y-3 pb-2 pt-4">
                <h3 className="text-3xl font-semibold text-[var(--color-text)]">{card.title}</h3>
                <p className="text-lg text-[var(--color-text)]/85">{card.subtitle}</p>
                <p className="text-base leading-7 text-[var(--color-text)]/75">{card.description}</p>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-base font-semibold text-[var(--color-bg)] opacity-60 cursor-not-allowed"
                >
                  להדמיה
                </button>
              </div>
            </article>
          ))}
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
            aria-label="סגירת תצוגה מלאה"
            className="absolute inset-0 z-0 cursor-zoom-out"
            onClick={closeLightbox}
          />
          <h2 id={lightboxTitleId} className="sr-only">
            {lightboxStyle.title} — תצוגה מלאה
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
                scene={lightboxScene}
                onChange={(next) => setSlugScene(lightboxSlug, next)}
              />
            </div>
            <button
              type="button"
              aria-label="סגור"
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
