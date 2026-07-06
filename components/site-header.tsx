import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { AccessibilityHeaderToggle } from "@/components/accessibility-widget";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { ServicesNav } from "@/components/services-nav";
import { SiteHeaderFrame } from "@/components/site-header-frame";
import {
  HEADER_NAV_LINKS,
  HEADER_NAV_LINKS_AFTER_SERVICES,
} from "@/lib/header-nav";

const navLinkClass =
  "text-sm font-medium text-[var(--color-text)]/90 transition-colors hover:text-[var(--color-accent)]";

export async function SiteHeader() {
  const t = await getTranslations("Header");
  const locale = await getLocale();
  const navDir = locale === "he" ? "rtl" : "ltr";

  return (
    <SiteHeaderFrame>
      <div
        className="flex h-16 w-full items-center justify-between px-4 sm:px-6 md:hidden"
        dir="ltr"
      >
        <div className="flex items-center justify-start">
          <BrandLogo label={t("brand")} />
        </div>
        <div className="flex items-center justify-end">
          <MobileNavMenu />
        </div>
      </div>

      <div className="relative hidden h-16 w-full items-center gap-2 overflow-visible px-4 sm:gap-3 sm:px-6 md:flex">
        <div
          className="absolute left-4 top-1/2 z-[1] flex -translate-y-1/2 shrink-0 items-center sm:left-6"
          dir="ltr"
        >
          <BrandLogo label={t("brand")} />
        </div>

        <div className="absolute right-4 top-1/2 z-[1] flex -translate-y-1/2 items-center sm:right-6">
          <AccessibilityHeaderToggle />
        </div>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex md:gap-7"
          aria-label={t("mainNavLabel")}
          dir={navDir}
        >
          {HEADER_NAV_LINKS.map(({ href, labelKey }) => (
            <Link key={href} href={href} className={navLinkClass}>
              {t(labelKey)}
            </Link>
          ))}
          <ServicesNav />
          {HEADER_NAV_LINKS_AFTER_SERVICES.map(({ href, labelKey }) => (
            <Link key={href} href={href} className={navLinkClass}>
              {t(labelKey)}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>
      </div>
    </SiteHeaderFrame>
  );
}
