"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";

const locales = ["he", "en"] as const;

export function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  return (
    <nav
      className="flex items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--color-text)_22%,transparent)] px-1 py-1"
      aria-label="Language"
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            active === locale
              ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
              : "text-[var(--color-text)]/80 hover:text-[var(--color-text)]"
          }`}
          hrefLang={locale === "he" ? "he-IL" : "en"}
        >
          {locale === "he" ? t("langHe") : t("langEn")}
        </Link>
      ))}
    </nav>
  );
}
