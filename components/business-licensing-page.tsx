"use client";

import { LicensingPage } from "@/components/licensing-page";
import { getLicensingPageConfig } from "@/lib/licensing-page-config";

export function BusinessLicensingPage() {
  return <LicensingPage config={getLicensingPageConfig("business")} />;
}
