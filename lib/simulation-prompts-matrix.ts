import { INTERIOR_STYLES } from "@/components/interior-design-content";

export type SimulationRoomTypeId =
  | "living-room"
  | "bedroom"
  | "kitchen"
  | "bathroom";

export type SimulationStyleSlug =
  | "modern-minimalist"
  | "rustic-country"
  | "organic-natural"
  | "industrial"
  | "high-tech-smart-home"
  | "modern-office";

export const SIMULATION_PROMPTS_MATRIX: Record<
  SimulationRoomTypeId,
  Record<SimulationStyleSlug, string>
> = {
  "living-room": {
    "modern-minimalist":
      "Interior photography of a fully furnished modern minimalist living room, featuring a prominent luxury low-profile sofa seating arrangement, minimalist coffee table, uncluttered high-end architectural layout, monochromatic stone finishes.",

    "rustic-country":
      "Interior photography of a cozy furnished rustic country living room, staged architectural layout with a heavy solid wood sofa, woven textiles, raw wood grain accents, farmhouse charm.",

    "organic-natural":
      "Interior photography of a furnished organic natural living room, linen sofa, woven rattan accents, lush indoor plants, natural stone textures, calming earth tones.",

    industrial:
      "Interior photography of a furnished industrial loft living room, leather sofa, metal coffee table, exposed brick texture, weathered steel accents, muted urban palette.",

    "high-tech-smart-home":
      "Interior photography of a cinematic moody smart home living room, giant wall-mounted OLED screen display, futuristic dark seating, stealth spaceship command center surfaces, neon status lights.",

    "modern-office":
      "Interior photography of a furnished modern office lounge, modular sofas, collaboration tables, acoustic wall panels, greenery accents, bright productive daylight.",
  },

  bedroom: {
    "modern-minimalist":
      "Interior photography of a furnished minimalist bedroom, low platform bed, streamlined wardrobe, clean straight lines, monochromatic linens, calm uncluttered luxury.",

    "rustic-country":
      "Interior photography of a furnished rustic bedroom, wooden bed frame, cozy quilted textiles, raw wood grain nightstands, farmhouse warmth, earthy tones.",

    "organic-natural":
      "Interior photography of a furnished biophilic bedroom, low bed with linen bedding, woven baskets, indoor greenery, natural stone and wood textures.",

    industrial:
      "Interior photography of a furnished industrial bedroom, metal bed frame, leather bench, aged brick accent wall texture, weathered metal lighting, muted tones.",

    "high-tech-smart-home":
      "Interior photography of a dark futuristic smart home bedroom, integrated cybernetic headboard panels, glowing neon ambient lines, tech console, moody cinematic lighting.",

    "modern-office":
      "Interior photography of a furnished modern studio bedroom, ergonomic bed nook, compact work desk, acoustic panel textures, bright productive daylight.",
  },

  kitchen: {
    "modern-minimalist":
      "Interior photography of a furnished minimalist kitchen, flat-panel cabinetry, integrated appliances, stone countertops, clean straight lines, monochromatic luxury finishes.",

    "rustic-country":
      "Interior photography of a furnished rustic kitchen, wooden cabinetry, farmhouse sink, raw wood grain open shelves, copper accents, warm earthy palette.",

    "organic-natural":
      "Interior photography of a furnished organic kitchen, light wood cabinets, stone counters, herb planters, woven storage baskets, natural earth-tone palette.",

    industrial:
      "Interior photography of a furnished industrial kitchen, metal shelving, concrete counters, aged brick backsplash, stainless appliances, muted urban palette.",

    "high-tech-smart-home":
      "Interior photography of a dark futuristic smart kitchen, matte black cabinetry, integrated touch displays, neon under-cabinet glow, premium appliances, moody cinematic lighting.",

    "modern-office":
      "Interior photography of a furnished office pantry kitchen, sleek cabinetry, coffee station, ergonomic bar seating, bright clean professional lighting.",
  },

  bathroom: {
    "modern-minimalist":
      "Interior photography of a furnished minimalist bathroom, floating vanity, large format stone tiles, clean straight lines, matte fixtures, monochromatic spa calm.",

    "rustic-country":
      "Interior photography of a furnished rustic bathroom, wood vanity accents, stone basin, raw wood grain details, farmhouse textiles, warm earthy palette.",

    "organic-natural":
      "Interior photography of a furnished organic bathroom, stone vanity, woven bath accessories, potted greenery, natural textures, calming earth tones.",

    industrial:
      "Interior photography of a furnished industrial bathroom, concrete vanity, metal fixtures, aged brick accent, dark matte tiles, muted urban palette.",

    "high-tech-smart-home":
      "Interior photography of a dark futuristic smart bathroom, backlit LED mirror wall, matte charcoal surfaces, ambient neon accents, luxury spa hardware, moody cinematic lighting.",

    "modern-office":
      "Interior photography of a furnished modern office bathroom, compact vanity, acoustic tile textures, bright efficient lighting, clean professional finishes.",
  },
};

export const SIMULATION_STYLE_SLUGS = Object.keys(
  SIMULATION_PROMPTS_MATRIX["living-room"],
) as SimulationStyleSlug[];

function assertMatrixComplete(): void {
  const roomIds = Object.keys(SIMULATION_PROMPTS_MATRIX) as SimulationRoomTypeId[];
  const expectedStyles = INTERIOR_STYLES.map((s) => s.slug);

  for (const style of expectedStyles) {
    if (!hasSimulationStyleSlug(style)) {
      throw new Error(
        `[PromptMatrix] Missing style slug in matrix: ${style}`,
      );
    }
  }

  for (const roomId of roomIds) {
    const row = SIMULATION_PROMPTS_MATRIX[roomId];
    for (const style of SIMULATION_STYLE_SLUGS) {
      const prompt = row[style];
      if (!prompt?.trim()) {
        throw new Error(
          `[PromptMatrix] Empty prompt for ${roomId} + ${style}`,
        );
      }
    }
  }
}

assertMatrixComplete();

export function hasSimulationStyleSlug(
  slug: string,
): slug is SimulationStyleSlug {
  return slug in SIMULATION_PROMPTS_MATRIX["living-room"];
}

export function isPromptMatrixCombination(
  roomType: SimulationRoomTypeId,
  styleSlug: SimulationStyleSlug,
): boolean {
  return Boolean(SIMULATION_PROMPTS_MATRIX[roomType]?.[styleSlug]);
}
