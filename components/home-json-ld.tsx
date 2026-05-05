import { getTranslations } from "next-intl/server";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  locale: string;
};

export async function HomeJsonLd({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "Layout" });
  const base = getSiteUrl();

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Guy Tzruya",
    alternateName: "גיא צרויה",
    description: t("description"),
    url: `${base}/${locale}`,
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
    availableLanguage: ["Hebrew", "English"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
