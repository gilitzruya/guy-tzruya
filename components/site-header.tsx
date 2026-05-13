import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { SceneToggle } from "@/components/scene-toggle";

export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-visible bg-[var(--color-bg)]">
      <div
        dir="ltr"
        className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-2 overflow-visible px-4 sm:gap-3 sm:px-6"
      >
        <div className="flex min-w-0 items-center justify-self-start">
          <BrandLogo label={t("brand")} />
        </div>

        <div className="flex justify-center justify-self-center px-1">
          <SceneToggle />
        </div>

        <div className="flex min-w-0 items-center justify-end justify-self-end gap-3 md:gap-7">
          <nav
            className="hidden items-center gap-5 md:flex md:gap-7"
            aria-label={t("mainNavLabel")}
          >
            <Link
              href="/"
              className="text-sm font-medium text-[var(--color-text)]/90 transition-colors hover:text-[var(--color-accent)]"
            >
              {t("navHome")}
            </Link>
            <Link
              href="/interior-design"
              className="text-sm font-medium text-[var(--color-text)]/90 transition-colors hover:text-[var(--color-accent)]"
            >
              {t("navInteriorDesign")}
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-[var(--color-text)]/90 transition-colors hover:text-[var(--color-accent)]"
            >
              {t("navProjects")}
            </Link>
          </nav>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}
