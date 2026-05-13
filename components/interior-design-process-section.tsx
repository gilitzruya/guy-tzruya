"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

function subscribeNoop(): () => void {
  return () => {};
}

function useHydrated() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}
import {
  INTERIOR_PROCESS_STEPS,
  INTERIOR_PROCESS_TITLE,
} from "@/components/interior-design-content";
import { useScene } from "@/components/scene-provider";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return reduced;
}

export function InteriorDesignProcessSection() {
  const { scene } = useScene();
  const hydrated = useHydrated();
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [entered, setEntered] = useState(false);
  const revealed = (hydrated && reducedMotion) || entered;

  useEffect(() => {
    if (!hydrated || reducedMotion || entered) return;
    const root = sectionRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setEntered(true);
          io.unobserve(root);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(root);
    return () => io.disconnect();
  }, [hydrated, reducedMotion, entered]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="interior-process-title"
      className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20"
    >
      <h2
        id="interior-process-title"
        className="mb-8 text-center text-2xl font-semibold text-[var(--color-text)] sm:mb-10 sm:text-3xl"
      >
        {INTERIOR_PROCESS_TITLE}
      </h2>
      <ol className="grid list-none grid-cols-1 gap-6 p-0 sm:gap-7 lg:grid-cols-3 lg:gap-20 xl:gap-24">
        {INTERIOR_PROCESS_STEPS.map((step, idx) => (
          <li
            key={step.title}
            style={{ "--step-index": idx } as CSSProperties}
            className={`process-step-card relative isolate aspect-square overflow-hidden rounded-2xl shadow-[0_1px_0_0_color-mix(in_oklab,var(--color-text)_12%,transparent)_inset] ${
              scene === "day"
                ? "ring-1 ring-[color-mix(in_oklab,var(--color-text)_16%,transparent)] shadow-[0_12px_40px_color-mix(in_oklab,var(--color-text)_12%,transparent),0_0_0_1px_color-mix(in_oklab,var(--color-text)_10%,transparent)_inset]"
                : "ring-1 ring-white/12 shadow-[0_12px_40px_rgb(0_0_0/_0.45),0_0_0_1px_rgb(255_255_255/_0.06)_inset]"
            } ${revealed ? "process-step-revealed" : ""}`}
          >
            <div className="pointer-events-none absolute inset-0 -z-[6]" aria-hidden>
              <Image
                src={`/interior-design/process/step-${String(idx + 1).padStart(2, "0")}.webp`}
                alt={`המחשה לשלב ${idx + 1}: ${step.title}`}
                fill
                unoptimized
                sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
            <div
              className={`pointer-events-none absolute inset-0 -z-[5] ${
                scene === "day"
                  ? "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-text)_14%,transparent)_0%,transparent_30%,color-mix(in_oklab,var(--color-text)_22%,transparent)_100%)]"
                  : "bg-[linear-gradient(180deg,rgb(0_0_0/_0.14)_0%,rgb(0_0_0/_0.06)_28%,rgb(0_0_0/_0.08)_55%,rgb(0_0_0/_0.34)_100%)]"
              }`}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 -z-20 bg-[color-mix(in_oklab,var(--color-text)_4%,var(--color-bg))]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--color-text) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--color-text) 1px, transparent 1px),
                  linear-gradient(135deg, transparent 48%, color-mix(in oklab, var(--color-text) 25%, transparent) 49%, transparent 51%)
                `,
                backgroundSize: "22px 22px, 22px 22px, 100% 100%",
              }}
              aria-hidden
            />
            <div className="relative h-full min-h-0 w-full">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
                <div
                  className={`bg-gradient-to-t px-5 pb-5 pt-12 text-right sm:px-6 sm:pb-6 sm:pt-14 lg:px-6 lg:pb-6 lg:pt-16 ${
                    scene === "night"
                      ? "from-black/82 via-black/52 to-transparent"
                      : "from-black/85 via-black/58 to-transparent"
                  }`}
                >
                  <div className="flex flex-col">
                    <p
                      className={`mb-1 flex h-6 items-end text-[11px] font-bold uppercase tracking-[0.18em] text-white ${
                        scene === "night"
                          ? "[text-shadow:0_1px_8px_rgb(0_0_0/_0.85)]"
                          : "[text-shadow:0_1px_6px_rgb(0_0_0/_0.75)]"
                      }`}
                    >
                      שלב {idx + 1}
                    </p>
                    <h3
                      className={`min-h-[2rem] text-[1.125rem] font-semibold leading-snug text-white truncate sm:text-[1.25rem] ${
                        scene === "night"
                          ? "[text-shadow:0_2px_12px_rgb(0_0_0/_0.88)]"
                          : "[text-shadow:0_2px_10px_rgb(0_0_0/_0.7)]"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`mt-2 min-h-[4rem] max-w-none text-[0.8125rem] leading-relaxed line-clamp-4 sm:min-h-[5.25rem] ${
                        scene === "night"
                          ? "text-[#ebe8e4] [text-shadow:0_1px_8px_rgb(0_0_0/_0.82)]"
                          : "text-[#e4e2df] [text-shadow:0_1px_8px_rgb(0_0_0/_0.72)]"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
