"use client";

import { useTranslations } from "next-intl";
import type { Scene } from "@/lib/scene-storage";
import { useScene } from "@/components/scene-provider";

export function SceneToggle() {
  const { scene, setScene } = useScene();
  const t = useTranslations("Header");

  return (
    <nav
      className="flex items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--color-text)_22%,transparent)] px-1 py-1"
      aria-label={t("sceneNavLabel")}
    >
      {(["day", "night"] as const satisfies readonly Scene[]).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => setScene(key)}
          aria-pressed={scene === key}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            scene === key
              ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
              : "text-[var(--color-text)]/80 hover:text-[var(--color-text)]"
          }`}
        >
          {key === "day" ? t("sceneDay") : t("sceneNight")}
        </button>
      ))}
    </nav>
  );
}
