"use client";

import { Instrument_Serif, DM_Mono } from "next/font/google";
import { useLocale } from "next-intl";
import { BuildingLicensingFaqSection } from "@/components/building-licensing-faq-section";
import { BuildingLicensingProcessSection } from "@/components/building-licensing-process-section";
import { useScene } from "@/components/scene-provider";

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

export function InteriorDesignProcessSection() {
  const locale = useLocale();
  const { scene } = useScene();

  return (
    <div
      lang={locale}
      className={`building-licensing-page ${blDisplay.variable} ${blMono.variable} ${scene === "day" ? "building-licensing-page--day" : "building-licensing-page--night"}`}
      data-scene={scene}
    >
      <BuildingLicensingProcessSection namespace="InteriorDesign" />
      <BuildingLicensingFaqSection namespace="InteriorDesign" />
    </div>
  );
}
