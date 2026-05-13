"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import {
  PROJECT_GALLERY_COUNT,
  projectGalleryImageSrc,
  projectLegacyImageSrc,
  type ProjectSlug,
} from "@/lib/projects";

const DESKTOP_MIN_WIDTH = 1024;

function GallerySlideImage({
  primary,
  fallback,
  alt,
  sizes,
}: {
  primary: string;
  fallback?: string;
  alt: string;
  sizes: string;
}) {
  const [src, setSrc] = useState(primary);
  useEffect(() => {
    setSrc(primary);
  }, [primary]);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className="object-contain"
      sizes={sizes}
      priority
      onError={() => {
        if (fallback && src !== fallback) setSrc(fallback);
      }}
    />
  );
}

function slidePrimary(
  slug: ProjectSlug,
  slideIndex: number,
  isDesktop: boolean,
  galleryCount: number,
): string {
  const viewport = isDesktop ? "desktop" : "mobile";
  if (galleryCount > 0) {
    return projectGalleryImageSrc(slug, slideIndex + 1, viewport);
  }
  return projectLegacyImageSrc(slug, slideIndex === 0 ? "before" : "after");
}

function slideFallback(
  slug: ProjectSlug,
  slideIndex: number,
  galleryCount: number,
): string | undefined {
  if (galleryCount <= 0) return undefined;
  if (slideIndex === 0) return projectLegacyImageSrc(slug, "before");
  if (slideIndex === 1) return projectLegacyImageSrc(slug, "after");
  return undefined;
}

export function ProjectGalleryDialog({
  slug,
  title,
  onClose,
}: {
  slug: ProjectSlug;
  title: string;
  onClose: () => void;
}) {
  const t = useTranslations("Projects");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  const galleryCount = PROJECT_GALLERY_COUNT[slug] ?? 0;
  const slideCount = galleryCount > 0 ? galleryCount : 2;

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => closeRef.current?.focus());
    return () => cancelAnimationFrame(rafId);
  }, []);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = i + delta;
        if (next < 0) return slideCount - 1;
        if (next >= slideCount) return 0;
        return next;
      });
    },
    [slideCount],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  const primary = slidePrimary(slug, index, isDesktop, galleryCount);
  const fallback = slideFallback(slug, index, galleryCount);
  const alt = t("gallerySlideAlt", {
    title,
    index: index + 1,
    total: slideCount,
  });

  const sizes = "100vw";

  return (
    <div className="fixed inset-0 z-[200]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"
        aria-label={t("galleryCloseBackdrop")}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="relative z-[1] flex h-[100dvh] w-full flex-col bg-black"
      >
        {/* Full-viewport image (desktop + mobile); controls overlay on top */}
        <div className="absolute inset-0 z-0">
          <GallerySlideImage
            key={`${slug}-${index}-${isDesktop ? "d" : "m"}`}
            primary={primary}
            fallback={fallback}
            alt={alt}
            sizes={sizes}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 bg-gradient-to-b from-black/75 via-black/40 to-transparent px-4 pb-10 pt-3 sm:px-5 sm:pt-4">
          <p
            id={titleId}
            className="min-w-0 max-w-[min(100%,28rem)] truncate text-sm font-medium text-white/95 sm:text-base"
          >
            {t("galleryDialogTitle", { title })}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="pointer-events-auto shrink-0 rounded-md border border-white/25 bg-black/40 px-3 py-1.5 text-sm font-medium text-white/95 backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {t("galleryClose")}
          </button>
        </div>

        {/* Physical L/R so chevrons match screen sides in RTL locales too */}
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-2.5 text-white/95 backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:left-5"
          aria-label={t("galleryPrevious")}
        >
          <Chevron dir="prev" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-2.5 text-white/95 backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:right-5"
          aria-label={t("galleryNext")}
        >
          <Chevron dir="next" />
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-black/75 via-black/45 to-transparent px-4 pb-4 pt-10">
          <div className="pointer-events-auto flex justify-center gap-2">
            {Array.from({ length: slideCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-[width,background] ${
                  i === index
                    ? "w-8 bg-[var(--color-accent)]"
                    : "w-2 bg-white/35 hover:bg-white/55"
                }`}
                aria-label={t("gallerySlideDotLabel", {
                  index: i + 1,
                  total: slideCount,
                })}
                aria-pressed={i === index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {dir === "prev" ? (
        <path d="M15 6l-6 6 6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}
