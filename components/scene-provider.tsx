"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { Scene } from "@/lib/scene-storage";
import { SCENE_STORAGE_KEY, isScene } from "@/lib/scene-storage";

const SCENE_EVENT = "gt-scene-change";

type SceneContextValue = {
  scene: Scene;
  setScene: (s: Scene) => void;
};

const SceneContext = createContext<SceneContextValue | null>(null);

function readSceneFromDom(): Scene {
  if (typeof document === "undefined") return "night";
  const v = document.documentElement.getAttribute("data-scene");
  return isScene(v) ? v : "night";
}

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener(SCENE_EVENT, handler);
  return () => window.removeEventListener(SCENE_EVENT, handler);
}

function getServerSnapshot(): Scene {
  return "night";
}

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const scene = useSyncExternalStore(
    subscribe,
    readSceneFromDom,
    getServerSnapshot,
  );

  const setScene = useCallback((next: Scene) => {
    document.documentElement.setAttribute("data-scene", next);
    try {
      localStorage.setItem(SCENE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(SCENE_EVENT));
  }, []);

  const value = useMemo(() => ({ scene, setScene }), [scene, setScene]);

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) {
    throw new Error("useScene must be used within SceneProvider");
  }
  return ctx;
}
