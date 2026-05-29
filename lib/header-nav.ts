/** Shared header navigation link order (Home first, Contact before Language). */
export const HEADER_NAV_LINKS = [
  { href: "/", labelKey: "navHome" },
  { href: "/about", labelKey: "navAbout" },
  { href: "/projects", labelKey: "navProjects" },
] as const;

export const HEADER_SERVICE_LINKS = [
  { href: "/interior-design", labelKey: "navInteriorDesign" },
  { href: "/building-licensing", labelKey: "navBuildingLicensing" },
  { href: "/business-licensing", labelKey: "navBusinessLicensing" },
] as const;

export const HEADER_NAV_LINKS_AFTER_SERVICES = [
  { href: "/simulation", labelKey: "navSimulation" },
  { href: "/contact", labelKey: "navContact" },
] as const;

export type HeaderNavLabelKey =
  | (typeof HEADER_NAV_LINKS)[number]["labelKey"]
  | (typeof HEADER_SERVICE_LINKS)[number]["labelKey"]
  | (typeof HEADER_NAV_LINKS_AFTER_SERVICES)[number]["labelKey"]
  | "navServices"
  | "navLanguage";
