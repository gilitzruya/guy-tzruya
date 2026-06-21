"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import {
  findInteriorStyle,
  INTERIOR_STYLES,
} from "@/components/interior-design-content";
import {
  SIMULATION_ROOM_TYPE_IDS,
  type SimulationRoomTypeId,
} from "@/lib/simulation-room-types";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";
import { useScene } from "@/components/scene-provider";
import type { Scene } from "@/lib/scene-storage";
import type { SimulationQuota } from "@/lib/simulation-usage";
import { SIMULATION_MAX_FILE_BYTES } from "@/lib/simulation-config";

type Phase = "form" | "generating" | "result";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const STYLE_ASSET_DESKTOP_MIN_WIDTH = 1024;

function preloadSimulationImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("image_preload_failed"));
    img.src = src;
  });
}

function buildStyleImageSrc(
  slug: string,
  isDesktop: boolean,
  scene: Scene,
): string {
  const device = isDesktop ? "desktop" : "mobile";
  return `/interior-design/styles/${slug}/${device}-${scene}.webp`;
}

function useStyleCardViewport() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(
      `(min-width: ${STYLE_ASSET_DESKTOP_MIN_WIDTH}px)`,
    ).matches;
  });

  useLayoutEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${STYLE_ASSET_DESKTOP_MIN_WIDTH}px)`,
    );
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return isDesktop ?? false;
}

function RoomTypeIcon({
  id,
  className = "",
}: {
  id: SimulationRoomTypeId;
  className?: string;
}) {
  if (id === "bedroom") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M4 11V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V11" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 11h16v7M4 18v-7M4 14h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 9h3.5M13.5 9H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "kitchen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M6 4h12v16H6V4Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 9h12M10 4v5M14 4v5M9 13h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "bathroom") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
        <path d="M5 11h14v2a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5v-2Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 11V7.5A3.5 3.5 0 0 1 10.5 4H12M8 20l1-2M16 18l1 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 12h14a2 2 0 0 1 2 2v4H3v-4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 12V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3M5 18v2M19 18v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function isValidImageFile(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type);
}

function isFileTooLarge(file: File): boolean {
  return file.size > SIMULATION_MAX_FILE_BYTES;
}

type SimulationGenerateResponse = {
  afterImageUrl?: string;
  beforeImageUrl?: string;
  remaining?: number;
  used?: number;
  max?: number;
  error?: string;
  message?: string;
};

function simulationApiErrorKey(
  status: number,
  error: string | undefined,
  fileSize: number,
): string {
  if (
    status === 413 ||
    error === "file_too_large" ||
    fileSize > SIMULATION_MAX_FILE_BYTES
  ) {
    return "fileTooLarge";
  }
  if (error === "invalid_body" && fileSize > SIMULATION_MAX_FILE_BYTES / 2) {
    return "fileTooLarge";
  }
  if (error === "missing_style" || error === "missing_prompt") {
    return "missingStyle";
  }
  if (error === "invalid_type") {
    return "invalidType";
  }
  return "generateFailed";
}

export function SimulationPage({ maxActivations }: { maxActivations: number }) {
  const t = useTranslations("Simulation");
  const tProjects = useTranslations("Projects");
  const locale = useLocale();
  const { scene } = useScene();
  const styleCardIsDesktop = useStyleCardViewport();
  const controlsDir = locale === "he" ? "rtl" : "ltr";
  const searchParams = useSearchParams();
  const pageBgStyle = interiorDesignPageBackgroundStyle(scene);

  const fileInputId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<Phase>("form");
  const [quota, setQuota] = useState<SimulationQuota | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const styleFromUrl = searchParams.get("style");
  const [selectedStyleSlug, setSelectedStyleSlug] = useState<string | null>(
    () =>
      styleFromUrl && findInteriorStyle(styleFromUrl) ? styleFromUrl : null,
  );
  const [roomType, setRoomType] = useState<SimulationRoomTypeId | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const [beforeSrc, setBeforeSrc] = useState<string | null>(null);
  const [afterSrc, setAfterSrc] = useState<string | null>(null);

  const fetchQuota = useCallback(async () => {
    setQuotaLoading(true);
    try {
      const res = await fetch("/api/simulation/quota", { cache: "no-store" });
      if (!res.ok) throw new Error("quota_failed");
      const data = (await res.json()) as SimulationQuota;
      setQuota(data);
    } catch {
      setQuota({ used: 0, max: maxActivations, remaining: maxActivations });
    } finally {
      setQuotaLoading(false);
    }
  }, [maxActivations]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setQuotaLoading(true);
      try {
        const res = await fetch("/api/simulation/quota", { cache: "no-store" });
        if (!res.ok) throw new Error("quota_failed");
        const data = (await res.json()) as SimulationQuota;
        if (!cancelled) setQuota(data);
      } catch {
        if (!cancelled) {
          setQuota({ used: 0, max: maxActivations, remaining: maxActivations });
        }
      } finally {
        if (!cancelled) setQuotaLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [maxActivations]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const setFile = useCallback((file: File) => {
    if (!isValidImageFile(file)) {
      setErrorKey("invalidType");
      return;
    }
    if (isFileTooLarge(file)) {
      setErrorKey("fileTooLarge");
      return;
    }
    setErrorKey(null);
    setImageFile(file);
    setImagePreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
  };

  const startCamera = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setCameraError(true);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "room-capture.jpg", {
          type: "image/jpeg",
        });
        setFile(file);
        stopCamera();
      },
      "image/jpeg",
      0.92,
    );
  };

  const canSubmit =
    Boolean(imageFile) &&
    Boolean(roomType) &&
    Boolean(selectedStyleSlug) &&
    (quota?.remaining ?? 0) > 0;
  const generateDisabledReason =
    !roomType && !selectedStyleSlug
      ? "missingRoomAndStyle"
      : !roomType
        ? "missingRoomType"
        : !selectedStyleSlug
          ? "missingStyleForGenerate"
          : null;

  const generate = async () => {
    if (!imageFile || !canSubmit || phase !== "form") return;
    if (isFileTooLarge(imageFile)) {
      setErrorKey("fileTooLarge");
      return;
    }
    setErrorKey(null);
    setPhase("generating");

    const body = new FormData();
    body.append("image", imageFile);
    body.append("styleSlug", selectedStyleSlug!);
    body.append("roomType", roomType!);

    try {
      const res = await fetch("/api/simulation/generate", {
        method: "POST",
        body,
      });

      let data: SimulationGenerateResponse = {};
      try {
        data = (await res.json()) as SimulationGenerateResponse;
      } catch {
        setErrorKey(
          simulationApiErrorKey(res.status, undefined, imageFile.size),
        );
        setPhase("form");
        return;
      }

      if (res.status === 429) {
        setErrorKey("quotaExceeded");
        setQuota({
          used: data.used ?? quota?.max ?? maxActivations,
          max: data.max ?? maxActivations,
          remaining: 0,
        });
        setPhase("form");
        return;
      }

      if (!res.ok) {
        setErrorKey(simulationApiErrorKey(res.status, data.error, imageFile.size));
        setPhase("form");
        return;
      }

      if (data.afterImageUrl && data.beforeImageUrl) {
        void preloadSimulationImage(data.afterImageUrl).catch(() => undefined);
        setBeforeSrc(data.beforeImageUrl);
        setAfterSrc(data.afterImageUrl);
        setPhase("result");
        if (
          typeof data.remaining === "number" &&
          typeof data.used === "number" &&
          typeof data.max === "number"
        ) {
          setQuota({ used: data.used, max: data.max, remaining: data.remaining });
        } else {
          void fetchQuota();
        }
      } else {
        setErrorKey("generateFailed");
        setPhase("form");
      }
    } catch {
      setErrorKey(simulationApiErrorKey(0, undefined, imageFile.size));
      setPhase("form");
    }
  };

  const resetToForm = () => {
    setPhase("form");
    setBeforeSrc(null);
    setAfterSrc(null);
    void fetchQuota();
  };

  const remaining = quota?.remaining ?? 0;
  const generateButtonClass =
    "simulation-generate-button inline-flex min-h-[40px] w-fit shrink-0 items-center justify-center rounded-none border border-white bg-transparent px-5 text-sm font-semibold text-white shadow-none transition-[background-color,border-color,box-shadow,color,opacity,transform] hover:-translate-y-0.5 hover:border-white hover:bg-white/14 hover:shadow-[0_0_22px_rgb(255_255_255/_0.22)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:bg-transparent disabled:hover:shadow-none";

  const imagePanel = (
    <section
      aria-label={t("stepImageTitle")}
      className="simulation-upload-section flex min-h-0 flex-col max-lg:shrink-0 lg:h-full lg:min-h-0"
    >
      <h2 className="simulation-step-title mb-2 text-lg font-semibold text-[var(--color-text)] lg:sr-only">
        {t("stepImageTitle")}
      </h2>

      {cameraOpen ? (
        <div className="simulation-camera-panel relative flex min-h-0 flex-1 flex-col gap-3 lg:min-h-0">
          <div className="simulation-upload-card relative min-h-[min(52svh,420px)] flex-1 overflow-hidden rounded-2xl bg-black lg:min-h-0 lg:rounded-3xl">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
              autoPlay
            />
          </div>
          <div className="simulation-upload-actions flex flex-wrap gap-2 lg:absolute lg:inset-x-4 lg:bottom-4 lg:z-10">
            <button
              type="button"
              onClick={capturePhoto}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-bg)] shadow-lg"
            >
              {t("capturePhoto")}
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-text)]/25 bg-[var(--color-bg)]/95 px-5 text-sm font-semibold text-[var(--color-text)] backdrop-blur-sm"
            >
              {t("cancelCamera")}
            </button>
          </div>
        </div>
      ) : (
        <div className="simulation-upload-panel relative flex min-h-0 flex-1 flex-col lg:min-h-0">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={`simulation-upload-card relative flex min-h-[min(52svh,420px)] flex-1 flex-col overflow-hidden rounded-2xl border-2 transition-colors lg:min-h-0 lg:rounded-3xl ${
              imagePreviewUrl
                ? "border-[var(--color-accent)]/40 bg-zinc-950/90"
                : "items-center justify-center gap-4 border-dashed border-[var(--color-text)]/20 bg-[var(--color-bg)]/60 px-6 py-10"
            }`}
          >
            {imagePreviewUrl ? (
              <Image
                src={imagePreviewUrl}
                alt={t("uploadPreviewAlt")}
                fill
                unoptimized
                className="object-contain"
                sizes="(min-width: 1024px) 58vw, 100vw"
                priority
              />
            ) : (
              <p className="max-w-sm text-center text-[var(--color-text)]/75 lg:text-lg">
                {t("dropzoneHint")}
              </p>
            )}

            <div
              className={`simulation-upload-actions flex flex-wrap items-center justify-center gap-2 ${
                imagePreviewUrl
                  ? "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-4 pt-12"
                  : ""
              }`}
            >
              {imagePreviewUrl ? (
                <>
                  <button
                    type="button"
                    disabled={!canSubmit || phase !== "form"}
                    onClick={() => void generate()}
                    className={generateButtonClass}
                  >
                    {phase === "generating" ? t("generating") : t("generateButton")}
                  </button>
                  {generateDisabledReason && phase === "form" ? (
                    <p className="basis-full text-center text-xs font-medium text-white/80">
                      {t(generateDisabledReason)}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreviewUrl((prev) => {
                        if (prev?.startsWith("blob:"))
                          URL.revokeObjectURL(prev);
                        return null;
                      });
                    }}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-none border border-white/30 bg-transparent px-5 text-sm font-semibold text-white backdrop-blur-sm transition-[background-color,border-color] hover:border-white hover:bg-white/12"
                  >
                    {t("clearImage")}
                  </button>
                </>
              ) : (
                <>
                  <label
                    htmlFor={fileInputId}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-bg)] shadow-md"
                  >
                    {t("uploadButton")}
                  </label>
                  <input
                    id={fileInputId}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    className="sr-only"
                    onChange={onFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => void startCamera()}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--color-text)]/25 bg-[var(--color-bg)]/95 px-5 text-sm font-semibold text-[var(--color-text)] backdrop-blur-sm"
                  >
                    {t("openCamera")}
                  </button>
                </>
              )}
            </div>
            {phase === "generating" ? (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/72 px-6 text-center text-white backdrop-blur-sm">
                <div
                  className="size-12 animate-spin rounded-full border-2 border-white/20 border-t-white"
                  aria-hidden
                />
                <div>
                  <p className="text-base font-semibold">{t("generating")}</p>
                  <p className="mt-1 text-sm text-white/75">
                    {t("generatingHint")}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {cameraError ? (
            <p className="simulation-field-note mt-2 text-sm text-red-600">{t("cameraUnavailable")}</p>
          ) : null}
        </div>
      )}
    </section>
  );

  if (phase === "result" && beforeSrc && afterSrc) {
    return (
      <SimulationResultView
        beforeSrc={beforeSrc}
        afterSrc={afterSrc}
        onBack={resetToForm}
        t={t}
        tProjects={tProjects}
      />
    );
  }

  return (
    <div
      className="simulation-page flex min-h-[100dvh] flex-col overflow-visible pt-16 md:h-[100dvh] md:overflow-hidden"
      style={pageBgStyle}
    >
      <header className="simulation-hero shrink-0 border-b border-[color-mix(in_oklab,var(--color-text)_10%,transparent)] px-4 py-3 sm:px-6">
        <div
          className="simulation-hero-inner mx-auto flex max-w-[1600px] flex-col items-center gap-1.5 text-center"
          dir={controlsDir}
        >
          <h1 className="simulation-hero-title text-2xl font-semibold text-[var(--color-text)] sm:text-3xl lg:text-[1.65rem] lg:leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="simulation-hero-lead flex max-w-[min(100%,52rem)] flex-wrap items-center justify-center gap-x-2 text-sm leading-snug text-[var(--color-text)]/75 lg:flex-nowrap">
            <span className="simulation-hero-lead-full">
              {t("heroSubtitlePrefix")}
            </span>
            <span className="simulation-hero-lead-short">
              {t("heroSubtitleShort")}
            </span>
            <Link
              href="/contact"
              className="simulation-hero-contact inline-flex min-h-[2rem] shrink-0 items-center justify-center border border-white/70 bg-transparent px-4 text-sm font-medium text-white transition-[background-color,border-color] hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("heroContactCta")}
            </Link>
          </p>
        </div>
      </header>

      {(remaining === 0 && !quotaLoading) || errorKey ? (
        <div className="simulation-alerts mx-auto w-full max-w-[1600px] shrink-0 space-y-2 px-4 pt-2 sm:px-6">
          {remaining === 0 && !quotaLoading ? (
            <p
              role="alert"
              className="rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-bg)]/90 px-4 py-2 text-center text-sm text-[var(--color-text)]"
            >
              {t("quotaExceeded")}
            </p>
          ) : null}
          {errorKey ? (
            <p
              role="alert"
              className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-center text-sm text-[var(--color-text)]"
            >
              {t(`errors.${errorKey}`)}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        dir="ltr"
        className="simulation-mobile-flow mx-auto grid min-h-0 w-full max-w-[1600px] flex-1 grid-cols-1 gap-4 overflow-visible px-4 py-3 sm:px-6 max-lg:auto-rows-min md:overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)] lg:gap-6 lg:py-4"
      >
        {imagePanel}

        <aside
          dir={controlsDir}
          className="simulation-controls flex min-h-0 max-h-[min(42svh,480px)] flex-col gap-3 max-lg:shrink-0 lg:max-h-none lg:h-full"
        >
          <p className="simulation-controls-title shrink-0 text-base font-semibold text-[var(--color-text)] sm:text-lg">
            {t("instructionsTitle")}
          </p>
          <div className="simulation-room-type-block shrink-0 space-y-3">
            <fieldset className="space-y-2">
              <legend className="sr-only">
                {t("roomTypeLabel")}
              </legend>
              <div
                className="simulation-room-type-grid grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
                role="radiogroup"
                aria-label={t("roomTypeLabel")}
              >
                {SIMULATION_ROOM_TYPE_IDS.map((id) => {
                  const selected = roomType === id;
                  const labelKey =
                    id === "living-room"
                      ? "roomTypeLivingRoom"
                      : id === "bedroom"
                        ? "roomTypeBedroom"
                        : id === "kitchen"
                          ? "roomTypeKitchen"
                          : "roomTypeBathroom";
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setRoomType(id)}
                      className={`simulation-room-type-button inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[0.28rem] border px-3 py-2 text-xs font-semibold shadow-[inset_0_1px_0_rgb(255_255_255/_0.05)] transition-[background-color,border-color,color,box-shadow] sm:text-sm ${
                        selected
                          ? "border-[#c4a574] bg-gradient-to-b from-[#e8d9c4] to-[#c4a574] text-[#17120b] shadow-[0_0_18px_rgb(196_165_116/_0.2),inset_0_1px_0_rgb(255_255_255/_0.38)]"
                          : "border-white/10 bg-[#171717]/90 text-white/88 hover:border-[#c4a574]/45 hover:text-[#c4a574]"
                      }`}
                    >
                      <RoomTypeIcon
                        id={id}
                        className={`size-4 shrink-0 ${selected ? "text-[#17120b]" : "text-[#c4a574]"}`}
                      />
                      {t(labelKey)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="simulation-style-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pe-1">
            <div className="simulation-style-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {INTERIOR_STYLES.map((style) => {
                const selected = selectedStyleSlug === style.slug;
                const styleSrc = buildStyleImageSrc(
                  style.slug,
                  styleCardIsDesktop,
                  scene,
                );
                return (
                  <button
                    key={style.slug}
                    type="button"
                    onClick={() =>
                      setSelectedStyleSlug((prev) =>
                        prev === style.slug ? null : style.slug,
                      )
                    }
                    aria-pressed={selected}
                    className={`simulation-style-card group relative aspect-[16/10] w-full overflow-hidden rounded-xl text-start shadow-sm transition-[box-shadow,transform] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                      selected
                        ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg)]"
                        : "ring-1 ring-[color-mix(in_oklab,var(--color-text)_18%,transparent)]"
                    }`}
                  >
                    <Image
                      src={styleSrc}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 1280px) 280px, (min-width: 1024px) 360px, 45vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
                      aria-hidden
                    />
                    <div
                      className={`pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-3.5 ${
                        selected ? "bg-[var(--color-accent)]/25" : ""
                      }`}
                    >
                      <span className="block text-sm font-semibold leading-snug text-white drop-shadow-sm">
                        {style.title}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-white/85">
                        {style.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="simulation-mobile-generate">
            <button
              type="button"
              disabled={!canSubmit || phase !== "form"}
              onClick={() => void generate()}
              className={generateButtonClass}
            >
              {phase === "generating" ? t("generating") : t("generateButton")}
            </button>
            {generateDisabledReason && phase === "form" ? (
              <p className="simulation-mobile-generate__hint">
                {t(generateDisabledReason)}
              </p>
            ) : null}
          </div>

        </aside>
      </div>
    </div>
  );
}

function SimulationResultView({
  beforeSrc,
  afterSrc,
  onBack,
  t,
  tProjects,
}: {
  beforeSrc: string;
  afterSrc: string;
  onBack: () => void;
  t: ReturnType<typeof useTranslations<"Simulation">>;
  tProjects: ReturnType<typeof useTranslations<"Projects">>;
}) {
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    setImagesReady(false);
  }, [beforeSrc, afterSrc]);

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-black pt-16">
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white"
        >
          {t("backToForm")}
        </button>
      </div>
      <div className="relative min-h-0 flex-1 px-3 pb-3 lg:px-5">
        {!imagesReady ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
            <div
              className="size-12 animate-spin rounded-full border-2 border-white/20 border-t-white"
              aria-hidden
            />
            <div>
              <p className="text-base font-semibold">{t("generating")}</p>
              <p className="mt-1 text-sm text-white/75">{t("generatingHint")}</p>
            </div>
          </div>
        ) : null}
        <BeforeAfterSlider
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          title={t("resultTitle")}
          beforeLabel={tProjects("beforeLabel")}
          afterLabel={tProjects("afterLabel")}
          sliderAriaLabel={tProjects("sliderAriaLabel", {
            title: t("resultTitle"),
          })}
          onImagesReady={() => setImagesReady(true)}
          priority
          fillHeight
          imageObjectFit="contain"
          className={`h-full min-h-0 ${imagesReady ? "" : "invisible"}`}
          sizes="100vw"
        />
      </div>

    </div>
  );
}

