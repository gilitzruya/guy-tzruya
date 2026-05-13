"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useScene } from "@/components/scene-provider";
import { ProjectBeforeAfterSlider } from "@/components/project-before-after-slider";
import { ProjectDetailsSheet } from "@/components/project-details-sheet";
import type { ProjectSlug } from "@/lib/projects";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";

export function ProjectDetailPage({ slug }: { slug: ProjectSlug }) {
  const t = useTranslations("Projects");
  const { scene } = useScene();
  const galleryHeadingId = useId();

  const pageBgStyle = interiorDesignPageBackgroundStyle(scene);

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={pageBgStyle}
        aria-hidden
      />

      <article className="mx-auto w-full max-w-6xl px-4 pt-28 sm:px-6 sm:pt-32">
        <p className="mb-6">
          <Link
            href="/projects"
            className="text-sm font-medium text-[var(--color-accent)] underline-offset-4 transition-colors hover:underline"
          >
            {t("backToProjects")}
          </Link>
        </p>

        <ProjectDetailsSheet slug={slug} variant="detail" />
      </article>

      <section
        aria-labelledby={galleryHeadingId}
        className="mt-10 w-full sm:mt-12"
      >
        <h2 id={galleryHeadingId} className="sr-only">
          {t("beforeAfterHeading")}
        </h2>
        <ProjectBeforeAfterSlider slug={slug} title={t(`items.${slug}.title`)} priority />
      </section>
    </div>
  );
}
