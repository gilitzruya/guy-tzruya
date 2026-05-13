"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useScene } from "@/components/scene-provider";

/** Crossfade wall clock: illustration opacity 1 → 0 over this duration (starts immediately, no black gate). */
const CROSSFADE_MS = 5000;
/**
 * First portion of that window: strong linear ramp (~13% wall clock) so the photo becomes
 * visibly plausible early (avoids “stuck on illustration”).
 */
const CROSSFADE_LINEAR_HEAD = 0.13;
/** Reveal progress at end of linear head (illustration opacity ≈ 1 − this). */
const CROSSFADE_LINEAR_REVEAL = 0.32;
/** When illustration is visually “gone enough”, end intro (don’t wait for wall-clock tail of ease-out). */
const REVEAL_VISUAL_DONE = 0.99;

const DESKTOP_BREAKPOINT = 768;

function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

/** Maps elapsed fraction [0,1] → reveal progress [0,1] over full CROSSFADE_MS. */
function crossfadeRevealProgress(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped < CROSSFADE_LINEAR_HEAD) {
    return (clamped / CROSSFADE_LINEAR_HEAD) * CROSSFADE_LINEAR_REVEAL;
  }
  const u = (clamped - CROSSFADE_LINEAR_HEAD) / (1 - CROSSFADE_LINEAR_HEAD);
  return (
    CROSSFADE_LINEAR_REVEAL + (1 - CROSSFADE_LINEAR_REVEAL) * easeOutCubic(u)
  );
}

type Phase = "drawing" | "done";

type Props = {
  /** English lockup — same copy in both locales */
  brandLine1: string;
  brandLine2: string;
  ctaLabel: string;
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
  ctaLabel,
  imageAlt,
}: Props) {
  const { scene } = useScene();
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  const [phase, setPhase] = useState<Phase>("drawing");
  const [introDone, setIntroDone] = useState(false);
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

  const finishIntro = useCallback(() => {
    setIntroDone(true);
  }, []);

  useEffect(() => {
    if (isDesktop === null) return;

    const runId = ++introRunIdRef.current;
    introTimersRef.current = {};

    queueMicrotask(() => {
      if (introRunIdRef.current !== runId) return;

      if (reducedMotion) {
        setPhase("done");
        setRevealProgress(1);
        finishIntro();
        return;
      }

      setPhase("drawing");
      setRevealProgress(0);
      setIntroDone(false);
      introVisuallyCompleteRef.current = false;

      introTimersRef.current.done = window.setTimeout(() => {
        if (introRunIdRef.current !== runId) return;
        if (introVisuallyCompleteRef.current) return;
        introVisuallyCompleteRef.current = true;
        setPhase("done");
        setRevealProgress(1);
        finishIntro();
      }, CROSSFADE_MS);
    });

    return () => {
      introRunIdRef.current += 1;
      const { done } = introTimersRef.current;
      if (done !== undefined) window.clearTimeout(done);
      introTimersRef.current = {};
      cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, reducedMotion, finishIntro]);

  useEffect(() => {
    if (phase !== "drawing" || reducedMotion || isDesktop === null) {
      return;
    }

    crossfadeStartRef.current = performance.now();
    const rafRunId = introRunIdRef.current;

    const tick = (now: number) => {
      if (introRunIdRef.current !== rafRunId) return;

      const elapsed = now - crossfadeStartRef.current;
      const t = Math.min(1, elapsed / CROSSFADE_MS);
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
        finishIntro();
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
  }, [phase, reducedMotion, isDesktop, finishIntro]);

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

  const textReveal = `transition-opacity duration-300 ease-out ${
    introDone ? "opacity-100" : "opacity-0"
  }`;

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
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
        className={`relative z-20 flex min-h-[100svh] flex-col pt-16 ${textReveal}`}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-16 sm:px-6 sm:pb-20">
          <div
            className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 text-center [font-family:var(--font-plus-jakarta),ui-sans-serif,system-ui,sans-serif]"
            dir="ltr"
          >
            <h1 id="hero-heading" className="contents text-[var(--color-text)]">
              <span
                className={`block font-light uppercase text-[clamp(1.6rem,9vw,5.5rem)] leading-[0.95] tracking-[0.32em] [word-spacing:0.5em] ${heroTitleFx}`}
              >
                {brandLine1}
              </span>
              <span
                className={`block font-medium uppercase text-[clamp(0.65rem,2.35vw,1.12rem)] leading-snug tracking-[0.42em] [word-spacing:0.6em] ${heroSubtitleFx}`}
              >
                {brandLine2}
              </span>
            </h1>
            <a
              href="mailto:studio@guytzruya.com?subject=Project%20inquiry"
              className="inline-flex min-h-[48px] min-w-[min(100%,12rem)] shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] px-8 text-base font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
