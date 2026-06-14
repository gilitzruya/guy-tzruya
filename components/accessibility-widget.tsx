"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  applyAccessibilityPreferences,
  clearAccessibilityPreferences,
  type AccessibilityFontScale,
  type AccessibilityPreferences,
  readAccessibilityPreferences,
  writeAccessibilityPreferences,
} from "@/lib/accessibility-preferences";

function ContrastIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2v16a8 8 0 0 1 0-16z"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M3.9 12a5 5 0 0 1 1.46-3.54l2.83-2.83 1.41 1.41-2.83 2.83A3 3 0 1 0 9 15.17l2.83-2.83 1.41 1.41-2.83 2.83A5 5 0 0 1 3.9 12zm16.2 0a5 5 0 0 1-1.46 3.54l-2.83 2.83-1.41-1.41 2.83-2.83A3 3 0 1 0 15 8.83l-2.83 2.83-1.41-1.41 2.83-2.83A5 5 0 0 1 20.1 12z"
      />
    </svg>
  );
}

function ReadableFontIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M4 4h7v2H6.5v12H4V4zm9 0h7v2h-4.5v12H13V4z"
      />
    </svg>
  );
}

function MotionIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M13 3v7h7V3h-7zM3 13h7v8H3v-8zm10 0h8v8h-8v-8z"
      />
    </svg>
  );
}

function AccessibilityIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <circle cx="12" cy="5.25" r="2.35" fill="currentColor" />
      <g
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        fill="none"
      >
        <line x1="4.75" y1="10" x2="19.25" y2="10" />
        <line x1="12" y1="10" x2="12" y2="14.25" />
        <line x1="12" y1="14.25" x2="7.25" y2="20" />
        <line x1="12" y1="14.25" x2="16.75" y2="20" />
      </g>
    </svg>
  );
}

export function AccessibilityWidget() {
  const t = useTranslations("Accessibility");
  const locale = useLocale();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(() =>
    readAccessibilityPreferences(),
  );

  const persist = useCallback((next: AccessibilityPreferences) => {
    setPrefs(next);
    writeAccessibilityPreferences(next);
    applyAccessibilityPreferences(next);
  }, []);

  useEffect(() => {
    applyAccessibilityPreferences(readAccessibilityPreferences());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();
  }, [open]);

  const setFontScale = (fontScale: AccessibilityFontScale) => {
    persist({ ...prefs, fontScale });
  };

  const togglePref = (key: keyof Omit<AccessibilityPreferences, "fontScale">) => {
    persist({ ...prefs, [key]: !prefs[key] });
  };

  const onReset = () => {
    clearAccessibilityPreferences();
    setPrefs(readAccessibilityPreferences());
  };

  return (
    <div
      className={`a11y-widget ${locale === "he" ? "a11y-widget--rtl" : "a11y-widget--ltr"}`}
    >
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-label={t("menuTitle")}
          className="a11y-widget__panel"
        >
          <p className="a11y-widget__title">{t("menuTitle")}</p>

          <div className="a11y-widget__group">
            <span className="a11y-widget__label">{t("fontSize")}</span>
            <div className="a11y-widget__segmented" role="group" aria-label={t("fontSize")}>
              {(["normal", "large", "xlarge"] as const).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  className={`a11y-widget__segment${prefs.fontScale === scale ? " a11y-widget__segment--active" : ""}`}
                  aria-pressed={prefs.fontScale === scale}
                  onClick={() => setFontScale(scale)}
                >
                  {t(`fontScale.${scale}`)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`a11y-widget__action${prefs.highContrast ? " a11y-widget__action--active" : ""}`}
            aria-pressed={prefs.highContrast}
            onClick={() => togglePref("highContrast")}
          >
            <ContrastIcon />
            <span>{t("highContrast")}</span>
          </button>

          <button
            type="button"
            className={`a11y-widget__action${prefs.highlightLinks ? " a11y-widget__action--active" : ""}`}
            aria-pressed={prefs.highlightLinks}
            onClick={() => togglePref("highlightLinks")}
          >
            <LinkIcon />
            <span>{t("highlightLinks")}</span>
          </button>

          <button
            type="button"
            className={`a11y-widget__action${prefs.readableFont ? " a11y-widget__action--active" : ""}`}
            aria-pressed={prefs.readableFont}
            onClick={() => togglePref("readableFont")}
          >
            <ReadableFontIcon />
            <span>{t("readableFont")}</span>
          </button>

          <button
            type="button"
            className={`a11y-widget__action${prefs.reduceMotion ? " a11y-widget__action--active" : ""}`}
            aria-pressed={prefs.reduceMotion}
            onClick={() => togglePref("reduceMotion")}
          >
            <MotionIcon />
            <span>{t("reduceMotion")}</span>
          </button>

          <button type="button" className="a11y-widget__reset" onClick={onReset}>
            {t("reset")}
          </button>
        </div>
      ) : null}

      <button
        ref={toggleRef}
        type="button"
        className="a11y-widget__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpen((prev) => !prev)}
      >
        <AccessibilityIcon />
      </button>
    </div>
  );
}
