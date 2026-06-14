"use client";

import {
  type CSSProperties,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const POSITION_STEP = 3;
const DESKTOP_MIN_WIDTH = 1024;

function reportImageLoad(
  img: HTMLImageElement,
  onImageLoad?: (aspectRatio: number) => void,
) {
  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
    onImageLoad?.(img.naturalWidth / img.naturalHeight);
  }
}

function SliderPhaseImageInner({
  primary,
  fallback,
  priority,
  imgFit,
  onImageLoad,
}: {
  primary: string;
  fallback?: string;
  priority: boolean;
  imgFit: string;
  onImageLoad?: (aspectRatio: number) => void;
}) {
  const [useFallback, setUseFallback] = useState(false);
  const src = useFallback && fallback ? fallback : primary;

  return (
    // Native img loads the full source resolution (Replicate URLs, data URIs).
    <img
      src={src}
      alt=""
      draggable={false}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`pointer-events-none absolute inset-0 h-full w-full ${imgFit}`}
      aria-hidden
      onError={() => {
        if (fallback) setUseFallback(true);
      }}
      onLoad={(event: SyntheticEvent<HTMLImageElement>) => {
        reportImageLoad(event.currentTarget, onImageLoad);
      }}
      ref={(img) => {
        if (img?.complete) reportImageLoad(img, onImageLoad);
      }}
    />
  );
}

function SliderPhaseImage(props: {
  primary: string;
  fallback?: string;
  priority: boolean;
  imgFit: string;
  onImageLoad?: (aspectRatio: number) => void;
}) {
  return <SliderPhaseImageInner key={props.primary} {...props} />;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeFallback,
  afterFallback,
  beforeLabel,
  afterLabel,
  sliderAriaLabel,
  priority = false,
  imageObjectFit = "cover",
  fillHeight = false,
  compactMobileHeight = false,
  className = "",
  sizes = "100vw",
  onImagesReady,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeFallback?: string;
  afterFallback?: string;
  title: string;
  beforeLabel: string;
  afterLabel: string;
  sliderAriaLabel: string;
  priority?: boolean;
  imageObjectFit?: "cover" | "contain";
  fillHeight?: boolean;
  compactMobileHeight?: boolean;
  className?: string;
  sizes?: string;
  onImagesReady?: () => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const hitLayerRef = useRef<HTMLDivElement>(null);
  const isDesktopRef = useRef(true);
  const [posPct, setPosPct] = useState(50);
  const [isDesktop, setIsDesktop] = useState(true);
  const [containAspect, setContainAspect] = useState<number | null>(null);
  const [mediaBounds, setMediaBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);

  useEffect(() => {
    setBeforeLoaded(false);
    setAfterLoaded(false);
  }, [beforeSrc, afterSrc]);

  useEffect(() => {
    if (beforeLoaded && afterLoaded) onImagesReady?.();
  }, [afterLoaded, beforeLoaded, onImagesReady]);

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

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || imageObjectFit !== "contain" || !containAspect) {
      setMediaBounds(null);
      return;
    }

    const updateBounds = () => {
      const frameWidth = frame.clientWidth;
      const frameHeight = frame.clientHeight;
      if (frameWidth <= 0 || frameHeight <= 0) return;

      const frameAspect = frameWidth / frameHeight;
      const mediaWidth =
        frameAspect > containAspect ? frameHeight * containAspect : frameWidth;
      const mediaHeight =
        frameAspect > containAspect ? frameHeight : frameWidth / containAspect;

      setMediaBounds({
        left: (frameWidth - mediaWidth) / 2,
        top: (frameHeight - mediaHeight) / 2,
        width: mediaWidth,
        height: mediaHeight,
      });
    };

    updateBounds();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }

    const observer = new ResizeObserver(updateBounds);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [containAspect, imageObjectFit]);

  const recordContainAspect = useCallback(
    (aspectRatio: number) => {
      if (imageObjectFit === "contain") setContainAspect(aspectRatio);
    },
    [imageObjectFit],
  );

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
  const mediaFrameStyle: CSSProperties =
    imageObjectFit === "contain" && mediaBounds
      ? {
          left: `${mediaBounds.left}px`,
          top: `${mediaBounds.top}px`,
          width: `${mediaBounds.width}px`,
          height: `${mediaBounds.height}px`,
        }
      : { inset: 0 };

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
      <div ref={frameRef} dir="ltr" className={frameClass}>
        <div className="absolute overflow-hidden" style={mediaFrameStyle}>
        {/* After — no pointer events; dragging handled by overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ clipPath: clipAfter }}
        >
          <SliderPhaseImage
            primary={afterSrc}
            fallback={afterFallback}
            priority={priority}
            imgFit={imgFit}
            onImageLoad={(aspectRatio) => {
              setAfterLoaded(true);
              recordContainAspect(aspectRatio);
            }}
          />
        </div>

        {/* Before */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ clipPath: clipBefore }}
        >
          <SliderPhaseImage
            primary={beforeSrc}
            fallback={beforeFallback}
            priority={priority}
            imgFit={imgFit}
            onImageLoad={(aspectRatio) => {
              setBeforeLoaded(true);
              recordContainAspect(aspectRatio);
            }}
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
          aria-label={sliderAriaLabel}
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
          {beforeLabel}
        </p>
        <p
          dir="ltr"
          className="pointer-events-none absolute z-[8] rounded-full border border-white/25 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm max-lg:end-3 max-lg:bottom-3 lg:bottom-3 lg:end-3"
        >
          {afterLabel}
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
    </div>
  );
}
