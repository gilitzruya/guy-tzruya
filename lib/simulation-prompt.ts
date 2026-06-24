import {
  type SimulationRoomTypeId,
  type SimulationStyleSlug,
} from "@/lib/simulation-prompts-matrix";

const DEFAULT_NEGATIVE =
  "lowres, watermark, banner, logo, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic";

const ROOM_PROMPTS: Record<SimulationRoomTypeId, string> = {
  "living-room":
    "Make the room function clearly as a living room with a balanced sofa arrangement, coffee table, soft textiles, storage, and a comfortable conversation area.",
  bedroom:
    "Make the room function clearly as a bedroom with a well-proportioned bed, bedside lighting, calm textiles, storage, and a restful composition.",
  kitchen:
    "Make the room function clearly as a kitchen with coherent cabinetry, countertop surfaces, appliances, practical lighting, and refined material continuity.",
  bathroom:
    "Make the room function clearly as a bathroom with a vanity, fixtures, water-resistant finishes, mirror lighting, storage, and a clean spa-like arrangement.",
};

const STYLE_PROMPTS: Record<SimulationStyleSlug, string> = {
  "modern-minimalist":
    "Use a modern minimalist language: clean lines, open space, restrained palette, stone or glass accents, hidden storage, and uncluttered luxury.",
  "rustic-country":
    "Use a rustic country language: warm natural wood, stone textures, woven textiles, handmade details, earthy tones, and a welcoming home atmosphere.",
  "organic-natural":
    "Use an organic natural language: biophilic details, plants, rattan or linen, soft curves, natural stone and wood, and calm earth tones.",
  industrial:
    "Use an industrial language: concrete, blackened metal, exposed brick or structural texture, leather accents, robust lighting, and a muted urban palette.",
  "high-tech-smart-home":
    "Use a high-tech smart home language: integrated screens or controls, dark premium surfaces, concealed lighting, subtle neon accents, and cinematic mood.",
  "modern-office":
    "Use a modern office language: ergonomic planning, acoustic surfaces, collaboration areas, clean storage, greenery, and bright professional lighting.",
};

export function buildSimulationNegativePrompt(): string {
  return DEFAULT_NEGATIVE;
}

export function buildSimulationPrompt(
  styleSlug: SimulationStyleSlug,
  roomType: SimulationRoomTypeId,
): string {
  const roomPrompt = ROOM_PROMPTS[roomType];
  const stylePrompt = STYLE_PROMPTS[styleSlug];
  if (!roomPrompt || !stylePrompt) {
    throw new Error(
      `[SimulationPrompt] Combination not found for ${roomType} and ${styleSlug}`,
    );
  }

  return [
    "Create a realistic interior design visualization from the uploaded room photo.",
    "Preserve the original camera angle, walls, windows, doors, ceiling, floor geometry, built-in openings, and room proportions.",
    roomPrompt,
    stylePrompt,
    "Add coherent furniture, materials, lighting, decor, and spatial depth.",
    "The result should look like professional interior photography with realistic textures, natural perspective, and no text or watermarks.",
  ].join(" ");
}
