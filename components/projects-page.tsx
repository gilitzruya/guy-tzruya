"use client";

import { useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useScene } from "@/components/scene-provider";
import { ProjectBeforeAfterSlider } from "@/components/project-before-after-slider";
import { ProjectDetailsSheet } from "@/components/project-details-sheet";
import { ProjectGalleryDialog } from "@/components/project-gallery-dialog";
import { TypewriterText } from "@/components/typewriter-text";
import { PROJECT_SLUGS, type ProjectSlug } from "@/lib/projects";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";

export function ProjectsPage() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const { scene } = useScene();
  const projectsHeroHeadingId = useId();
  const [gallerySlug, setGallerySlug] = useState<ProjectSlug | null>(null);

  const pageBgStyle = useMemo(
    () => interiorDesignPageBackgroundStyle(scene),
    [scene],
  );

  const heroTitleFx =
    scene === "night"
      ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.4px_rgb(0_0_0/_0.55)] [text-shadow:0_0_22px_rgb(0_0_0/_0.88),0_2px_12px_rgb(0_0_0/_0.6),0_0_6px_rgb(255_255_255/_0.12)]"
      : "[paint-order:stroke_fill] [-webkit-text-stroke:0.5px_rgb(255_255_255/_0.95)] [text-shadow:0_0_28px_rgb(255_255_255/_0.92),0_1px_10px_rgb(0_0_0/_0.38),0_2px_34px_rgb(255_255_255/_0.55)]";
  const heroSubtitleFx =
    scene === "night"
      ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.55px_rgb(0_0_0/_0.65)] [text-shadow:0_0_18px_rgb(0_0_0/_0.92),0_1px_8px_rgb(0_0_0/_0.7),0_0_4px_rgb(255_255_255/_0.1)]"
      : "[paint-order:stroke_fill] [-webkit-text-stroke:0.7px_rgb(255_255_255/_0.98)] [text-shadow:0_0_24px_rgb(255_255_255/_0.98),0_1px_10px_rgb(0_0_0/_0.45),0_2px_26px_rgb(255_255_255/_0.65)]";

  const subtitleLang = locale === "he" ? "he" : "en";

  const galleryTitle =
    gallerySlug != null ? t(`items.${gallerySlug}.title`) : "";

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={pageBgStyle}
        aria-hidden
      />

      <section
        aria-labelledby={projectsHeroHeadingId}
        className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6"
      >
        <div className="flex flex-col justify-center pb-8 pt-28 sm:pt-32 lg:min-h-[50svh] lg:pb-10 lg:pt-28">
          <div
            dir="ltr"
            className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
          >
            <h1 id={projectsHeroHeadingId} className="text-[var(--color-text)]">
              <TypewriterText
                text={t("heroTitle")}
                charDelayMs={165}
                className={`english-display-title block leading-[0.92] text-[clamp(1.75rem,6.8vw,4.25rem)] ${heroTitleFx}`}
              />
            </h1>
          </div>
          <p
            lang={subtitleLang}
            dir={locale === "he" ? "rtl" : "ltr"}
            className={`mx-auto mt-5 max-w-2xl text-pretty text-center text-base leading-7 text-[var(--color-text)]/92 sm:text-lg ${locale === "en" ? "english-display-subtitle english-display-subtitle--long" : ""} ${heroSubtitleFx}`}
          >
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      <div className="w-full lg:isolate">
        {PROJECT_SLUGS.map((slug: ProjectSlug, index) => {
          const useSwapColumns =
            locale === "he" ? index % 2 === 1 : index % 2 === 0;
          /** `order` swaps cells; column widths must flip too or the wide slot stays text-only. */
          const gridCols = useSwapColumns
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]"
            : "lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]";
          const sliderOrder = useSwapColumns ? "lg:order-2" : "";
          const detailsOrder = useSwapColumns ? "lg:order-1" : "";

          /**
           * Sticky stack: section = 100dvh + runway; next section uses -mt equal to that
           * runway so it overlaps in scroll while the previous sticky is still pinned.
           */
          const sectionScrollClass =
            "max-lg:min-h-0 lg:min-h-[calc(100dvh+min(82svh,88dvh))]";
          const overlapPullClass =
            index > 0 ? "lg:-mt-[min(82svh,88dvh)]" : "";

          return (
            <section
              key={slug}
              aria-labelledby={`project-heading-${slug}`}
              className={`relative ${sectionScrollClass} ${overlapPullClass}`}
              style={{ ...pageBgStyle, zIndex: 10 + index }}
            >
              <div
                className="max-lg:relative max-lg:min-h-0 lg:sticky lg:top-0 lg:z-0 lg:block lg:h-[100dvh] lg:min-h-[100dvh] lg:max-h-[100dvh] lg:shrink-0"
                style={pageBgStyle}
              >
                <div
                  className={`flex h-full min-h-0 w-full flex-col px-3 pb-6 sm:px-4 sm:pb-8 lg:px-5 lg:pb-10 lg:pt-0 ${index === 0 ? "pt-4" : "pt-2"}`}
                >
                  <div
                    className={`flex min-h-0 flex-1 flex-col gap-0 max-lg:gap-0 py-3 sm:py-6 lg:grid lg:min-h-0 lg:flex-1 lg:items-stretch lg:gap-x-0 lg:gap-y-0 lg:pb-8 lg:pt-0 ${gridCols}`}
                  >
                    <div
                      className={`flex min-h-0 min-w-0 flex-col lg:h-full lg:min-h-0 ${sliderOrder}`}
                    >
                      <ProjectBeforeAfterSlider
                        slug={slug}
                        title={t(`items.${slug}.title`)}
                        priority={index === 0}
                        imageObjectFit="cover"
                        fillHeight
                        compactMobileHeight
                        sizes="(min-width: 1024px) 72vw, 100vw"
                        className="flex min-h-0 min-w-0 flex-1 flex-col"
                      />
                    </div>

                    <div
                      className={`flex min-h-0 min-w-0 flex-col pt-0 lg:h-full lg:pt-0 ${detailsOrder}`}
                    >
                      <ProjectDetailsSheet
                        slug={slug}
                        variant="listing"
                        onOpenGallery={() => setGallerySlug(slug)}
                      />
                    </div>
                  </div>

                  {index < PROJECT_SLUGS.length - 1 ? (
                    <div
                      className="mt-8 h-px w-full shrink-0 lg:hidden"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, color-mix(in oklab, #c4a574 42%, transparent) 50%, transparent 100%)",
                      }}
                      aria-hidden
                    />
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {gallerySlug != null ? (
        <ProjectGalleryDialog
          key={gallerySlug}
          slug={gallerySlug}
          title={galleryTitle}
          onClose={() => setGallerySlug(null)}
        />
      ) : null}
    </div>
  );
}
