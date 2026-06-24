"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useId, useState } from "react";
import { INTERIOR_STYLES } from "@/components/interior-design-content";
import { useScene } from "@/components/scene-provider";
import { interiorDesignPageBackgroundStyle } from "@/lib/interior-page-background";
import {
  SIMULATION_ROOM_TYPE_IDS,
  type SimulationRoomTypeId,
} from "@/lib/simulation-room-types";
import { SIMULATION_MAX_FILE_BYTES } from "@/lib/simulation-config";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ProviderName = "replicate" | "openai";

type CompareProviderResult = {
  provider: ProviderName;
  model: string;
  ok: boolean;
  durationMs: number;
  imageUrl?: string;
  error?: string;
  prompt: string;
  negativePrompt: string;
  inputPreview: Record<string, unknown>;
};

type CompareResponse = {
  beforeImageUrl?: string;
  prompt?: string;
  negativePrompt?: string;
  error?: string;
  results?: Record<ProviderName, CompareProviderResult>;
};

type Copy = {
  title: string;
  subtitle: string;
  upload: string;
  chooseImage: string;
  clearImage: string;
  roomType: string;
  style: string;
  compare: string;
  comparing: string;
  source: string;
  prompt: string;
  negativePrompt: string;
  inputPreview: string;
  duration: string;
  error: string;
  rating: string;
  disabledHint: string;
  invalidType: string;
  fileTooLarge: string;
  providers: Record<ProviderName, string>;
  rooms: Record<SimulationRoomTypeId, string>;
};

const COPY: Record<"he" | "en", Copy> = {
  he: {
    title: "השוואת ספקי הדמיה",
    subtitle:
      "כלי פנימי זמני להרצת אותה תמונה ואותו פרומפט מול Replicate ו-OpenAI.",
    upload: "תמונת מקור",
    chooseImage: "בחירת תמונה",
    clearImage: "הסרת תמונה",
    roomType: "סוג חדר",
    style: "סגנון",
    compare: "הרצת השוואה",
    comparing: "מריצים השוואה...",
    source: "מקור",
    prompt: "Prompt שנשלח",
    negativePrompt: "Negative prompt",
    inputPreview: "Input preview",
    duration: "זמן ריצה",
    error: "שגיאה",
    rating: "דירוג ידני",
    disabledHint: "בחרו תמונה, סוג חדר וסגנון כדי להריץ השוואה.",
    invalidType: "סוג קובץ לא נתמך. השתמשו ב-JPEG, PNG או WebP.",
    fileTooLarge: "הקובץ גדול מדי (מקסימום 4MB).",
    providers: {
      replicate: "Replicate",
      openai: "OpenAI",
    },
    rooms: {
      "living-room": "סלון",
      bedroom: "חדר שינה",
      kitchen: "מטבח",
      bathroom: "מקלחת",
    },
  },
  en: {
    title: "Simulation Provider Compare",
    subtitle:
      "Internal temporary tool for running the same image and prompt through Replicate and OpenAI.",
    upload: "Source image",
    chooseImage: "Choose image",
    clearImage: "Remove image",
    roomType: "Room type",
    style: "Style",
    compare: "Run comparison",
    comparing: "Comparing...",
    source: "Source",
    prompt: "Prompt sent",
    negativePrompt: "Negative prompt",
    inputPreview: "Input preview",
    duration: "Duration",
    error: "Error",
    rating: "Manual rating",
    disabledHint: "Choose an image, room type, and style to run a comparison.",
    invalidType: "Unsupported file type. Use JPEG, PNG, or WebP.",
    fileTooLarge: "File is too large (max 4MB).",
    providers: {
      replicate: "Replicate",
      openai: "OpenAI",
    },
    rooms: {
      "living-room": "Living room",
      bedroom: "Bedroom",
      kitchen: "Kitchen",
      bathroom: "Bathroom",
    },
  },
};

function isValidImageFile(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type);
}

