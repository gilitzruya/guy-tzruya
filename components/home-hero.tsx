import { getTranslations } from "next-intl/server";
import { HomeHeroClient } from "@/components/home-hero-client";

export async function HomeHero() {
  const t = await getTranslations("Hero");

  return (
    <HomeHeroClient
      brandLine1={t("brandLine1")}
      brandLine2={t("brandLine2")}
      scrollCtaLabel={t("scrollCta")}
      imageAlt={t("imageAlt")}
    />
  );
}
