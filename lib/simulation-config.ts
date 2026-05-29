export const SIMULATION_COOKIE_NAME = "gt-simulation-count";

/** 30 days */
export const SIMULATION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const SIMULATION_MAX_FILE_BYTES = 8 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function getSimulationMaxActivations(): number {
  const raw = process.env.SIMULATION_MAX_ACTIVATIONS;
  const n = raw ? Number.parseInt(raw, 10) : 3;
  return Number.isFinite(n) && n > 0 ? n : 3;
}

export function isSimulationMock(): boolean {
  return process.env.SIMULATION_MOCK?.toLowerCase() === "true";
}

export function getReplicateApiToken(): string | undefined {
  const token = process.env.REPLICATE_API_TOKEN?.trim();
  return token || undefined;
}

export function getReplicateModel(): string {
  const model = process.env.REPLICATE_MODEL?.trim();
  return model || "adirik/interior-design";
}

export function isAllowedSimulationMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime);
}

function parseEnvFloat(
  key: string,
  fallback: number,
  min: number,
  max: number,
): number {
  const raw = process.env[key]?.trim();
  if (!raw) return fallback;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** Default 13: enough prompt weight for volumetric furniture without texture burn at 15. */
export function getSimulationGuidanceScale(): number {
  return parseEnvFloat("SIMULATION_GUIDANCE_SCALE", 13, 1, 50);
}

/**
 * Inpainting strength for adirik/interior-design.
 * Verified via Replicate OpenAPI: only `prompt_strength` exists (no controlnet_scale /
 * condition_scale). Default 0.75 places furniture on empty floors while preserving niches.
 */
export function getSimulationPromptStrength(): number {
  return parseEnvFloat("SIMULATION_PROMPT_STRENGTH", 0.75, 0, 1);
}

export function getSimulationInferenceSteps(): number {
  const raw = process.env.SIMULATION_INFERENCE_STEPS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 40;
  if (!Number.isFinite(n)) return 40;
  return Math.min(500, Math.max(1, n));
}
