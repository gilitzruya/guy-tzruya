"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <p className="text-sm font-normal text-[#6b6560]">
        {label}
        <span aria-hidden>:</span>
      </p>
      <div className="mt-2 text-pretty text-base leading-snug text-[#1c1917] sm:text-[1.05rem]">
        {children}
      </div>
    </div>
  );
}

function ListingMobileColumn({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col items-center px-1.5 text-center sm:px-2 ${className ?? ""}`}
    >
      <span
        className="mb-1.5 inline-flex size-5 shrink-0 items-center justify-center text-[#c4a574]"
        aria-hidden
      >
        {icon}
      </span>
      <p className="text-[0.68rem] font-medium leading-tight text-[#c4a574] sm:text-xs">
        {label}
      </p>
      <div className="mt-1.5 text-pretty text-[0.72rem] font-medium leading-snug text-[var(--color-text)] sm:text-xs">
        {children}
      </div>
    </div>
  );
}

function ListingField({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-b border-[color-mix(in_oklab,#c4a574_34%,transparent)] py-6 max-lg:py-3.5 last:border-b-0 sm:py-8 lg:py-10 ${className ?? ""}`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        <span
          className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center text-[#c4a574]"
          aria-hidden
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#c4a574]">
            {label}
            <span aria-hidden>:</span>
          </p>
          <div className="mt-2.5 text-pretty text-[1.02rem] leading-relaxed text-[var(--color-text)]/92 sm:mt-3 sm:text-[1.05rem]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingLayout({
  slug,
  dir,
  locale,
  title,
  cardSubtitle,
  aboutShort,
  paragraphs,
  onOpenGallery,
  clientIcon,
  typeIcon,
  aboutIcon,
  t,
}: {
  slug: ProjectSlug;
  dir: "rtl" | "ltr";
  locale: string;
  title: string;
  cardSubtitle: string;
  aboutShort: string;
  paragraphs: string[];
  onOpenGallery?: () => void;
  clientIcon: React.ReactNode;
  typeIcon: React.ReactNode;
  aboutIcon: React.ReactNode;
  t: ReturnType<typeof useTranslations<"Projects">>;
}) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const detailsPanelId = `project-details-body-${slug}`;
  const cardBaseClassName =
    "border-[color-mix(in_oklab,#c4a574_55%,transparent)] bg-[linear-gradient(165deg,rgba(8,9,14,0.97)_0%,rgba(7,9,14,0.95)_48%,rgba(5,7,12,0.97)_100%)]";
  const desktopCardClassName = `${cardBaseClassName} rounded-[18px] border shadow-[0_22px_50px_-24px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(255,255,255,0.08)]`;

  return (
    <>
      <div
        dir={dir}
        lang={locale === "he" ? "he" : "en"}
        className="lg:hidden px-1 py-4"
      >
        <div className="flex flex-col items-center text-center">
          <span
            className="mb-2 inline-flex size-6 items-center justify-center text-[#c4a574]"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none">
              <path
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h2 className="text-base font-medium tracking-tight text-[var(--color-text)]">
            {t("detailSectionTitle")}
          </h2>
          <div
            className="mt-2.5 h-px w-16 bg-[linear-gradient(to_left,color-mix(in_oklab,#c4a574_74%,transparent),transparent)]"
            aria-hidden
          />
        </div>

        <div className="mt-4 grid grid-cols-3">
          <ListingMobileColumn
            label={t("detailLabelClient")}
            icon={clientIcon}
            className="border-inline-end border-[color-mix(in_oklab,#c4a574_34%,transparent)]"
          >
            <span className="font-semibold">{title}</span>
          </ListingMobileColumn>
          <ListingMobileColumn
            label={t("detailLabelType")}
            icon={typeIcon}
            className="border-inline-end border-[color-mix(in_oklab,#c4a574_34%,transparent)]"
          >
            <span className="font-semibold">{cardSubtitle}</span>
          </ListingMobileColumn>
          <ListingMobileColumn label={t("detailLabelAbout")} icon={aboutIcon}>
            {aboutShort}
          </ListingMobileColumn>
        </div>

        {detailsExpanded ? (
          <div
            id={detailsPanelId}
            className="mt-4 border-t border-[color-mix(in_oklab,#c4a574_28%,transparent)] pt-3.5"
          >
            <div className="space-y-2.5 text-pretty text-[0.88rem] leading-[1.7] text-[var(--color-text)]/90">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ) : null}

        {onOpenGallery ? (
          <div className="mt-4 grid grid-cols-2 border-t border-[color-mix(in_oklab,#c4a574_28%,transparent)] pt-3">
            <button
              type="button"
              onClick={() => setDetailsExpanded((open) => !open)}
              aria-expanded={detailsExpanded}
              aria-controls={detailsPanelId}
              className="inline-flex min-h-[2.75rem] items-center justify-center gap-1 border-inline-end border-[color-mix(in_oklab,#c4a574_34%,transparent)] px-2 text-[0.78rem] font-medium text-[#c4a574] transition-colors hover:text-[#d4b584] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c4a574] focus-visible:outline-offset-2"
            >
              <span>
                {detailsExpanded ? t("moreDetailsCollapse") : t("moreDetails")}
              </span>
              <span
                aria-hidden
                className={`text-xs leading-none transition-transform ${detailsExpanded ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            <button
              type="button"
              onClick={onOpenGallery}
              className="inline-flex min-h-[2.75rem] items-center justify-center gap-1 px-2 text-[0.78rem] font-medium text-[#c4a574] transition-colors hover:text-[#d4b584] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c4a574] focus-visible:outline-offset-2"
            >
              <span>{t("viewPhotoGallery")}</span>
              <span aria-hidden className="text-sm leading-none">
                {locale === "he" ? "\u2190" : "\u2192"}
              </span>
            </button>
          </div>
        ) : null}
      </div>

      <div
        dir={dir}
        lang={locale === "he" ? "he" : "en"}
        className={`hidden lg:flex h-full min-h-0 flex-col ${desktopCardClassName} px-6 py-7`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0">
            <h2 className="text-[1.9rem] font-medium tracking-tight text-[var(--color-text)]">
              {t("detailSectionTitle")}
            </h2>
            <div
              className="mt-7 h-px w-full bg-[linear-gradient(to_left,color-mix(in_oklab,#c4a574_74%,transparent),transparent)]"
              aria-hidden
            />
          </div>

          <div className="mt-8 flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 shrink-0 overflow-y-auto overscroll-contain">
              <ListingField label={t("detailLabelClient")} icon={clientIcon}>
                <h2
                  className="m-0 font-semibold text-[inherit] text-base"
                  id={`project-heading-${slug}`}
                >
                  {title}
                </h2>
              </ListingField>
              <ListingField label={t("detailLabelType")} icon={typeIcon}>
                <span className="font-semibold">{cardSubtitle}</span>
              </ListingField>
              <ListingField
                label={t("detailLabelAbout")}
                icon={aboutIcon}
                className="!border-b-0"
              >
                <p className="text-[1rem] font-normal leading-[1.9] text-[var(--color-text)]/88">
                  {paragraphs[0] ?? aboutShort}
                </p>
              </ListingField>
            </div>

            {onOpenGallery ? (
              <div className="mt-9 flex shrink-0 justify-center border-t border-[color-mix(in_oklab,#c4a574_28%,transparent)] pt-6">
                <button
                  type="button"
                  onClick={onOpenGallery}
                  className="inline-flex min-h-[2.5rem] items-center justify-center gap-1.5 rounded-md border border-[color-mix(in_oklab,#c4a574_85%,transparent)] bg-transparent px-5 py-2 text-[0.875rem] font-medium text-[#c4a574] transition-[background-color,border-color,color] hover:bg-[color-mix(in_oklab,#c4a574_10%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c4a574] focus-visible:outline-offset-2"
                >
                  <span>{t("viewPhotoGallery")}</span>
                  <span aria-hidden className="text-sm leading-none">
                    {locale === "he" ? "\u2190" : "\u2192"}
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
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
  const listingDescription = useMemo(() => {
    const first = rawBody.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)[0];
    return first ?? rawBody.trim();
  }, [rawBody]);
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
  const aboutFirstClass =
    "text-base font-normal leading-relaxed text-[#57534e] sm:text-[1.05rem]";
  const aboutRestClass =
    "text-[0.97rem] font-normal leading-relaxed text-[#57534e] sm:text-base";

  const clientIcon = (
    <svg viewBox="0 0 24 24" className="size-5" fill="none">
      <path
        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
  const typeIcon = (
    <svg viewBox="0 0 24 24" className="size-5" fill="none">
      <path
        d="M20 7.5V4H16.5L4 16.5V20h3.5L20 7.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="m13.5 7 3.5 3.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
  const aboutIcon = (
    <svg viewBox="0 0 24 24" className="size-5" fill="none">
      <path d="M4.5 5.5h15v13h-15z" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8 14 8-8M8 18h8" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );

  if (variant === "listing") {
    return (
      <ListingLayout
        slug={slug}
        dir={dir}
        locale={locale}
        title={title}
        cardSubtitle={cardSubtitle}
        aboutShort={testimonialContext || listingDescription}
        paragraphs={paragraphs}
        onOpenGallery={onOpenGallery}
        clientIcon={clientIcon}
        typeIcon={typeIcon}
        aboutIcon={aboutIcon}
        t={t}
      />
    );
  }

  return (
    <div
      dir={dir}
      lang={locale === "he" ? "he" : "en"}
      className="flex min-h-0 flex-col rounded-2xl bg-[#fdfbf7] px-5 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:px-7 sm:py-8"
    >
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <div className="shrink-0">
          <h2 className="text-xl font-bold tracking-tight text-[#1c1917] sm:text-2xl">
            {t("detailSectionTitle")}
          </h2>

          <div
            className="mt-4 flex h-[3px] w-full overflow-hidden rounded-full"
            aria-hidden
          >
            <>
              <div className="h-full w-[min(22%,6rem)] shrink-0 bg-[var(--color-accent)]" />
              <div className="min-h-[3px] flex-1 bg-[#d6d3d1]" />
            </>
          </div>
        </div>

        <div className="mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <DetailRow label={t("detailLabelClient")}>
            <h2 className="m-0 font-bold text-[inherit] text-base" id={`project-heading-${slug}`}>
              {title}
            </h2>
          </DetailRow>
          <DetailRow label={t("detailLabelType")}>
            <span className="font-bold">{cardSubtitle}</span>
          </DetailRow>
          <DetailRow label={t("detailLabelAbout")}>
            <div className="space-y-3">
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
        </div>

        {showTestimonialBlock ? (
          <div
            className="mt-5 shrink-0 border-t border-stone-200/80 pt-5"
          >
            <p className="mb-3 text-sm font-normal text-[#6b6560]">
              {t("testimonialLabel")}
              <span aria-hidden>:</span>
            </p>
            <figure
              className="isolate overflow-hidden rounded-xl border border-white/22 bg-gradient-to-br from-black/92 via-black/84 to-black/76 p-4 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5),0_6px_24px_-8px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.45)] backdrop-blur-sm backdrop-saturate-110 sm:p-5"
            >
              {/* Physical layout: quote mark left, testimonial text right (Hebrew); mirror via dir=ltr row + inner text dir */}
              <div
                className="flex flex-row items-start gap-3 sm:gap-4"
                dir="ltr"
              >
                <span
                  aria-hidden
                  className="shrink-0 select-none font-serif text-[2.1rem] leading-none text-white/85 sm:text-[2.35rem]"
                >
                  {"\u201c"}
                </span>
                <blockquote
                  className="relative z-[1] m-0 min-w-0 flex-1"
                  dir={locale === "he" ? "rtl" : "ltr"}
                >
                  <p
                    className={`text-pretty text-[1rem] font-normal leading-[1.65] antialiased text-white sm:text-[1.05rem] sm:leading-[1.7] ${locale === "he" ? "text-right" : "text-left"}`}
                  >
                    {testimonialLead ? (
                      <span>{testimonialLead}</span>
                    ) : null}
                    {testimonialHighlight ? (
                      <span
                        className={`mt-2.5 block leading-relaxed sm:mt-3 ${locale === "he" ? "text-right" : "text-left"} ${
                          "text-[1rem] font-semibold leading-[1.65] text-white antialiased sm:text-[1.05rem] sm:leading-[1.7]"
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
                  `mt-6 flex flex-row items-center gap-6 border-t border-white/18 pt-5 sm:mt-7 sm:gap-8 ${
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
                      className="size-16 rounded-full object-cover ring-1 ring-white/25"
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
                      className="text-base font-bold text-white"
                    >
                      {title}
                    </p>
                    {testimonialContext ? (
                      <p
                        className="mt-1.5 text-sm text-white/75"
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
