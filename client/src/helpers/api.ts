import { z } from "zod";
import {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
} from "./supported-formats";

const responseSchema = z.array(
  z.object({
    type: z.string(),
    label: z.string(),
    items: z.array(z.string()).readonly(),
  }),
).readonly();

type AvailableFormatsResponse = z.infer<typeof responseSchema>;

export const DEFAULT_FORMATS = Object.freeze([
  {
    type: "image",
    label: "Image",
    items: SUPPORTED_IMAGE_FORMATS,
  },
  {
    type: "video",
    label: "Vidéo",
    items: SUPPORTED_VIDEO_FORMATS,
  },
  {
    type: "audio",
    label: "Audio",
    items: SUPPORTED_AUDIO_FORMATS,
  },
]);

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

  return DEFAULT_FORMATS;
}
