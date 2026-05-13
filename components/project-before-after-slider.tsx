"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ProjectSlug } from "@/lib/projects";
import {
  projectBeforeAfterSrc,
  projectLegacyImageSrc,
} from "@/lib/projects";

const POSITION_STEP = 3;
const DESKTOP_MIN_WIDTH = 1024;

function SliderPhaseImage({
  primary,
  fallback,
  priority,
  sizes,
  imgFit,
}: {
  primary: string;
  fallback: string;
  priority: boolean;
  sizes: string;
  imgFit: string;
}) {
  const [src, setSrc] = useState(primary);
  useEffect(() => {
    setSrc(primary);
  }, [primary]);

  return (
    <Image
      src={src}
      alt=""
      fill
      unoptimized
      sizes={sizes}
      draggable={false}
      className={`pointer-events-none ${imgFit}`}
      priority={priority}
      aria-hidden
      onError={() => {
        setSrc((current) => (current === fallback ? current : fallback));
      }}
    />
  );
}

export function ProjectBeforeAfterSlider({
  slug,
  title,
  priority = false,
  imageObjectFit = "cover",
  fillHeight = false,
  compactMobileHeight = false,
  className = "",
  sizes = "100vw",
}: {
  slug: ProjectSlug;
  title: string;
  /** First/largest paint on the listing page should pass `true` for LCP. */
  priority?: boolean;
  /** `contain` preserves aspect ratio (letterboxing). `cover` fills the frame. */
  imageObjectFit?: "cover" | "contain";
  /** When true, stretch to parent height on desktop instead of a fixed tall min-height. */
  fillHeight?: boolean;
  /** With `fillHeight`, use a shorter min-height below `lg` (projects listing mobile). */
  compactMobileHeight?: boolean;
  className?: string;
  /** Passed to next/image `sizes` for responsive loading. */
  sizes?: string;
}) {
  const t = useTranslations("Projects");
  const hitLayerRef = useRef<HTMLDivElement>(null);
  const isDesktopRef = useRef(true);
  const [posPct, setPosPct] = useState(50);
  const [isDesktop, setIsDesktop] = useState(true);

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const apply = () => {
      const next = mq.matches;
      setIsDesktop(next);
      isDesktopRef.current = next;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const viewport = isDesktop ? "desktop" : "mobile";
  const beforePrimary = projectBeforeAfterSrc(slug, "before", viewport);
  const afterPrimary = projectBeforeAfterSrc(slug, "after", viewport);
  const beforeFallback = projectLegacyImageSrc(slug, "before");
  const afterFallback = projectLegacyImageSrc(slug, "after");

  const setFromPointer = useCallback((clientX: number, clientY: number) => {
    const el = hitLayerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const desktop = isDesktopRef.current;
    if (desktop) {
      if (rect.width <= 0) return;
      const next = ((clientX - rect.left) / rect.width) * 100;
      setPosPct(Math.min(100, Math.max(0, next)));
    } else {
      if (rect.height <= 0) return;
      const next = ((clientY - rect.top) / rect.height) * 100;
      setPosPct(Math.min(100, Math.max(0, next)));
    }
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromPointer(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setFromPointer(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  /** Desktop: before left / after right. Mobile: before top / after bottom. */
  const clipBefore = isDesktop
    ? `inset(0 ${100 - posPct}% 0 0)`
    : `inset(0 0 calc(100% - ${posPct}%) 0)`;
  const clipAfter = isDesktop
    ? `inset(0 0 0 ${posPct}%)`
    : `inset(${posPct}% 0 0 0)`;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const desktop = isDesktopRef.current;
    if (desktop) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPosPct((p) => Math.max(0, p - POSITION_STEP));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPosPct((p) => Math.min(100, p + POSITION_STEP));
      }
    } else {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setPosPct((p) => Math.max(0, p - POSITION_STEP));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPosPct((p) => Math.min(100, p + POSITION_STEP));
      }
    }
    if (e.key === "Home") {
      e.preventDefault();
      setPosPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosPct(100);
    }
  };

  const roundedPos = Math.round(posPct);

  const imgFit =
    imageObjectFit === "contain" ? "object-contain" : "object-cover";
  const frameBg = imageObjectFit === "contain" ? "bg-zinc-950" : "";

  const frameClass =
    fillHeight && compactMobileHeight
      ? `relative w-full max-lg:aspect-[9/16] max-lg:max-h-[min(68svh,620px)] lg:aspect-video lg:h-full lg:min-h-0 lg:max-h-full ${frameBg}`.trim()
      : fillHeight
        ? `relative w-full max-lg:aspect-[9/16] lg:aspect-video lg:min-h-0 lg:flex-1 lg:h-full ${frameBg}`.trim()
        : `relative w-full max-lg:aspect-[9/16] lg:aspect-video ${frameBg}`.trim();

  return (
    <div
      className={`w-full overflow-hidden ${fillHeight ? "flex min-h-0 flex-1 flex-col" : ""} ${className}`.trim()}
    >
      <div dir="ltr" className={frameClass}>
        {/* After — no pointer events; dragging handled by overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ clipPath: clipAfter }}
        >
          <SliderPhaseImage
            primary={afterPrimary}
            fallback={afterFallback}
            priority={false}
            sizes={sizes}
            imgFit={imgFit}
          />
        </div>

        {/* Before */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ clipPath: clipBefore }}
        >
          <SliderPhaseImage
            primary={beforePrimary}
            fallback={beforeFallback}
            priority={priority}
            sizes={sizes}
            imgFit={imgFit}
          />
        </div>

        {/* Transparent hit layer: reliable dragging + correct getBoundingClientRect */}
        <div
          ref={hitLayerRef}
          className="absolute inset-0 z-[5] touch-none select-none outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 max-lg:cursor-ns-resize lg:cursor-ew-resize"
          style={{ touchAction: "none" }}
          tabIndex={0}
          role="slider"
          aria-orientation={isDesktop ? "horizontal" : "vertical"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={roundedPos}
          aria-label={t("sliderAriaLabel", { title })}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
        />

        <p
          dir="ltr"
          className="pointer-events-none absolute z-[8] rounded-full border border-white/25 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm max-lg:start-3 max-lg:top-3 lg:bottom-3 lg:start-3"
        >
          {t("beforeLabel")}
        </p>
        <p
          dir="ltr"
          className="pointer-events-none absolute z-[8] rounded-full border border-white/25 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm max-lg:end-3 max-lg:bottom-3 lg:bottom-3 lg:end-3"
        >
          {t("afterLabel")}
        </p>

        {/* Divider — black line + arrows (subtle light halo for dark image areas) */}
        {isDesktop ? (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 z-[6] w-[5px] rounded-full bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_12px_rgba(255,255,255,0.35)]"
              style={{ left: `${posPct}%`, transform: "translateX(-50%)" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 z-[6] flex w-32 -translate-x-1/2 items-center justify-center"
              style={{ left: `${posPct}%` }}
              aria-hidden
            >
              <svg
                viewBox="0 0 100 32"
                width="68"
                height="22"
                className="drop-shadow-[0_0_1px_rgba(255,255,255,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]"
                aria-hidden
              >
                <polygon
                  points="6,16 34,3 34,29"
                  fill="#0a0a0a"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                <polygon
                  points="94,16 66,3 66,29"
                  fill="#0a0a0a"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </>
        ) : (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 z-[6] h-[5px] rounded-full bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_12px_rgba(255,255,255,0.35)]"
              style={{ top: `${posPct}%`, transform: "translateY(-50%)" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 z-[6] flex h-28 -translate-y-1/2 items-center justify-center"
              style={{ top: `${posPct}%` }}
              aria-hidden
            >
              <svg
                viewBox="0 0 36 96"
                width="28"
                height="72"
                className="drop-shadow-[0_0_1px_rgba(255,255,255,0.95)] drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]"
                aria-hidden
              >
                <polygon
                  points="18,4 5,30 31,30"
                  fill="#0a0a0a"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                <polygon
                  points="18,92 5,66 31,66"
                  fill="#0a0a0a"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
