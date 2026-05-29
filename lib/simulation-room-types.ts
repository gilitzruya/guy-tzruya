export type { SimulationRoomTypeId } from "@/lib/simulation-prompts-matrix";

import type { SimulationRoomTypeId } from "@/lib/simulation-prompts-matrix";

export const SIMULATION_ROOM_TYPE_IDS: SimulationRoomTypeId[] = [
  "living-room",
  "bedroom",
  "kitchen",
  "bathroom",
];

export function isSimulationRoomTypeId(
  value: string,
): value is SimulationRoomTypeId {
  return SIMULATION_ROOM_TYPE_IDS.includes(value as SimulationRoomTypeId);
}

export function parseSimulationRoomType(
  value: FormDataEntryValue | null,
): SimulationRoomTypeId {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (isSimulationRoomTypeId(trimmed)) {
      return trimmed;
    }
  }
  return "living-room";
}
