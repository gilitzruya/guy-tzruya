import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectsPage } from "@/components/projects-page";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Projects" });
  const base = getSiteUrl();
  const title = t("metaListingTitle");
  const description = t("metaListingDescription");

  return {
    title,
    description,
    metadataBase: new URL(base),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l === "he" ? "he-IL" : "en",
          `${base}/${l}/projects`,
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/projects`,
      siteName: "Guy Tzruya",
      locale: locale === "he" ? "he_IL" : "en_US",
      type: "website",
    },
  };
}

export default async function ProjectsRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsPage />;
}
