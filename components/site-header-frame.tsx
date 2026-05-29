"use client";

import { useMemo } from "react";
import { useScene } from "@/components/scene-provider";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";

export function SiteHeaderFrame({ children }: { children: React.ReactNode }) {
  const { scene } = useScene();
  const backgroundStyle = useMemo(
    () => interiorDesignPageBackgroundStyle(scene),
    [scene],
  );

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 overflow-visible bg-[var(--color-bg)]"
      style={backgroundStyle}
    >
      {children}
    </header>
  );
}
