import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site-url";
import { HtmlAttributes } from "@/components/html-attributes";
import { SceneProvider } from "@/components/scene-provider";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Layout" });
  const base = getSiteUrl();
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l === "he" ? "he-IL" : "en"] = `${base}/${l}`;
  }

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(base),
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      siteName: "Guy Tzruya",
      locale: locale === "he" ? "he_IL" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRtl = locale === "he";
  const fontStack = isRtl
    ? "var(--font-assistant), system-ui, sans-serif"
    : "var(--font-plus-jakarta), system-ui, sans-serif";

  return (
    <NextIntlClientProvider messages={messages}>
      <SceneProvider>
        <HtmlAttributes locale={locale} />
        <div className="flex min-h-full flex-col" style={{ fontFamily: fontStack }}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </SceneProvider>
    </NextIntlClientProvider>
  );
}
