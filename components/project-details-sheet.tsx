"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useScene } from "@/components/scene-provider";
import {
  projectClientImageSrc,
  type ProjectSlug,
} from "@/lib/projects";

export type ProjectDetailsSheetProps =
  | {
      slug: ProjectSlug;
      variant: "listing";
      onOpenGallery: () => void;
    }
  | { slug: ProjectSlug; variant: "detail" };

function DetailRow({
  label,
  children,
  tone,
  accentLabel = false,
  denseMobile = false,
}: {
  label: string;
  children: React.ReactNode;
  tone: "paper" | "page";
  /** Listing card: לקוח / סוג פרויקט / תיאור labels in accent orange */
  accentLabel?: boolean;
  /** רשימת פרויקטים: ריווח אנכי צפוף יותר מתחת ל־lg */
  denseMobile?: boolean;
}) {
  const labelClass =
    tone === "page"
      ? accentLabel
        ? "text-[var(--color-accent)]"
        : "text-[var(--color-text)]/62"
      : "text-[#6b6560]";
  const valueWrapClass =
    tone === "page"
      ? "text-[var(--color-text)]"
      : "text-[#1c1917]";
  const rowPad = denseMobile
    ? "py-5 max-lg:py-2.5 first:pt-0 last:pb-0"
    : "py-5 first:pt-0 last:pb-0";
  const labelGap = denseMobile ? "mt-2 max-lg:mt-1" : "mt-2";
  return (
    <div className={rowPad}>
      <p className={`text-sm font-normal ${labelClass}`}>
        {label}
        <span aria-hidden>:</span>
      </p>
      <div
        className={`${labelGap} text-pretty text-base leading-snug sm:text-[1.05rem] ${valueWrapClass}`}
      >
        {children}
      </div>
    </div>
  );
}

