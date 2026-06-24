import {
  getOpenAIApiKey,
  getOpenAIImageQuality,
  getOpenAIImageSize,
  getOpenAIOutputFormat,
  getOpenAISimulationModel,
} from "@/lib/simulation-config";

type OpenAIImageEditResponse = {
  data?: Array<{
    b64_json?: string;
    url?: string;
  }>;
  error?: {
    message?: string;
  };
};

export type OpenAIInteriorDesignOptions = {
  negativePrompt: string;
};

function imageMimeFromOutputFormat(format: string): string {
  if (format === "jpeg" || format === "jpg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  return "image/png";
}

export function buildOpenAIInputPreview(
  image: File,
  prompt: string,
  options: OpenAIInteriorDesignOptions,
): Record<string, unknown> {
  return {
    image: `[file, ${image.size} bytes, type: ${image.type || "unknown"}]`,
    prompt,
    negative_prompt: options.negativePrompt,
    model: getOpenAISimulationModel(),
    size: getOpenAIImageSize(),
    quality: getOpenAIImageQuality(),
    output_format: getOpenAIOutputFormat(),
  };
}

export async function runOpenAIInteriorDesign(
  image: File,
  prompt: string,
  options: OpenAIInteriorDesignOptions,
): Promise<string> {
  const token = getOpenAIApiKey();
  if (!token) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = getOpenAISimulationModel();
  const outputFormat = getOpenAIOutputFormat();
  const formData = new FormData();
  formData.append("model", model);
  formData.append("image", image, image.name || "room-image");
  formData.append(
    "prompt",
    [
      prompt,
      "Avoid these unwanted artifacts:",
      options.negativePrompt,
    ].join("\n\n"),
  );
  formData.append("n", "1");
  formData.append("size", getOpenAIImageSize());
  formData.append("quality", getOpenAIImageQuality());
  formData.append("output_format", outputFormat);

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const body = (await res.json()) as OpenAIImageEditResponse;
  if (!res.ok) {
    throw new Error(
      body.error?.message ?? `OpenAI image edit failed: ${res.status}`,
    );
  }

  const first = body.data?.[0];
  if (first?.b64_json) {
    return `data:${imageMimeFromOutputFormat(outputFormat)};base64,${first.b64_json}`;
  }
  if (first?.url) {
    return first.url;
  }

  throw new Error("OpenAI returned no image");
}
