export interface ImageOutputFormat {
  mimeType: string;
  fileExtension: string;
  quality: number;
}

export const BASE_IMAGE_FORMATS: ImageOutputFormat[] = [
  { mimeType: "image/jpeg", fileExtension: "jpg", quality: 0.92 },
  { mimeType: "image/png", fileExtension: "png", quality: 1 },
  { mimeType: "image/webp", fileExtension: "webp", quality: 0.8 },
] as const;

export const AVIF_FORMAT: ImageOutputFormat = {
  mimeType: "image/avif",
  fileExtension: "avif",
  quality: 0.8,
};

export async function checkAvifSupport(): Promise<boolean> {
  if (!document.createElement("canvas").toBlob) {
    return false;
  }

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      return resolve(false);
    }
    
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 1, 1);
    
    canvas.toBlob(
      (blob) => {
        resolve(blob !== null);
      },
      "image/avif",
      1
    );
  });
}

export const OUTPUT_FORMAT_CONVERTERS: ImageOutputFormat[] = BASE_IMAGE_FORMATS;
