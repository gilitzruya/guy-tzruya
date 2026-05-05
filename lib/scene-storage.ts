export type Scene = "day" | "night";

export const SCENE_STORAGE_KEY = "gt-scene";

export function isScene(v: string | null): v is Scene {
  return v === "day" || v === "night";
}
