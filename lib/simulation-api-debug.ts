import { getReplicateModel, isSimulationMock } from "@/lib/simulation-config";
import { buildReplicateInputPreview } from "@/lib/simulation-replicate";
import type { SimulationRoomTypeId } from "@/lib/simulation-room-types";

export type SimulationApiDebug = {
  styleSlug: string;
  roomType: SimulationRoomTypeId;
  isMock: boolean;
  replicateModel: string;
  /** Exact `input` object sent to Replicate (image truncated for display). */
  replicateInput: Record<string, unknown>;
};

export function buildSimulationApiDebug(
  imageDataUri: string,
  prompt: string,
  negativePrompt: string,
  styleSlug: string,
  roomType: SimulationRoomTypeId,
): SimulationApiDebug {
  return {
    styleSlug,
    roomType,
    isMock: isSimulationMock(),
    replicateModel: getReplicateModel(),
    replicateInput: buildReplicateInputPreview(imageDataUri, prompt, {
      negativePrompt,
    }),
  };
}
