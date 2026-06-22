"use client";

import Image from "next/image";
import { Instrument_Serif, DM_Mono } from "next/font/google";
import { useLocale, useTranslations } from "next-intl";
import { useId, type CSSProperties } from "react";
import { BuildingLicensingFaqSection } from "@/components/building-licensing-faq-section";
import { BuildingLicensingProcessSection } from "@/components/building-licensing-process-section";
import { useScene } from "@/components/scene-provider";
import { TypewriterText } from "@/components/typewriter-text";
import { interiorDesignPageBackgroundUrl } from "@/lib/interior-page-background";
import type { LicensingPageConfig } from "@/lib/licensing-page-config";

const blDisplay = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bl-display",
  display: "swap",
});

const blMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-bl-mono",
  display: "swap",
});


export function LicensingPage({ config }: { config: LicensingPageConfig }) {
  const t = useTranslations(config.namespace);
  const locale = useLocale();
  const { scene } = useScene();
  const heroHeadingId = useId();
  const heroImageSrc = config.heroImageUrl(scene);

  const heroTitleFx =
    scene === "night" || scene === "day"
      ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.4px_rgb(0_0_0/_0.55)] [text-shadow:0_0_22px_rgb(0_0_0/_0.88),0_2px_12px_rgb(0_0_0/_0.6),0_0_6px_rgb(255_255_255/_0.12)]"
      : "";
  const heroSubtitleFx =
    scene === "night" || scene === "day"
      ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.55px_rgb(0_0_0/_0.65)] [text-shadow:0_0_18px_rgb(0_0_0/_0.92),0_1px_8px_rgb(0_0_0/_0.7),0_0_4px_rgb(255_255_255/_0.1)]"
      : "";

  const subtitleLang = locale === "he" ? "he" : "en";
  const pageStyle = {
    "--bl-header-bg-url": `url("${interiorDesignPageBackgroundUrl(scene)}")`,
  } as CSSProperties;

  return (
    <div
      lang={locale}
      className={`building-licensing-page ${blDisplay.variable} ${blMono.variable} ${scene === "day" ? "building-licensing-page--day" : "building-licensing-page--night"}`}
      data-scene={scene}
      style={pageStyle}
    >
      <section
        aria-labelledby={heroHeadingId}
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={heroImageSrc}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className={`interior-hero-image${scene === "day" ? " interior-hero-image--day" : ""}`}
            key={heroImageSrc}
          />
          {scene === "day" ? <div className="absolute inset-0 bg-black/40" /> : null}
          <div
            className={`absolute inset-0 ${
              scene === "night"
                ? "bg-gradient-to-b from-black/50 via-black/35 to-[color-mix(in_oklab,var(--color-bg)_72%,transparent)]"
                : "bg-gradient-to-b from-black/55 via-black/40 to-black/30"
            }`}
          />
        </div>
        <div
          className={`relative z-10 mx-auto flex min-h-[min(72svh,44rem)] w-full max-w-6xl flex-col justify-start px-4 pb-6 pt-40 sm:px-6 sm:pt-44 lg:pb-8 lg:pt-48 ${
            scene === "day" ? "text-white" : "text-[var(--color-text)]"
          }`}
        >
          <div
            dir={locale === "he" ? "rtl" : "ltr"}
            className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
          >
            <h1 id={heroHeadingId}>
              <TypewriterText
                text={t("heroTitle")}
                charDelayMs={165}
                className={`licensing-hero-title block leading-[0.92] text-[clamp(2rem,7.8vw,5rem)] ${locale === "en" ? "english-display-title" : "[font-family:var(--font-interior-display),ui-serif,Georgia,serif] font-normal"} ${heroTitleFx}`}
              />
            </h1>
          </div>
          <p
            lang={subtitleLang}
            dir={locale === "he" ? "rtl" : "ltr"}
            className={`mx-auto mt-10 max-w-2xl text-pretty text-center text-base leading-8 opacity-92 sm:mt-12 sm:text-lg lg:mt-14 ${locale === "en" ? "english-display-subtitle english-display-subtitle--long" : ""} ${heroSubtitleFx}`}
          >
            {t("heroSubtitle")}
          </p>
          <div
            className="mx-auto mt-12 flex flex-col items-center sm:mt-14 lg:mt-auto lg:pt-10"
            aria-hidden
          >
            <svg
              width="18"
              height="28"
              viewBox="0 0 18 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="scroll-arrow-hint opacity-80"
            >
              <path
                d="M9 1v22M9 23l-6-6M9 23l6-6"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      <BuildingLicensingProcessSection namespace={config.namespace} />
      <BuildingLicensingFaqSection namespace={config.namespace} />
    </div>
  );
}
