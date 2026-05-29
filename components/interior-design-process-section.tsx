"use client";

import { Instrument_Serif, DM_Mono } from "next/font/google";
import { useLocale } from "next-intl";
import { BuildingLicensingFaqSection } from "@/components/building-licensing-faq-section";
import { BuildingLicensingProcessSection } from "@/components/building-licensing-process-section";
import {
  INTERIOR_PROCESS_CTA_BUTTON,
  INTERIOR_PROCESS_CTA_LEAD,
  INTERIOR_PROCESS_EYEBROW,
  INTERIOR_PROCESS_STEPS,
  INTERIOR_PROCESS_SUBTITLE,
  INTERIOR_PROCESS_TITLE,
} from "@/components/interior-design-content";
import { useScene } from "@/components/scene-provider";
import type { LicensingProcessContent } from "@/lib/licensing-page-config";

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

const INTERIOR_PROCESS_CONTENT: LicensingProcessContent = {
  eyebrow: INTERIOR_PROCESS_EYEBROW,
  title: INTERIOR_PROCESS_TITLE,
  subtitle: INTERIOR_PROCESS_SUBTITLE,
  ctaLead: INTERIOR_PROCESS_CTA_LEAD,
  ctaButton: INTERIOR_PROCESS_CTA_BUTTON,
  steps: INTERIOR_PROCESS_STEPS,
};

export function InteriorDesignProcessSection() {
  const locale = useLocale();
  const { scene } = useScene();

  return (
    <div
      lang={locale}
      className={`building-licensing-page ${blDisplay.variable} ${blMono.variable} ${scene === "day" ? "building-licensing-page--day" : "building-licensing-page--night"}`}
      data-scene={scene}
    >
      <BuildingLicensingProcessSection
        namespace="InteriorDesign"
        content={INTERIOR_PROCESS_CONTENT}
        mailtoSubject="Interior design inquiry"
      />
      <BuildingLicensingFaqSection namespace="InteriorDesign" />
    </div>
  );
}
