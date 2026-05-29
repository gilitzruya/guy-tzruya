"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import {
  PROJECT_SLUGS,
  projectClientImageSrc,
  type ProjectSlug,
} from "@/lib/projects";

function TestimonialCard({ slug }: { slug: ProjectSlug }) {
  const tProjects = useTranslations("Projects");
  const tAbout = useTranslations("About");
  const locale = useLocale();
  const testimonialLead = tProjects(`items.${slug}.testimonialLead`).trim();
  const testimonialHighlight = tProjects(
    `items.${slug}.testimonialHighlight`,
  ).trim();
  const testimonialContext = tProjects(`items.${slug}.testimonialContext`).trim();
  const clientSrc = projectClientImageSrc(slug);
  const title = tProjects(`items.${slug}.title`);

  const initials = title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure className="about-testimonial__glass h-full">
      <div className="flex flex-row items-start gap-3 sm:gap-4" dir="ltr">
        <span
          aria-hidden
          className="shrink-0 select-none font-serif text-[2rem] leading-none text-[var(--about-gold)]"
        >
          {"\u201c"}
        </span>
        <div className="min-w-0 flex-1" dir={locale === "he" ? "rtl" : "ltr"}>
          <blockquote className="m-0">
            <p className="text-pretty text-[0.95rem] leading-[1.65] text-[var(--color-text)] sm:text-[1rem]">
              {testimonialLead ? <span>{testimonialLead}</span> : null}
              {testimonialHighlight ? (
                <span className="mt-2 block font-semibold leading-relaxed">
                  {testimonialHighlight}
                </span>
              ) : null}
            </p>
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            {clientSrc ? (
              <Image
                src={clientSrc}
                alt={tProjects("clientPhotoAlt")}
                width={48}
                height={48}
                className="about-testimonial__avatar"
                unoptimized
              />
            ) : (
              <span
                className="about-testimonial__avatar-fallback"
                aria-hidden
              >
                {initials}
              </span>
            )}
            <div className="min-w-0 text-start">
              <p className="m-0 text-sm font-semibold text-[var(--color-text)]">
                {title}
              </p>
              {testimonialContext ? (
                <p className="m-0 mt-0.5 text-xs text-[var(--about-muted)]">
                  {testimonialContext}
                </p>
              ) : null}
            </div>
          </figcaption>
        </div>
      </div>
      <span className="sr-only">{tAbout("testimonialsTitle")}</span>
    </figure>
  );
}

export function AboutTestimonialsSection() {
  const t = useTranslations("About");
  const locale = useLocale();
  const titleId = useId();
  const isRtl = locale === "he";

  return (
    <section
      aria-labelledby={titleId}
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <header className="about-section-header">
        <p className="about-eyebrow">{t("testimonialsEyebrow")}</p>
        <h2 id={titleId} className="about-display">
          {t("testimonialsTitle")}
        </h2>
        <p className="about-lead">{t("testimonialsLead")}</p>
      </header>

      <div className="about-testimonials__grid mt-12">
        {PROJECT_SLUGS.map((slug) => (
          <TestimonialCard key={slug} slug={slug} />
        ))}
      </div>
    </section>
  );
}
