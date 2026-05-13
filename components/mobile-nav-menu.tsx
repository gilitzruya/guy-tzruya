"use client";

import {
  startTransition,
  useEffect,
  useId,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

export function MobileNavMenu() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    startTransition(() => setOpen(false));
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-[var(--color-text)] transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sr-only">
          {open ? t("mobileNavClose") : t("mobileNavOpen")}
        </span>
        {!open ? (
          <svg
            className="h-6 w-6 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.875"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.875"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        )}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            type="button"
            aria-label={t("mobileNavClose")}
            className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-text)_38%,transparent)] backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <aside
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={t("mainNavLabel")}
            className="absolute end-0 top-0 flex h-[100svh] w-[min(20rem,calc(100vw-3rem))] flex-col gap-8 border-[color-mix(in_oklab,var(--color-text)_14%,transparent)] border-s bg-[var(--color-bg)] px-6 py-8 pb-10 shadow-xl"
          >
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className="rounded-lg py-3.5 ps-2 text-lg font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                onClick={() => setOpen(false)}
              >
                {t("navHome")}
              </Link>
              <Link
                href="/interior-design"
                className="rounded-lg py-3.5 ps-2 text-lg font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                onClick={() => setOpen(false)}
              >
                {t("navInteriorDesign")}
              </Link>
              <Link
                href="/projects"
                className="rounded-lg py-3.5 ps-2 text-lg font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                onClick={() => setOpen(false)}
              >
                {t("navProjects")}
              </Link>
            </nav>

            <div className="mt-auto flex flex-col gap-3 border-[color-mix(in_oklab,var(--color-text)_12%,transparent)] border-t pt-6">
              <p className="ps-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]/55">
                {t("langSwitcherNavLabel")}
              </p>
              <div className="ps-1">
                <LanguageSwitcher />
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
