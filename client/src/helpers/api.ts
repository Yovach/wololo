import { z } from "zod";
import {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
} from "./supported-formats";

const responseSchema = z.object({
  formats: z.object({
    image: z.array(z.string()).readonly(),
    video: z.array(z.string()).readonly(),
    audio: z.array(z.string()).readonly(),
  }),
});

type AvailableFormatsResponse = z.infer<typeof responseSchema>;

export const DEFAULT_FORMATS: Readonly<{
  image: readonly string[];
  video: readonly string[];
  audio: readonly string[];
}> = Object.freeze({
  image: SUPPORTED_IMAGE_FORMATS,
  video: SUPPORTED_VIDEO_FORMATS,
  audio: SUPPORTED_AUDIO_FORMATS,
});

export async function getAvailableFormats(): Promise<AvailableFormatsResponse> {
  try {
    const request = await fetch(
      `${import.meta.env.VITE_BACK_URL}/available-formats`,
    );

    if (request.ok) {
      const result = await request.json();
      return responseSchema.parse(result);
    }
  } catch (e) {
    console.error(e);
  }

  return {
    formats: DEFAULT_FORMATS,
  };
}
