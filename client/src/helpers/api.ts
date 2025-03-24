import { z } from "zod";

const responseSchema = z.object({
  formats: z.object({
    image: z.array(z.string()),
    video: z.array(z.string()),
    audio: z.array(z.string()),
  }),
});

type AvailableFormatsResponse = z.infer<typeof responseSchema>;

export async function getAvailableFormats(): Promise<AvailableFormatsResponse> {
  try {
    const request = await fetch(
      `${import.meta.env.VITE_BACK_URL}/available-formats`
    );
    
    if (request.ok) {
      const result = await request.json();
      return responseSchema.parse(result);
    }
  } catch (e) {
    console.error(e);
  }

  return {
    formats: {
      image: [],
      video: [],
      audio: [],
    },
  };
}
