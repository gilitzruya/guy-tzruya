/** First portion of crossfade window: strong linear ramp so the reveal is visible early. */
export const CROSSFADE_LINEAR_HEAD = 0.13;

/** Reveal progress at end of linear head (top-layer opacity ≈ 1 − this). */
export const CROSSFADE_LINEAR_REVEAL = 0.32;

export const HERO_CROSSFADE_MS = 5000;

export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

/** Maps elapsed fraction [0,1] → reveal progress [0,1]. */
export function crossfadeRevealProgress(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped < CROSSFADE_LINEAR_HEAD) {
    return (clamped / CROSSFADE_LINEAR_HEAD) * CROSSFADE_LINEAR_REVEAL;
  }
  const u = (clamped - CROSSFADE_LINEAR_HEAD) / (1 - CROSSFADE_LINEAR_HEAD);
  return (
    CROSSFADE_LINEAR_REVEAL + (1 - CROSSFADE_LINEAR_REVEAL) * easeOutCubic(u)
  );
}
