export type Scene = "day" | "night";

export const SCENE_STORAGE_KEY = "gt-scene";

/** When false, UI toggle is hidden and the site always uses DEFAULT_SCENE. */
export const SCENE_TOGGLE_ENABLED = false;

export const DEFAULT_SCENE: Scene = "night";

export function isScene(v: string | null): v is Scene {
  return v === "day" || v === "night";
}

export function resolveActiveScene(stored: string | null): Scene {
  if (!SCENE_TOGGLE_ENABLED) return DEFAULT_SCENE;
  return isScene(stored) ? stored : DEFAULT_SCENE;
}
