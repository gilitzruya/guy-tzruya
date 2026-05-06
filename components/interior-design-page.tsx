"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useState } from "react";
import { useScene } from "@/components/scene-provider";
import {
  INTERIOR_PROCESS_STEPS,
  INTERIOR_PROCESS_TITLE,
  INTERIOR_STYLES,
  INTERIOR_STYLES_TITLE,
} from "@/components/interior-design-content";

const DESKTOP_BREAKPOINT = 768;
type CardScene = "day" | "night";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return isDesktop;
}

function buildStyleImageSrc(slug: string, isDesktop: boolean, scene: "day" | "night") {
  const device = isDesktop ? "desktop" : "mobile";
  return `/interior-design/styles/${slug}/${device}-${scene}.webp`;
}

export function InteriorDesignPage() {
  const { scene } = useScene();
  const isDesktop = useIsDesktop();
  const isDesktopResolved = isDesktop ?? true;
  const pageBackgroundSrc = `/backgrounds/pages/interior-design-${scene}.webp`;
  const [cardSceneBySlug, setCardSceneBySlug] = useState<Record<string, CardScene>>({});

  const cards = useMemo(
    () =>
      INTERIOR_STYLES.map((style) => ({
        ...style,
        cardScene: cardSceneBySlug[style.slug] ?? scene,
        src: buildStyleImageSrc(
          style.slug,
          isDesktopResolved,
          cardSceneBySlug[style.slug] ?? scene,
        ),
      })),
    [isDesktopResolved, scene, cardSceneBySlug],
  );

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${pageBackgroundSrc})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          backgroundPosition: "top left",
        }}
        aria-hidden
      />
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-28 text-right sm:px-6 sm:pt-32">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
          שירות עיצוב פנים
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text)]/85 sm:text-lg">
          גלריית סגנונות מובילים ותהליך עבודה מדויק משלב האפיון ועד למסירה.
        </p>
        <h2 className="mt-6 text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
          {INTERIOR_STYLES_TITLE}
        </h2>
      </section>

      <section className="w-full px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {cards.map((card) => (
            <article key={card.slug} className="overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) calc((100vw - 2rem - 2rem - 1rem) / 2), 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute start-3 top-3 z-10 sm:start-4 sm:top-4">
                  <label
                    className="inline-flex h-[30px] w-[140px] cursor-pointer items-center rounded-full border border-black/10 bg-white/90 px-1 text-xs font-medium text-[#222] shadow-sm backdrop-blur-sm"
                    aria-label={`החלפת מצב יום/לילה עבור ${card.title}`}
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={card.cardScene === "night"}
                      onChange={(e) => {
                        const nextScene: CardScene = e.target.checked ? "night" : "day";
                        setCardSceneBySlug((prev) => ({ ...prev, [card.slug]: nextScene }));
                      }}
                    />
                    <svg
                      viewBox="0 0 16 16"
                      width={23}
                      className="me-1 shrink-0 text-indigo-900"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                    </svg>
                    <span className="relative block h-[26px] flex-1 overflow-hidden rounded-full bg-[#e0e0e0] text-[#424242] peer-checked:bg-[#151515] peer-checked:text-white">
                      <span
                        className="absolute inset-y-0 left-[10px] z-10 flex items-center text-[11px]"
                      >
                        יום
                      </span>
                      <span
                        className="absolute inset-y-0 right-[10px] z-10 flex items-center text-[11px]"
                      >
                        לילה
                      </span>
                      <span
                        className={`absolute left-[2px] top-[2px] z-0 h-[22px] w-[34px] rounded-full shadow-[0_0_6px_-2px_#111] transition-transform duration-300 ${
                          card.cardScene === "night"
                            ? "translate-x-[38px] bg-[#3c3c3c]"
                            : "translate-x-0 bg-white"
                        }`}
                      />
                    </span>
                    <svg
                      viewBox="0 0 16 16"
                      width={23}
                      className="ms-1 shrink-0 text-amber-500"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8z" />
                    </svg>
                  </label>
                </div>
              </div>
              <div className="space-y-3 pb-2 pt-4">
                <h3 className="text-3xl font-semibold text-[var(--color-text)]">{card.title}</h3>
                <p className="text-lg text-[var(--color-text)]/85">{card.subtitle}</p>
                <p className="text-base leading-7 text-[var(--color-text)]/75">{card.description}</p>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-base font-semibold text-[var(--color-bg)] opacity-60 cursor-not-allowed"
                >
                  להדמיה
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="interior-process-title"
        className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20"
      >
        <div className="rounded-2xl border border-[var(--color-text)]/15 bg-[var(--color-bg)]/40 p-5 sm:p-7">
          <h2
            id="interior-process-title"
            className="mb-5 text-2xl font-semibold text-[var(--color-text)] sm:text-3xl"
          >
            {INTERIOR_PROCESS_TITLE}
          </h2>
          <ol className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
            {INTERIOR_PROCESS_STEPS.map((step, idx) => (
              <li
                key={step.title}
                className="rounded-xl border border-[var(--color-text)]/15 bg-[var(--color-bg)]/55 p-4"
              >
                <p className="text-sm font-semibold tracking-wide text-[var(--color-accent)]">
                  שלב {idx + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[var(--color-text)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text)]/85 sm:text-base">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