function isFileTooLarge(file: File): boolean {
  return file.size > SIMULATION_MAX_FILE_BYTES;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function ProviderResultCard({
  result,
  copy,
  rating,
  onRatingChange,
}: {
  result: CompareProviderResult;
  copy: Copy;
  rating: number | null;
  onRatingChange: (rating: number) => void;
}) {
  return (
    <article className="flex min-h-0 flex-col gap-4 rounded-3xl border border-white/10 bg-black/42 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {copy.providers[result.provider]}
          </h2>
          <p className="mt-1 text-xs text-white/60">{result.model}</p>
        </div>
        <p className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/75">
          {copy.duration}: {formatDuration(result.durationMs)}
        </p>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        {result.imageUrl ? (
          <Image
            src={result.imageUrl}
            alt={`${copy.providers[result.provider]} result`}
            fill
            unoptimized
            className="object-contain"
            sizes="(min-width: 1024px) 44vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-red-200">
            {result.error ?? copy.error}
          </div>
        )}
      </div>

      {!result.ok && result.error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {copy.error}: {result.error}
        </p>
      ) : null}

      <div>
        <p className="mb-2 text-sm font-semibold text-white">{copy.rating}</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onRatingChange(value)}
              className={`size-9 rounded-full border text-sm font-semibold transition-colors ${
                rating === value
                  ? "border-[#c4a574] bg-[#c4a574] text-black"
                  : "border-white/20 text-white/75 hover:border-[#c4a574] hover:text-[#c4a574]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <summary className="cursor-pointer text-sm font-semibold text-white">
          {copy.prompt}
        </summary>
        <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-black/55 p-3 text-xs leading-relaxed text-white/75">
          {result.prompt}
        </pre>
      </details>

      <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <summary className="cursor-pointer text-sm font-semibold text-white">
          {copy.negativePrompt}
        </summary>
        <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-black/55 p-3 text-xs leading-relaxed text-white/75">
          {result.negativePrompt}
        </pre>
      </details>

      <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <summary className="cursor-pointer text-sm font-semibold text-white">
          {copy.inputPreview}
        </summary>
        <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-black/55 p-3 text-xs leading-relaxed text-white/75">
          {JSON.stringify(result.inputPreview, null, 2)}
        </pre>
      </details>
    </article>
  );
}

export function SimulationComparePage() {
  const locale = useLocale();
  const copy = COPY[locale === "he" ? "he" : "en"];
  const { scene } = useScene();
  const fileInputId = useId();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [roomType, setRoomType] =
    useState<SimulationRoomTypeId>("living-room");
  const [selectedStyleSlug, setSelectedStyleSlug] = useState(
    INTERIOR_STYLES[0]?.slug ?? "",
  );
  const [phase, setPhase] = useState<"form" | "comparing">("form");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<CompareResponse | null>(null);
  const [ratings, setRatings] = useState<Record<ProviderName, number | null>>({
    replicate: null,
    openai: null,
  });

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const setFile = (file: File) => {
    if (!isValidImageFile(file)) {
      setError(copy.invalidType);
      return;
    }
    if (isFileTooLarge(file)) {
      setError(copy.fileTooLarge);
      return;
    }
    setError(null);
    setImageFile(file);
    setResponse(null);
    setRatings({ replicate: null, openai: null });
    setImagePreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const canSubmit = Boolean(imageFile && roomType && selectedStyleSlug);

  const runCompare = async () => {
    if (!imageFile || !canSubmit || phase !== "form") return;
    setPhase("comparing");
    setError(null);
    setResponse(null);

    const body = new FormData();
    body.append("image", imageFile);
    body.append("roomType", roomType);
    body.append("styleSlug", selectedStyleSlug);

    try {
      const res = await fetch("/api/simulation/compare", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as CompareResponse;
      if (!res.ok) {
        setError(data.error ?? "compare_failed");
        return;
      }
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "compare_failed");
    } finally {
      setPhase("form");
    }
  };

  const dir = locale === "he" ? "rtl" : "ltr";
  const bgStyle = interiorDesignPageBackgroundStyle(scene);

  return (
    <div
      className="simulation-page min-h-[100dvh] overflow-visible pt-16 text-white"
      style={bgStyle}
      dir={dir}
    >
      <header className="border-b border-white/10 px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-[1600px]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c4a574]">
            Internal QA
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{copy.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/70">
            {copy.subtitle}
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <section className="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{copy.upload}</h2>
            {imageFile ? (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setResponse(null);
                  setImagePreviewUrl((prev) => {
                    if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
                    return null;
                  });
                }}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/75 hover:border-white hover:text-white"
              >
                {copy.clearImage}
              </button>
            ) : null}
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/20 bg-black/45">
            {imagePreviewUrl ? (
              <Image
                src={imagePreviewUrl}
                alt={copy.source}
                fill
                unoptimized
                className="object-contain"
                sizes="(min-width: 1024px) 52vw, 100vw"
                priority
              />
            ) : (
              <label
                htmlFor={fileInputId}
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#c4a574] px-6 py-3 text-sm font-semibold text-black"
              >
                {copy.chooseImage}
              </label>
            )}
          </div>

          <input
            id={fileInputId}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFile(file);
              e.target.value = "";
            }}
          />
        </section>

        <aside className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
          <fieldset>
            <legend className="mb-3 text-lg font-semibold">
              {copy.roomType}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {SIMULATION_ROOM_TYPE_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRoomType(id)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    roomType === id
                      ? "border-[#c4a574] bg-[#c4a574] text-black"
                      : "border-white/15 bg-white/[0.03] text-white/75 hover:border-[#c4a574] hover:text-[#c4a574]"
                  }`}
                >
                  {copy.rooms[id]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-lg font-semibold">{copy.style}</legend>
            <div className="grid gap-2">
              {INTERIOR_STYLES.map((style) => (
                <button
                  key={style.slug}
                  type="button"
                  onClick={() => setSelectedStyleSlug(style.slug)}
                  className={`rounded-2xl border px-4 py-3 text-start transition-colors ${
                    selectedStyleSlug === style.slug
                      ? "border-[#c4a574] bg-[#c4a574] text-black"
                      : "border-white/15 bg-white/[0.03] text-white/75 hover:border-[#c4a574] hover:text-[#c4a574]"
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {style.title}
                  </span>
                  <span className="mt-1 block text-xs opacity-75">
                    {style.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <button
              type="button"
              disabled={!canSubmit || phase === "comparing"}
              onClick={() => void runCompare()}
              className="inline-flex min-h-[46px] w-full items-center justify-center rounded-none border border-white bg-transparent px-5 text-sm font-semibold text-white transition-[background-color,border-color,opacity] hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {phase === "comparing" ? copy.comparing : copy.compare}
            </button>
            {!canSubmit ? (
              <p className="mt-2 text-center text-xs text-white/60">
                {copy.disabledHint}
              </p>
            ) : null}
            {error ? (
              <p className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            ) : null}
          </div>
        </aside>
      </main>

      {response?.results ? (
        <section className="mx-auto grid max-w-[1600px] gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-2">
          <ProviderResultCard
            result={response.results.replicate}
            copy={copy}
            rating={ratings.replicate}
            onRatingChange={(rating) =>
              setRatings((prev) => ({ ...prev, replicate: rating }))
            }
          />
          <ProviderResultCard
            result={response.results.openai}
            copy={copy}
            rating={ratings.openai}
            onRatingChange={(rating) =>
              setRatings((prev) => ({ ...prev, openai: rating }))
            }
          />
        </section>
      ) : null}
    </div>
  );
}
