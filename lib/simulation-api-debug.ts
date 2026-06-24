import {
  getOpenAISimulationModel,
  getReplicateModel,
  getSimulationProvider,
  isSimulationMock,
  type SimulationProvider,
} from "@/lib/simulation-config";
import { buildOpenAIInputPreview } from "@/lib/simulation-openai";
import { buildReplicateInputPreview } from "@/lib/simulation-replicate";
import type { SimulationRoomTypeId } from "@/lib/simulation-room-types";

export type SimulationApiDebug = {
  styleSlug: string;
  roomType: SimulationRoomTypeId;
  isMock: boolean;
  provider: SimulationProvider;
  openAIModel?: string;
  replicateModel?: string;
  /** Exact `input` object sent to OpenAI (image truncated for display). */
  openAIInput?: Record<string, unknown>;
  /** Exact `input` object sent to Replicate (image truncated for display). */
  replicateInput?: Record<string, unknown>;
};

export function buildSimulationApiDebug(
  imageFile: File,
  imageDataUri: string,
  prompt: string,
  negativePrompt: string,
  styleSlug: string,
  roomType: SimulationRoomTypeId,
): SimulationApiDebug {
  const provider = getSimulationProvider();

  return {
    styleSlug,
    roomType,
    isMock: isSimulationMock(),
    provider,
    ...(provider === "openai"
      ? {
          openAIModel: getOpenAISimulationModel(),
          openAIInput: buildOpenAIInputPreview(imageFile, prompt, {
            negativePrompt,
          }),
        }
      : {
          replicateModel: getReplicateModel(),
          replicateInput: buildReplicateInputPreview(imageDataUri, prompt, {
            negativePrompt,
          }),
        }),
  };
}
