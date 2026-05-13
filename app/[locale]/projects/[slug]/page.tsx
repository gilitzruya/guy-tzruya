import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectDetailPage } from "@/components/project-detail-page";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";
import { isProjectSlug, PROJECT_SLUGS } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(routing.locales as readonly string[]).includes(locale) || !isProjectSlug(slug)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Projects" });
  const base = getSiteUrl();
  const title = t(`items.${slug}.title`);
  const description = t(`items.${slug}.summary`);

  return {
    title,
    description,
    metadataBase: new URL(base),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l === "he" ? "he-IL" : "en",
          `${base}/${l}/projects/${slug}`,
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/projects/${slug}`,
      siteName: "Guy Tzruya",
      locale: locale === "he" ? "he_IL" : "en_US",
      type: "article",
    },
  };
}

export default async function ProjectDetailRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  if (!isProjectSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);
  return <ProjectDetailPage slug={slug} />;
}
