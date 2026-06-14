import type { LicensingProcessContent } from "@/lib/licensing-page-config";

export const PROCESS_STEP_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

export function buildProcessContentFromTranslations(
  t: (key: string) => string,
): LicensingProcessContent {
  return {
    eyebrow: t("process.eyebrow"),
    title: t("process.title"),
    subtitle: t("process.subtitle"),
    ctaLead: t("process.ctaLead"),
    ctaButton: t("process.ctaButton"),
    steps: PROCESS_STEP_KEYS.map((key) => ({
      title: t(`process.steps.${key}.title`),
      description: t(`process.steps.${key}.description`),
    })),
  };
}
