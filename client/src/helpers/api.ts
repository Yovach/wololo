import { string, object, array } from "zod"

interface AvailableFormatsByMedia {
    video: Array<string>;
    image: Array<string>;
    audio: Array<string>;
}

interface AvailableFormatsResponse {
    formats: AvailableFormatsByMedia;
}

export async function getAvailableFormats(): Promise<AvailableFormatsResponse> {
    const request = await fetch(`${import.meta.env.VITE_BACK_URL}/available-formats`);
    if (!request.ok) {
        return {
            formats: {
                image: [],
                video: [],
                audio: [],
            }
        };
    }

    const result = await request.json();

    const responseSchema = object({
        formats: object({
            image: array(string()),
            video: array(string()),
            audio: array(string()),
        })
    });

    return responseSchema.parse(result);
}
