import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutPage } from "@/components/about-page";
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

  const t = await getTranslations({ locale, namespace: "About" });
  const base = getSiteUrl();
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    metadataBase: new URL(base),
    alternates: {
      canonical: `/${locale}/about`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l === "he" ? "he-IL" : "en",
          `${base}/${l}/about`,
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/about`,
      siteName: "Guy Tzruya",
      locale: locale === "he" ? "he_IL" : "en_US",
      type: "website",
    },
  };
}

export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPage />;
}
