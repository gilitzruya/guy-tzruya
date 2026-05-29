"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { NavChevron } from "@/components/nav-chevron";
import { HEADER_SERVICE_LINKS } from "@/lib/header-nav";

export function ServicesNav() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const isServicesPath = HEADER_SERVICE_LINKS.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

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
          isServicesPath || open ? "text-[var(--color-accent)]" : "text-[var(--color-text)]/90"
        }`}
        onClick={() => setOpen((prev) => !prev)}
        onFocus={() => setOpen(true)}
      >
        {t("navServices")}
        <NavChevron open={open} />
      </button>
      <div
        id={panelId}
        role="menu"
        aria-label={t("navServices")}
        className={`absolute end-0 top-full z-[110] mt-0 min-w-[16rem] rounded-xl border border-[color-mix(in_oklab,var(--color-text)_14%,transparent)] bg-[var(--color-bg)] p-2 shadow-xl transition-[opacity,transform] ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {HEADER_SERVICE_LINKS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text)]/90 hover:text-[var(--color-accent)]"
              }`}
              onClick={() => setOpen(false)}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
