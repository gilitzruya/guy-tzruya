/**
 * Manual QA: 4 room types x 7 styles, compare debug panel prompt text.
 * Run: npm test
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SIMULATION_PROMPTS_MATRIX,
  SIMULATION_STYLE_SLUGS,
  type SimulationStyleSlug,
} from "@/lib/simulation-prompts-matrix";
import {
  SIMULATION_ROOM_TYPE_IDS,
  parseSimulationRoomType,
} from "@/lib/simulation-room-types";
import {
  buildSimulationNegativePrompt,
  buildSimulationPrompt,
} from "@/lib/simulation-prompt";

const MAX_PROMPT_WORDS = 70;

const EXPECTED_NEGATIVE_PROMPT =
  "lowres, watermark, banner, logo, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional, realistic";

describe("parseSimulationRoomType", () => {
  it("defaults to living-room", () => {
    assert.equal(parseSimulationRoomType(null), "living-room");
    assert.equal(parseSimulationRoomType("invalid"), "living-room");
  });

  it("accepts all room type ids", () => {
    for (const id of SIMULATION_ROOM_TYPE_IDS) {
      assert.equal(parseSimulationRoomType(id), id);
    }
  });
});

describe("SIMULATION_PROMPTS_MATRIX", () => {
  for (const styleSlug of SIMULATION_STYLE_SLUGS) {
    for (const roomType of SIMULATION_ROOM_TYPE_IDS) {
      it(`has prompt for ${styleSlug} + ${roomType}`, () => {
        const prompt = SIMULATION_PROMPTS_MATRIX[roomType][styleSlug];
        assert.ok(prompt);
        assert.match(prompt, /^Interior photography of /);
        assert.doesNotMatch(prompt, /עיצוב/);
        assert.doesNotMatch(prompt, /living-room/);
      });
    }
  }
});

describe("buildSimulationPrompt", () => {
  for (const styleSlug of SIMULATION_STYLE_SLUGS) {
    for (const roomType of SIMULATION_ROOM_TYPE_IDS) {
      it(`returns matrix prompt for ${styleSlug} + ${roomType}`, () => {
        const prompt = buildSimulationPrompt(styleSlug, roomType);
        assert.equal(prompt, SIMULATION_PROMPTS_MATRIX[roomType][styleSlug]);
      });
    }
  }

  it('uses "living room" wording for living-room type', () => {
    const prompt = buildSimulationPrompt("modern-minimalist", "living-room");
    assert.match(prompt, /living room/);
    assert.match(prompt, /fully furnished/);
    assert.match(prompt, /sofa seating arrangement/);
    assert.doesNotMatch(prompt, /living-room/);
  });

  it("uses furniture-heavy rustic country living room layout", () => {
    const prompt = buildSimulationPrompt("rustic-country", "living-room");
    assert.match(prompt, /heavy solid wood sofa/);
    assert.match(prompt, /staged architectural layout/);
  });

  it("uses premium rustic country tone for kitchen", () => {
    const prompt = buildSimulationPrompt("rustic-country", "kitchen");
    assert.match(prompt, /rustic/);
    assert.match(prompt, /wood/);
  });

  it("uses cinematic hi-tech living room with OLED at the front", () => {
    const prompt = buildSimulationPrompt("high-tech-smart-home", "living-room");
    assert.match(prompt, /giant wall-mounted OLED screen display/);
    const oledIndex = prompt.indexOf("giant wall-mounted OLED");
    assert.ok(oledIndex >= 0 && oledIndex < 80);
    assert.match(prompt, /cinematic moody smart home living room/);
  });

  it("uses cinematic hi-tech bedroom", () => {
    const prompt = buildSimulationPrompt("high-tech-smart-home", "bedroom");
    assert.match(prompt, /cybernetic headboard/);
    assert.match(prompt, /neon ambient/);
  });

  it("throws for unknown style slug", () => {
    assert.throws(
      () =>
        buildSimulationPrompt(
          "unknown-style" as SimulationStyleSlug,
          "kitchen",
        ),
      /\[PromptMatrix\] Combination not found/,
    );
  });
});

describe("CLIP safety", () => {
  for (const styleSlug of SIMULATION_STYLE_SLUGS) {
    for (const roomType of SIMULATION_ROOM_TYPE_IDS) {
      it(`keeps ${styleSlug} + ${roomType} under CLIP word budget`, () => {
        const prompt = buildSimulationPrompt(styleSlug, roomType);
        const wordCount = prompt.split(/\s+/).length;
        assert.ok(
          wordCount <= MAX_PROMPT_WORDS,
          `Prompt has ${wordCount} words (max ${MAX_PROMPT_WORDS})`,
        );
        assert.doesNotMatch(prompt, /Architectural Digest/i);
        assert.doesNotMatch(prompt, /Designed in a /);
        assert.doesNotMatch(prompt, /Tastefully decorated with /);
      });
    }
  }
});

describe("buildSimulationNegativePrompt", () => {
  it("matches configured negative prompt", () => {
    assert.equal(buildSimulationNegativePrompt(), EXPECTED_NEGATIVE_PROMPT);
  });

  it("does not include anti-empty-room phrases", () => {
    const negative = buildSimulationNegativePrompt();
    assert.doesNotMatch(negative, /empty room/);
    assert.doesNotMatch(negative, /no furniture/);
    assert.doesNotMatch(negative, /unfurnished/);
  });

  it("does not include cartoon blocking terms", () => {
    const negative = buildSimulationNegativePrompt();
    assert.doesNotMatch(negative, /cartoon/);
  });
});
