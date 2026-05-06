import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SceneToggle } from "@/components/scene-toggle";

export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div
        dir="ltr"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <BrandLogo label={t("brand")} />
        <nav className="hidden items-center gap-7 md:flex" aria-label={t("mainNavLabel")}>
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
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <SceneToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
