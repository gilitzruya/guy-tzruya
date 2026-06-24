import { NextResponse } from "next/server";
import {
  buildSimulationNegativePrompt,
  buildSimulationPrompt,
} from "@/lib/simulation-prompt";
import { hasSimulationStyleSlug } from "@/lib/simulation-prompts-matrix";
import {
  bufferToDataUri,
  buildReplicateInputPreview,
  runReplicateInteriorDesign,
} from "@/lib/simulation-replicate";
import {
  buildOpenAIInputPreview,
  runOpenAIInteriorDesign,
} from "@/lib/simulation-openai";
import {
  SIMULATION_MAX_FILE_BYTES,
  getOpenAISimulationModel,
  getReplicateModel,
  isAllowedSimulationMime,
  isSimulationCompareEnabled,
} from "@/lib/simulation-config";
import { parseSimulationRoomType } from "@/lib/simulation-room-types";

type CompareProviderResult = {
  provider: "replicate" | "openai";
  model: string;
  ok: boolean;
  durationMs: number;
  imageUrl?: string;
  error?: string;
  prompt: string;
  negativePrompt: string;
  inputPreview: Record<string, unknown>;
};

async function measureProvider(
  provider: CompareProviderResult["provider"],
  model: string,
  prompt: string,
  negativePrompt: string,
  inputPreview: Record<string, unknown>,
  run: () => Promise<string>,
): Promise<CompareProviderResult> {
  const startedAt = Date.now();
  try {
    const imageUrl = await run();
    return {
      provider,
      model,
      ok: true,
      durationMs: Date.now() - startedAt,
      imageUrl,
      prompt,
      negativePrompt,
      inputPreview,
    };
  } catch (err) {
    return {
      provider,
      model,
      ok: false,
      durationMs: Date.now() - startedAt,
      error: err instanceof Error ? err.message : "generation_failed",
      prompt,
      negativePrompt,
      inputPreview,
    };
  }
}

export async function POST(request: Request) {
  if (!isSimulationCompareEnabled()) {
    return NextResponse.json({ error: "compare_disabled" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const imageEntry = formData.get("image");
  if (!(imageEntry instanceof File) || imageEntry.size === 0) {
    return NextResponse.json({ error: "missing_image" }, { status: 400 });
  }

  if (imageEntry.size > SIMULATION_MAX_FILE_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const mime = imageEntry.type || "application/octet-stream";
  if (!isAllowedSimulationMime(mime)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  const styleSlugRaw = formData.get("styleSlug");
  const styleSlug =
    typeof styleSlugRaw === "string" && styleSlugRaw.trim()
      ? styleSlugRaw.trim()
      : null;

  if (!styleSlug || !hasSimulationStyleSlug(styleSlug)) {
    return NextResponse.json({ error: "missing_style" }, { status: 400 });
  }

  const roomType = parseSimulationRoomType(formData.get("roomType"));

  let prompt: string;
  try {
    prompt = buildSimulationPrompt(styleSlug, roomType);
  } catch {
    return NextResponse.json({ error: "missing_prompt" }, { status: 400 });
  }

  const negativePrompt = buildSimulationNegativePrompt();
  const buffer = Buffer.from(await imageEntry.arrayBuffer());
  const beforeImageUrl = await bufferToDataUri(buffer, mime);
  const replicateModel = getReplicateModel();
  const openAIModel = getOpenAISimulationModel();

  const [replicate, openai] = await Promise.all([
    measureProvider(
      "replicate",
      replicateModel,
      prompt,
      negativePrompt,
      buildReplicateInputPreview(beforeImageUrl, prompt, { negativePrompt }),
      () =>
        runReplicateInteriorDesign(beforeImageUrl, prompt, {
          negativePrompt,
        }),
    ),
    measureProvider(
      "openai",
      openAIModel,
      prompt,
      negativePrompt,
      buildOpenAIInputPreview(imageEntry, prompt, { negativePrompt }),
      () =>
        runOpenAIInteriorDesign(imageEntry, prompt, {
          negativePrompt,
        }),
    ),
  ]);

  return NextResponse.json({
    beforeImageUrl,
    styleSlug,
    roomType,
    prompt,
    negativePrompt,
    results: {
      replicate,
      openai,
    },
  });
}
