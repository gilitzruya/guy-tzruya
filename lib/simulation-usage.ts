import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import {
  SIMULATION_COOKIE_MAX_AGE,
  SIMULATION_COOKIE_NAME,
  getSimulationMaxActivations,
} from "@/lib/simulation-config";

export type SimulationQuota = {
  used: number;
  max: number;
  remaining: number;
};

export function parseUsageCount(value: string | undefined): number {
  const n = value ? Number.parseInt(value, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function buildQuota(used: number): SimulationQuota {
  const max = getSimulationMaxActivations();
  const remaining = Math.max(0, max - used);
  return { used, max, remaining };
}

export function getQuotaFromCookieValue(
  cookieValue: string | undefined,
): SimulationQuota {
  return buildQuota(parseUsageCount(cookieValue));
}

export function simulationCookieOptions(count: number): ResponseCookie {
  return {
    name: SIMULATION_COOKIE_NAME,
    value: String(count),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SIMULATION_COOKIE_MAX_AGE,
    path: "/",
  };
}

export function canGenerate(quota: SimulationQuota): boolean {
  return quota.remaining > 0;
}
