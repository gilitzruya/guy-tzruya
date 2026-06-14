"use client";

import { useEffect } from "react";
import {
  applyAccessibilityPreferences,
  readAccessibilityPreferences,
} from "@/lib/accessibility-preferences";

/** Applies stored accessibility preferences on mount and after hydration. */
export function AccessibilityBootstrap() {
  useEffect(() => {
    applyAccessibilityPreferences(readAccessibilityPreferences());
  }, []);

  return null;
}
