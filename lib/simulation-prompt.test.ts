/**
 * Manual QA: 4 room types x 6 styles, compare debug panel prompt text.
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

const MAX_PROMPT_WORDS = 135;

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
      it(`builds generic prompt for ${styleSlug} + ${roomType}`, () => {
        const prompt = buildSimulationPrompt(styleSlug, roomType);
        assert.match(prompt, /^Create a realistic interior design visualization/);
        assert.match(prompt, /Preserve the original camera angle/);
        assert.match(prompt, /professional interior photography/);
        assert.doesNotMatch(prompt, /living-room/);
        assert.doesNotMatch(prompt, /עיצוב/);
      });
    }
  }

  it('uses "living room" wording for living-room type', () => {
    const prompt = buildSimulationPrompt("modern-minimalist", "living-room");
    assert.match(prompt, /living room/);
    assert.match(prompt, /sofa arrangement/);
    assert.match(prompt, /modern minimalist language/);
    assert.doesNotMatch(prompt, /living-room/);
  });

  it("uses rustic country language for a living room", () => {
    const prompt = buildSimulationPrompt("rustic-country", "living-room");
    assert.match(prompt, /rustic country language/);
    assert.match(prompt, /warm natural wood/);
  });

  it("uses practical kitchen wording", () => {
    const prompt = buildSimulationPrompt("rustic-country", "kitchen");
    assert.match(prompt, /function clearly as a kitchen/);
    assert.match(prompt, /cabinetry/);
  });

  it("uses cinematic hi-tech smart home language", () => {
    const prompt = buildSimulationPrompt("high-tech-smart-home", "living-room");
    assert.match(prompt, /high-tech smart home language/);
    assert.match(prompt, /cinematic mood/);
  });

  it("uses restful bedroom wording", () => {
    const prompt = buildSimulationPrompt("high-tech-smart-home", "bedroom");
    assert.match(prompt, /function clearly as a bedroom/);
    assert.match(prompt, /restful composition/);
  });

  it("throws for unknown style slug", () => {
    assert.throws(
      () =>
        buildSimulationPrompt(
          "unknown-style" as SimulationStyleSlug,
          "kitchen",
        ),
      /\[SimulationPrompt\] Combination not found/,
    );
  });
});

describe("Prompt hygiene", () => {
  for (const styleSlug of SIMULATION_STYLE_SLUGS) {
    for (const roomType of SIMULATION_ROOM_TYPE_IDS) {
      it(`keeps ${styleSlug} + ${roomType} concise and brand-safe`, () => {
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
