import {
  SIMULATION_PROMPTS_MATRIX,
  type SimulationRoomTypeId,
  type SimulationStyleSlug,
} from "@/lib/simulation-prompts-matrix";

const DEFAULT_NEGATIVE =
  "lowres, watermark, banner, logo, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic";

export function buildSimulationNegativePrompt(): string {
  return DEFAULT_NEGATIVE;
}

export function buildSimulationPrompt(
  styleSlug: SimulationStyleSlug,
  roomType: SimulationRoomTypeId,
): string {
  const prompt = SIMULATION_PROMPTS_MATRIX[roomType]?.[styleSlug];
  if (!prompt) {
    throw new Error(
      `[PromptMatrix] Combination not found for ${roomType} and ${styleSlug}`,
    );
  }
  return prompt;
}
