export type AccessibilityFontScale = "normal" | "large" | "xlarge";

export type AccessibilityPreferences = {
  fontScale: AccessibilityFontScale;
  highContrast: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
};

export const A11Y_STORAGE_KEY = "guy-tzruya-a11y-preferences";

export const DEFAULT_A11Y_PREFERENCES: AccessibilityPreferences = {
  fontScale: "normal",
  highContrast: false,
  highlightLinks: false,
  readableFont: false,
  reduceMotion: false,
};

const FONT_SCALE_VALUES: Record<AccessibilityFontScale, string> = {
  normal: "1",
  large: "1.125",
  xlarge: "1.25",
};

export function readAccessibilityPreferences(): AccessibilityPreferences {
  if (typeof window === "undefined") return DEFAULT_A11Y_PREFERENCES;
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return DEFAULT_A11Y_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<AccessibilityPreferences>;
    return {
      fontScale:
        parsed.fontScale === "large" || parsed.fontScale === "xlarge"
          ? parsed.fontScale
          : "normal",
      highContrast: Boolean(parsed.highContrast),
      highlightLinks: Boolean(parsed.highlightLinks),
      readableFont: Boolean(parsed.readableFont),
      reduceMotion: Boolean(parsed.reduceMotion),
    };
  } catch {
    return DEFAULT_A11Y_PREFERENCES;
  }
}

export function writeAccessibilityPreferences(prefs: AccessibilityPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore quota errors */
  }
}

export function applyAccessibilityPreferences(prefs: AccessibilityPreferences): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--a11y-font-scale", FONT_SCALE_VALUES[prefs.fontScale]);
  root.dataset.a11yContrast = prefs.highContrast ? "high" : "normal";
  root.dataset.a11yLinks = prefs.highlightLinks ? "highlight" : "normal";
  root.dataset.a11yReadableFont = prefs.readableFont ? "true" : "false";
  root.dataset.a11yReduceMotion = prefs.reduceMotion ? "true" : "false";
}

export function clearAccessibilityPreferences(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(A11Y_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  applyAccessibilityPreferences(DEFAULT_A11Y_PREFERENCES);
}
