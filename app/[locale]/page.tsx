import { HomeHero } from "@/components/home-hero";
import { HomeJsonLd } from "@/components/home-json-ld";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeHero />
    </>
  );
}
