import https from "node:https";
import {
  getReplicateApiToken,
  getReplicateModel,
  getSimulationGuidanceScale,
  getSimulationInferenceSteps,
  getSimulationPromptStrength,
} from "@/lib/simulation-config";

type ReplicatePrediction = {
  id?: string;
  status?: string;
  output?: unknown;
  error?: string | null;
  urls?: { get?: string };
};

type ReplicateModelMeta = {
  latest_version?: { id?: string };
};

type HttpResult = {
  ok: boolean;
  status: number;
  body: string;
};

function isTlsChainError(err: unknown): boolean {
  const cause = (err as { cause?: { code?: string } })?.cause;
  const code = cause?.code;
  return (
    code === "SELF_SIGNED_CERT_IN_CHAIN" ||
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
  );
}

function httpsRequest(
  url: string,
  init: RequestInit,
  insecure: boolean,
): Promise<HttpResult> {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const method = init.method ?? "GET";
    const headerInit = init.headers;
    const headers: Record<string, string> = {};
    if (headerInit instanceof Headers) {
      headerInit.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (headerInit) {
      Object.assign(headers, headerInit as Record<string, string>);
    }

    const bodyStr = typeof init.body === "string" ? init.body : undefined;
    if (bodyStr) {
      headers["Content-Length"] = String(Buffer.byteLength(bodyStr));
    }

    const req = https.request(
      {
        hostname: target.hostname,
        port: target.port ? Number(target.port) : 443,
        path: `${target.pathname}${target.search}`,
        method,
        headers,
        rejectUnauthorized: !insecure,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk: Buffer | string) => {
          body += chunk.toString();
        });
        res.on("end", () => {
          const status = res.statusCode ?? 0;
          resolve({
            ok: status >= 200 && status < 300,
            status,
            body,
          });
        });
      },
    );

    req.on("error", reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function replicateFetch(
  url: string,
  init: RequestInit,
): Promise<HttpResult> {
  if (process.env.REPLICATE_TLS_INSECURE === "true") {
    return httpsRequest(url, init, true);
  }

  try {
    const res = await fetch(url, init);
    return {
      ok: res.ok,
      status: res.status,
      body: await res.text(),
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development" && isTlsChainError(err)) {
      return httpsRequest(url, init, true);
    }
    throw err;
  }
}

function extractOutputUrl(output: unknown): string | null {
  if (typeof output === "string" && output.startsWith("http")) return output;
  if (Array.isArray(output)) {
    for (const item of output) {
      if (typeof item === "string" && item.startsWith("http")) return item;
    }
  }
  return null;
}

async function resolveReplicateVersion(
  model: string,
  token: string,
): Promise<string> {
  if (model.includes(":") || /^[a-f0-9]{64}$/i.test(model)) {
    return model;
  }

  const slash = model.indexOf("/");
  if (slash === -1) {
    throw new Error(`Invalid REPLICATE_MODEL: ${model}`);
  }

  const owner = model.slice(0, slash);
  const name = model.slice(slash + 1);
  const res = await replicateFetch(
    `https://api.replicate.com/v1/models/${owner}/${name}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Replicate model lookup failed: ${res.status} ${res.body}`);
  }

  const meta = JSON.parse(res.body) as ReplicateModelMeta;
  const versionId = meta.latest_version?.id;
  if (!versionId) {
    throw new Error(`No latest_version for ${owner}/${name}`);
  }

  return `${owner}/${name}:${versionId}`;
}

async function pollPrediction(
  getUrl: string,
  token: string,
  maxAttempts = 90,
): Promise<ReplicatePrediction> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await replicateFetch(getUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Replicate poll failed: ${res.status}`);
    }
    const data = JSON.parse(res.body) as ReplicatePrediction;
    if (data.status === "succeeded") return data;
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(data.error ?? "Replicate prediction failed");
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Replicate prediction timed out");
}

export type ReplicateInteriorDesignOptions = {
  negativePrompt: string;
};

/** Preview of Replicate `input` (image truncated) for temporary debug UI. */
export function buildReplicateInputPreview(
  imageDataUri: string,
  prompt: string,
  options: ReplicateInteriorDesignOptions,
): Record<string, unknown> {
  return {
    image: `[data URI, ${imageDataUri.length} chars, mime prefix: ${imageDataUri.slice(0, 30)}…]`,
    prompt,
    negative_prompt: options.negativePrompt,
    num_inference_steps: getSimulationInferenceSteps(),
    guidance_scale: getSimulationGuidanceScale(),
    prompt_strength: getSimulationPromptStrength(),
  };
}

export async function runReplicateInteriorDesign(
  imageDataUri: string,
  prompt: string,
  options: ReplicateInteriorDesignOptions,
): Promise<string> {
  const token = getReplicateApiToken();
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN is not configured");
  }

  const model = getReplicateModel();
  const version = await resolveReplicateVersion(model, token);
  const input = buildReplicateInputPreview(imageDataUri, prompt, options);
  const createRes = await replicateFetch(
    "https://api.replicate.com/v1/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({
        version,
        input: {
          ...input,
          image: imageDataUri,
        },
      }),
    },
  );

  if (!createRes.ok) {
    throw new Error(
      `Replicate create failed: ${createRes.status} ${createRes.body}`,
    );
  }

  let prediction = JSON.parse(createRes.body) as ReplicatePrediction;

  if (
    prediction.status !== "succeeded" &&
    prediction.status !== "failed" &&
    prediction.urls?.get
  ) {
    prediction = await pollPrediction(prediction.urls.get, token);
  }

  if (prediction.status === "failed") {
    throw new Error(prediction.error ?? "Replicate prediction failed");
  }

  const url = extractOutputUrl(prediction.output);
  if (!url) {
    throw new Error("Replicate returned no image URL");
  }

  return url;
}

export async function bufferToDataUri(
  buffer: Buffer,
  mime: string,
): Promise<string> {
  const base64 = buffer.toString("base64");
  return `data:${mime};base64,${base64}`;
}
