import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SceneToggle } from "@/components/scene-toggle";

export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color-mix(in_oklab,var(--color-text)_12%,transparent)] bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
        >
          {t("brand")}
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <SceneToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
