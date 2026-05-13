"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";

const LOCALES = ["he", "en"] as const;

function localeCode(locale: string) {
  return locale.toUpperCase();
}

export function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const others = LOCALES.filter((l) => l !== active);

  return (
    <div ref={wrapRef} className="relative z-[70]">
      <button
        type="button"
        className="flex min-h-[44px] cursor-pointer items-center gap-1.5 px-1 py-2 text-sm font-semibold tracking-wide text-[var(--color-text)] transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={t("langSwitcherNavLabel")}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{localeCode(active)}</span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-current transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("langSwitcherNavLabel")}
          className="absolute end-0 top-full z-[71] mt-0.5 flex min-w-[3.25rem] flex-col gap-1.5 pt-1 text-sm"
        >
          {others.map((locale) => (
            <li key={locale} role="presentation">
              <Link
                role="option"
                href={pathname}
                locale={locale}
                hrefLang={locale === "he" ? "he-IL" : "en"}
                aria-label={
                  locale === "he"
                    ? t("langSwitcherAriaToHebrew")
                    : t("langSwitcherAriaToEnglish")
                }
                aria-selected={false}
                className="block py-0.5 font-medium text-[color-mix(in_oklab,var(--color-text)_52%,transparent)] transition-colors hover:text-[var(--color-text)]"
                onClick={() => setOpen(false)}
              >
                {localeCode(locale)}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
