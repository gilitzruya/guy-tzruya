import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildSimulationApiDebug } from "@/lib/simulation-api-debug";
import {
  buildSimulationNegativePrompt,
  buildSimulationPrompt,
} from "@/lib/simulation-prompt";
import { hasSimulationStyleSlug } from "@/lib/simulation-prompts-matrix";
import {
  bufferToDataUri,
  runReplicateInteriorDesign,
} from "@/lib/simulation-replicate";
import {
  SIMULATION_COOKIE_NAME,
  SIMULATION_MAX_FILE_BYTES,
  getSimulationMaxActivations,
  isAllowedSimulationMime,
  isSimulationMock,
} from "@/lib/simulation-config";
import { parseSimulationRoomType } from "@/lib/simulation-room-types";
import {
  buildQuota,
  canGenerate,
  getQuotaFromCookieValue,
  parseUsageCount,
  simulationCookieOptions,
} from "@/lib/simulation-usage";

export async function POST(request: Request) {
  const jar = await cookies();
  const currentValue = jar.get(SIMULATION_COOKIE_NAME)?.value;
  const quota = getQuotaFromCookieValue(currentValue);

  if (!canGenerate(quota)) {
    return NextResponse.json(
      { error: "quota_exceeded", ...quota },
      { status: 429 },
    );
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
  const beforeDataUri = await bufferToDataUri(buffer, mime);

  const apiDebug = buildSimulationApiDebug(
    beforeDataUri,
    prompt,
    negativePrompt,
    styleSlug,
    roomType,
  );

  let afterImageUrl: string;

  try {
    if (isSimulationMock()) {
      afterImageUrl = beforeDataUri;
    } else {
      afterImageUrl = await runReplicateInteriorDesign(beforeDataUri, prompt, {
        negativePrompt,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "generation_failed";
    return NextResponse.json(
      { error: "generation_failed", message, debug: apiDebug },
      { status: 502 },
    );
  }

  const used = parseUsageCount(currentValue) + 1;
  const nextQuota = buildQuota(used);

  const res = NextResponse.json({
    afterImageUrl,
    beforeImageUrl: beforeDataUri,
    remaining: nextQuota.remaining,
    used: nextQuota.used,
    max: getSimulationMaxActivations(),
    debug: apiDebug,
  });

  res.cookies.set(simulationCookieOptions(used));
  return res;
}
