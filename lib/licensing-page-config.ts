import {
  BUILDING_LICENSING_PROCESS_CTA_BUTTON,
  BUILDING_LICENSING_PROCESS_CTA_LEAD,
  BUILDING_LICENSING_PROCESS_EYEBROW,
  BUILDING_LICENSING_PROCESS_STEPS,
  BUILDING_LICENSING_PROCESS_SUBTITLE,
  BUILDING_LICENSING_PROCESS_TITLE,
  type BuildingLicensingProcessStep,
} from "@/components/building-licensing-content";
import {
  BUSINESS_LICENSING_PROCESS_CTA_BUTTON,
  BUSINESS_LICENSING_PROCESS_CTA_LEAD,
  BUSINESS_LICENSING_PROCESS_EYEBROW,
  BUSINESS_LICENSING_PROCESS_STEPS,
  BUSINESS_LICENSING_PROCESS_SUBTITLE,
  BUSINESS_LICENSING_PROCESS_TITLE,
} from "@/components/business-licensing-content";
import type { Scene } from "@/lib/scene-storage";

export type LicensingNamespace = "BuildingLicensing" | "BusinessLicensing";
export type PageTranslationNamespace = LicensingNamespace | "InteriorDesign";
export type LicensingPageVariant = "building" | "business";

export type LicensingProcessContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLead: string;
  ctaButton: string;
  steps: BuildingLicensingProcessStep[];
};

export type LicensingPageConfig = {
  variant: LicensingPageVariant;
  namespace: LicensingNamespace;
  process: LicensingProcessContent;
  processMailSubject: string;
  ctaMailSubject: string;
  heroImageUrl: (scene: Scene) => string;
};

const BUILDING_PROCESS: LicensingProcessContent = {
  eyebrow: BUILDING_LICENSING_PROCESS_EYEBROW,
  title: BUILDING_LICENSING_PROCESS_TITLE,
  subtitle: BUILDING_LICENSING_PROCESS_SUBTITLE,
  ctaLead: BUILDING_LICENSING_PROCESS_CTA_LEAD,
  ctaButton: BUILDING_LICENSING_PROCESS_CTA_BUTTON,
  steps: BUILDING_LICENSING_PROCESS_STEPS,
};

const BUSINESS_PROCESS: LicensingProcessContent = {
  eyebrow: BUSINESS_LICENSING_PROCESS_EYEBROW,
  title: BUSINESS_LICENSING_PROCESS_TITLE,
  subtitle: BUSINESS_LICENSING_PROCESS_SUBTITLE,
  ctaLead: BUSINESS_LICENSING_PROCESS_CTA_LEAD,
  ctaButton: BUSINESS_LICENSING_PROCESS_CTA_BUTTON,
  steps: BUSINESS_LICENSING_PROCESS_STEPS,
};

const CONFIG_BY_VARIANT: Record<LicensingPageVariant, LicensingPageConfig> = {
  building: {
    variant: "building",
    namespace: "BuildingLicensing",
    process: BUILDING_PROCESS,
    processMailSubject: "Building planning inquiry",
    ctaMailSubject: "Building planning inquiry",
    heroImageUrl: (scene) => `/building-licensing/hero/hero-${scene}.png`,
  },
  business: {
    variant: "business",
    namespace: "BusinessLicensing",
    process: BUSINESS_PROCESS,
    processMailSubject: "Business licensing inquiry",
    ctaMailSubject: "Business licensing inquiry",
    heroImageUrl: (scene) => `/business-licensing/hero/hero-${scene}.png`,
  },
};

export function getLicensingPageConfig(
  variant: LicensingPageVariant,
): LicensingPageConfig {
  return CONFIG_BY_VARIANT[variant];
}
