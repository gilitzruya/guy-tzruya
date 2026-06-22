"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { NavChevron } from "@/components/nav-chevron";

const LOCALES = [
  { locale: "he" as const, labelKey: "langHe" },
  { locale: "en" as const, labelKey: "langEn" },
] as const;

type LanguageSwitcherProps = {
  /** Compact nav item (desktop) vs stacked mobile panel */
  variant?: "nav" | "mobile";
  onNavigate?: () => void;
};

export function LanguageSwitcher({
  variant = "nav",
  onNavigate,
}: LanguageSwitcherProps) {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const targetLocale = active === "he" ? "en" : "he";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (variant === "mobile") {
    return (
      <div className="rounded-lg">
        <Link
          href={pathname}
          locale={targetLocale}
          hrefLang={targetLocale === "he" ? "he-IL" : "en"}
          className="flex w-full items-center justify-between rounded-lg py-3.5 ps-2 pe-2 text-lg font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
          aria-label={
            targetLocale === "he"
              ? t("langSwitcherAriaToHebrew")
              : t("langSwitcherAriaToEnglish")
          }
          onClick={onNavigate}
        >
          <span>{t("navLanguage")}</span>
          <span className="text-sm text-[var(--color-accent)]">
            {t(targetLocale === "he" ? "langHe" : "langEn")}
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${
          open ? "text-[var(--color-accent)]" : "text-[var(--color-text)]/90"
        }`}
        onClick={() => setOpen((prev) => !prev)}
        onFocus={() => setOpen(true)}
      >
        {t("navLanguage")}
        <NavChevron open={open} />
      </button>
      <div
        id={panelId}
        role="menu"
        aria-label={t("navLanguage")}
        className={`absolute end-0 top-full z-[110] mt-0 min-w-[9rem] rounded-xl border border-[color-mix(in_oklab,var(--color-text)_14%,transparent)] bg-[var(--color-bg)] p-2 shadow-xl transition-[opacity,transform] ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {LOCALES.map(({ locale, labelKey }) => {
          const isActive = locale === active;
          return (
            <Link
              key={locale}
              href={pathname}
              locale={locale}
              hrefLang={locale === "he" ? "he-IL" : "en"}
              role="menuitem"
              aria-label={
                locale === "he"
                  ? t("langSwitcherAriaToHebrew")
                  : t("langSwitcherAriaToEnglish")
              }
              aria-current={isActive ? "true" : undefined}
              className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text)]/90 hover:text-[var(--color-accent)]"
              }`}
              onClick={() => setOpen(false)}
            >
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