export function ProjectDetailsSheet(props: ProjectDetailsSheetProps) {
  const { slug, variant } = props;
  const onOpenGallery =
    variant === "listing" ? props.onOpenGallery : undefined;
  const t = useTranslations("Projects");
  const locale = useLocale();
  const dir = locale === "he" ? "rtl" : "ltr";

  const title = t(`items.${slug}.title`);
  const cardSubtitle = t(`items.${slug}.cardSubtitle`);
  const rawBody = t(`items.${slug}.cardBody`);
  const paragraphs = useMemo(
    () => rawBody.split(/\n\n+/).map((p) => p.trim()).filter(Boolean),
    [rawBody],
  );

  const testimonialLead = t(`items.${slug}.testimonialLead`).trim();
  const testimonialHighlight = t(`items.${slug}.testimonialHighlight`).trim();
  const testimonialContext = t(`items.${slug}.testimonialContext`).trim();
  const clientSrc = projectClientImageSrc(slug);
  const showTestimonialBlock = Boolean(
    clientSrc || testimonialLead || testimonialHighlight,
  );
  const tone = variant === "listing" ? "page" : "paper";
  const { scene } = useScene();
  /** זכוכית כהה + טקסט בהיר: דף פרויקט, או רשימת פרויקטים במצב יום */
  const testimonialDarkGlass =
    variant === "detail" || (variant === "listing" && scene === "day");

  const rootClass =
    tone === "page"
      ? "flex h-full min-h-0 flex-col rounded-sm border border-[color-mix(in_oklab,var(--color-text)_14%,transparent)] bg-[var(--color-card-listing-surface)] px-4 py-5 lg:px-6 lg:py-7"
      : "flex min-h-0 flex-col rounded-2xl bg-[#fdfbf7] px-5 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:px-7 sm:py-8";

  const titleClass =
    tone === "page"
      ? "text-xl font-bold tracking-tight text-[var(--color-text)] sm:text-2xl"
      : "text-xl font-bold tracking-tight text-[#1c1917] sm:text-2xl";

  /** רשימת פרויקטים: סולם טקסט אחיד ליום ולילה; בדף פרטים נשאר גדול יותר */
  const listingTestimonial = variant === "listing";

  const barMutedClass =
    tone === "page"
      ? "min-h-[3px] flex-1 bg-[color-mix(in_oklab,var(--color-text)_24%,transparent)]"
      : "min-h-[3px] flex-1 bg-[#d6d3d1]";

  const testimonialLabelClass =
    tone === "page"
      ? "text-xs font-normal text-[var(--color-accent)] sm:text-sm"
      : "text-sm font-normal text-[#6b6560]";

  const aboutFirstClass =
    tone === "page"
      ? "text-base font-light leading-relaxed text-[var(--color-text)]/88 sm:text-[1.02rem]"
      : "text-base font-normal leading-relaxed text-[#57534e] sm:text-[1.05rem]";

  const aboutRestClass =
    tone === "page"
      ? "text-[0.97rem] font-light leading-relaxed text-[var(--color-text)]/78 sm:text-base"
      : "text-[0.97rem] font-normal leading-relaxed text-[#57534e] sm:text-base";

  return (
    <div
      dir={dir}
      lang={locale === "he" ? "he" : "en"}
      className={rootClass}
    >
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <div className="shrink-0">
          <h2 className={titleClass}>{t("detailSectionTitle")}</h2>

          <div
            className={`mt-4 flex h-[3px] w-full overflow-hidden rounded-full ${tone === "page" ? "max-lg:mt-2.5" : ""}`}
            aria-hidden
          >
            {tone === "page" ? (
              <div className={`h-full w-full ${barMutedClass}`} />
            ) : (
              <>
                <div className="h-full w-[min(22%,6rem)] shrink-0 bg-[var(--color-accent)]" />
                <div className={`h-full ${barMutedClass}`} />
              </>
            )}
          </div>
        </div>

        <div className="mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <DetailRow
            tone={tone}
            denseMobile={tone === "page"}
            accentLabel={tone === "page"}
            label={t("detailLabelClient")}
          >
            <span className="font-bold" id={`project-heading-${slug}`}>
              {title}
            </span>
          </DetailRow>
          <DetailRow
            tone={tone}
            denseMobile={tone === "page"}
            accentLabel={tone === "page"}
            label={t("detailLabelType")}
          >
            <span className="font-bold">{cardSubtitle}</span>
          </DetailRow>
          <DetailRow
            tone={tone}
            denseMobile={tone === "page"}
            accentLabel={tone === "page"}
            label={t("detailLabelAbout")}
          >
            <div
              className={
                tone === "page" ? "space-y-3 max-lg:space-y-2" : "space-y-3"
              }
            >
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? aboutFirstClass : aboutRestClass}
                >
                  {p}
                </p>
              ))}
            </div>
          </DetailRow>

          {variant === "listing" && onOpenGallery ? (
            <div className="flex justify-center pb-1 pt-3 sm:pt-6 lg:pt-7">
              <button
                type="button"
                onClick={onOpenGallery}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-transparent px-3.5 py-1 text-xs font-medium text-[var(--color-text)]/95 shadow-none transition-[background-color,border-color,opacity] hover:bg-[color-mix(in_oklab,var(--color-accent)_14%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 sm:px-4 sm:text-[0.8125rem]"
              >
                {t("viewPhotoGallery")}
              </button>
            </div>
          ) : null}
        </div>

        {showTestimonialBlock ? (
          <div
            className={
              tone === "page"
                ? "mt-5 max-lg:mt-3 shrink-0 max-lg:pt-1 pt-2"
                : "mt-5 shrink-0 border-t border-stone-200/80 pt-5"
            }
          >
            <p
              className={`${tone === "page" ? "mb-2 max-lg:mb-1.5 sm:mb-3" : "mb-3"} ${testimonialLabelClass}`}
            >
              {t("testimonialLabel")}
              <span aria-hidden>:</span>
            </p>
            <figure
              className={
                testimonialDarkGlass
                  ? "isolate overflow-hidden rounded-xl border border-white/22 bg-gradient-to-br from-black/92 via-black/84 to-black/76 p-4 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5),0_6px_24px_-8px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.45)] backdrop-blur-sm backdrop-saturate-110 sm:p-5"
                  : "isolate overflow-hidden rounded-xl border border-white/55 bg-gradient-to-br from-white/78 via-white/66 to-white/54 p-4 shadow-[0_14px_44px_-10px_rgba(0,0,0,0.45),0_6px_20px_-6px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-sm backdrop-saturate-110 sm:p-5"
              }
            >
              {/* Physical layout: quote mark left, testimonial text right (Hebrew); mirror via dir=ltr row + inner text dir */}
              <div
                className="flex flex-row items-start gap-3 sm:gap-4"
                dir="ltr"
              >
                <span
                  aria-hidden
                  className={
                    listingTestimonial
                      ? testimonialDarkGlass
                        ? "shrink-0 select-none font-serif text-[1.85rem] leading-none text-white/85 sm:text-[2rem]"
                        : "shrink-0 select-none font-serif text-[1.85rem] leading-none text-black sm:text-[2rem]"
                      : testimonialDarkGlass
                        ? "shrink-0 select-none font-serif text-[2.1rem] leading-none text-white/85 sm:text-[2.35rem]"
                        : "shrink-0 select-none font-serif text-[2.1rem] leading-none text-black sm:text-[2.35rem]"
                  }
                >
                  {"\u201c"}
                </span>
                <blockquote
                  className="relative z-[1] m-0 min-w-0 flex-1"
                  dir={locale === "he" ? "rtl" : "ltr"}
                >
                  <p
                    className={
                      listingTestimonial
                        ? testimonialDarkGlass
                          ? `text-pretty text-[0.95rem] font-normal leading-[1.6] antialiased text-white sm:text-[1rem] sm:leading-[1.65] ${locale === "he" ? "text-right" : "text-left"}`
                          : `text-pretty text-[0.95rem] font-normal leading-[1.6] antialiased text-neutral-950 sm:text-[1rem] sm:leading-[1.65] ${locale === "he" ? "text-right" : "text-left"}`
                        : testimonialDarkGlass
                          ? `text-pretty text-[1rem] font-normal leading-[1.65] antialiased text-white sm:text-[1.05rem] sm:leading-[1.7] ${locale === "he" ? "text-right" : "text-left"}`
                          : `text-pretty text-[1rem] font-normal leading-[1.65] antialiased text-neutral-950 sm:text-[1.05rem] sm:leading-[1.7] ${locale === "he" ? "text-right" : "text-left"}`
                    }
                  >
                    {testimonialLead ? (
                      <span>{testimonialLead}</span>
                    ) : null}
                    {testimonialHighlight ? (
                      <span
                        className={`mt-2.5 block leading-relaxed sm:mt-3 ${locale === "he" ? "text-right" : "text-left"} ${
                          listingTestimonial
                            ? testimonialDarkGlass
                              ? "text-[0.95rem] font-semibold leading-[1.6] text-white antialiased sm:text-[1rem] sm:leading-[1.65]"
                              : "text-[0.95rem] font-semibold leading-[1.6] text-neutral-950 antialiased sm:text-[1rem] sm:leading-[1.65]"
                            : testimonialDarkGlass
                              ? "text-[1rem] font-semibold leading-[1.65] text-white antialiased sm:text-[1.05rem] sm:leading-[1.7]"
                              : "text-[1rem] font-semibold leading-[1.65] text-neutral-950 antialiased sm:text-[1.05rem] sm:leading-[1.7]"
                        }`}
                      >
                        {testimonialHighlight}
                      </span>
                    ) : null}
                  </p>
                </blockquote>
              </div>

              <figcaption
                className={
                  testimonialDarkGlass
                    ? `mt-6 flex flex-row items-center gap-6 border-t border-white/18 pt-5 sm:mt-7 sm:gap-8 ${
                        clientSrc && locale === "he"
                          ? "flex-row-reverse justify-between"
                          : clientSrc
                            ? "justify-between"
                            : "justify-start"
                      }`
                    : `mt-6 flex flex-row items-center gap-6 border-t border-black/10 pt-5 sm:mt-7 sm:gap-8 ${
                        clientSrc && locale === "he"
                          ? "flex-row-reverse justify-between"
                          : clientSrc
                            ? "justify-between"
                            : "justify-start"
                      }`
                }
                dir="ltr"
              >
                {clientSrc ? (
                  <div className="shrink-0">
                    <Image
                      src={clientSrc}
                      alt={t("clientPhotoAlt")}
                      width={64}
                      height={64}
                      unoptimized
                      className={`size-16 rounded-full object-cover ring-1 ${
                        testimonialDarkGlass
                          ? "ring-white/25"
                          : "ring-black/12"
                      }`}
                    />
                  </div>
                ) : null}
                <div
                  className={`flex min-w-0 ${clientSrc ? "flex-1" : ""} ${
                    locale === "he"
                      ? "justify-start"
                      : clientSrc
                        ? "justify-end"
                        : "justify-start"
                  }`}
                >
                  <div
                    className={`w-fit max-w-full ${locale === "he" ? "text-right" : "text-left"}`}
                    dir={locale === "he" ? "rtl" : "ltr"}
                  >
                    <p
                      className={
                        listingTestimonial
                          ? testimonialDarkGlass
                            ? "text-sm font-bold text-white sm:text-[0.9375rem]"
                            : "text-sm font-bold text-black sm:text-[0.9375rem]"
                          : testimonialDarkGlass
                            ? "text-base font-bold text-white"
                            : "text-base font-bold text-black"
                      }
                    >
                      {title}
                    </p>
                    {testimonialContext ? (
                      <p
                        className={
                          listingTestimonial
                            ? testimonialDarkGlass
                              ? "mt-1 text-xs text-white/80 sm:text-[0.8125rem]"
                              : "mt-1 text-xs text-black sm:text-[0.8125rem]"
                            : testimonialDarkGlass
                              ? "mt-1.5 text-sm text-white/75"
                              : "mt-1.5 text-sm text-black"
                        }
                      >
                        {testimonialContext}
                      </p>
                    ) : null}
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
        ) : null}
      </div>
    </div>
  );
}
