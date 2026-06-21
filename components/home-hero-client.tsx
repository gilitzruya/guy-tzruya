"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocale } from "next-intl";
import { useScene } from "@/components/scene-provider";
import {
  crossfadeRevealProgress,
  HERO_CROSSFADE_MS,
} from "@/lib/crossfade-reveal";

/** When illustration is visually “gone enough”, end intro (don’t wait for wall-clock tail of ease-out). */
const REVEAL_VISUAL_DONE = 0.99;

const DESKTOP_BREAKPOINT = 768;

type Phase = "drawing" | "done";

type Props = {
  /** English lockup — same copy in both locales */
  brandLine1: string;
  brandLine2: string;
  scrollCtaLabel: string;
  imageAlt: string;
};

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

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return reduced;
}

export function HomeHeroClient({
  brandLine1,
  brandLine2,
  scrollCtaLabel,
  imageAlt,
}: Props) {
  const { scene } = useScene();
  const locale = useLocale();
  const isRtl = locale === "he";
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  const [phase, setPhase] = useState<Phase>("drawing");
  /** 0 = illustration fully visible, 1 = illustration fully faded (eased). */
  const [revealProgress, setRevealProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const crossfadeStartRef = useRef(0);
  const introRunIdRef = useRef(0);
  const introTimersRef = useRef<{ done?: number }>({});
  const introVisuallyCompleteRef = useRef(false);

  const imageSrc =
    isDesktop === false
      ? `/hero/mobile-${scene}.webp`
      : `/hero/desktop-${scene}.webp`;

  const illustrationSrc =
    isDesktop === false
      ? "/hero/mobile-illustration.webp"
      : "/hero/desktop-illustration.webp";

  useEffect(() => {
    if (isDesktop === null) return;

    const runId = ++introRunIdRef.current;
    introTimersRef.current = {};

    queueMicrotask(() => {
      if (introRunIdRef.current !== runId) return;

      if (reducedMotion) {
        setPhase("done");
        setRevealProgress(1);
        return;
      }

      setPhase("drawing");
      setRevealProgress(0);
      introVisuallyCompleteRef.current = false;

      introTimersRef.current.done = window.setTimeout(() => {
        if (introRunIdRef.current !== runId) return;
        if (introVisuallyCompleteRef.current) return;
        introVisuallyCompleteRef.current = true;
        setPhase("done");
        setRevealProgress(1);
      }, HERO_CROSSFADE_MS);
    });

    return () => {
      introRunIdRef.current += 1;
      const { done } = introTimersRef.current;
      if (done !== undefined) window.clearTimeout(done);
      introTimersRef.current = {};
      cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, reducedMotion]);

  useEffect(() => {
    if (phase !== "drawing" || reducedMotion || isDesktop === null) {
      return;
    }

    crossfadeStartRef.current = performance.now();
    const rafRunId = introRunIdRef.current;

    const tick = (now: number) => {
      if (introRunIdRef.current !== rafRunId) return;

      const elapsed = now - crossfadeStartRef.current;
      const t = Math.min(1, elapsed / HERO_CROSSFADE_MS);
      const progress = crossfadeRevealProgress(t);

      if (
        !introVisuallyCompleteRef.current &&
        (progress >= REVEAL_VISUAL_DONE || t >= 1)
      ) {
        introVisuallyCompleteRef.current = true;
        const { done } = introTimersRef.current;
        if (done !== undefined) {
          window.clearTimeout(done);
          introTimersRef.current.done = undefined;
        }
        setPhase("done");
        setRevealProgress(1);
        return;
      }

      setRevealProgress(progress);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase, reducedMotion, isDesktop]);

  const showPhoto = phase === "done";
  const illustrationOpacity = 1 - revealProgress;

  /** Readable on busy photos: contrasting stroke + layered glow (especially for thin type / subtitle). */
  const heroTitleFx =
    scene === "night"
      ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.4px_rgb(0_0_0/_0.55)] [text-shadow:0_0_22px_rgb(0_0_0/_0.88),0_2px_12px_rgb(0_0_0/_0.6),0_0_6px_rgb(255_255_255/_0.12)]"
      : "[paint-order:stroke_fill] [-webkit-text-stroke:0.5px_rgb(255_255_255/_0.95)] [text-shadow:0_0_28px_rgb(255_255_255/_0.92),0_1px_10px_rgb(0_0_0/_0.38),0_2px_34px_rgb(255_255_255/_0.55)]";

  const heroSubtitleFx =
    scene === "night"
      ? "[paint-order:stroke_fill] [-webkit-text-stroke:0.55px_rgb(0_0_0/_0.65)] [text-shadow:0_0_18px_rgb(0_0_0/_0.92),0_1px_8px_rgb(0_0_0/_0.7),0_0_4px_rgb(255_255_255/_0.1)]"
      : "[paint-order:stroke_fill] [-webkit-text-stroke:0.7px_rgb(255_255_255/_0.98)] [text-shadow:0_0_24px_rgb(255_255_255/_0.98),0_1px_10px_rgb(0_0_0/_0.45),0_2px_26px_rgb(255_255_255/_0.65)]";

  const contentVisible = showPhoto;

  return (
    <section
      className="home-hero relative min-h-[100svh] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
            key={imageSrc}
          />
        </div>

        {!showPhoto ? (
          <div className="pointer-events-none absolute inset-0 z-[5]">
            <Image
              src={illustrationSrc}
              alt=""
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover"
              style={{ opacity: illustrationOpacity }}
              key={illustrationSrc}
            />
          </div>
        ) : null}
      </div>

      <div
        className={`relative z-20 flex min-h-[100svh] flex-col pt-16 ${
          contentVisible
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 sm:px-6">
          <div
            className="mx-auto flex w-full max-w-5xl flex-col items-center text-center [font-family:var(--font-plus-jakarta),ui-sans-serif,system-ui,sans-serif]"
            dir="ltr"
          >
            <h1 id="hero-heading" className="contents text-[var(--color-text)]">
              <span
                className={`block font-light uppercase text-[clamp(1.6rem,9vw,5.5rem)] leading-[0.95] tracking-[0.32em] [word-spacing:0.5em] ${heroTitleFx}`}
              >
                {brandLine1}
              </span>
              <span
                className={`mt-4 block font-medium uppercase text-[clamp(0.65rem,2.35vw,1.12rem)] leading-snug tracking-[0.42em] [word-spacing:0.6em] sm:mt-5 ${heroSubtitleFx}`}
              >
                {brandLine2}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 justify-center px-4 pb-10 sm:px-6 sm:pb-12">
          <a
            href="#home-services"
            className="about-hero__scroll-cta"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <span>{scrollCtaLabel}</span>
            <svg
              className="about-hero__scroll-cta-arrow scroll-arrow-hint"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path
                d="M12 5v14M6 13l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
