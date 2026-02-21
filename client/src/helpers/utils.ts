import { fileTypeFromBlob } from "file-type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getVideoThumbnail } from "./thumbnail";

export function flatSupportedFormats(
  formats: Readonly<{
    image: readonly string[];
    video: readonly string[];
    audio: readonly string[];
  }>,
) {
  return Object.entries(formats).flatMap(([key, values]) => values);
}

export async function getFileType(file: File) {
  try {
    const fileType = await fileTypeFromBlob(file);
    if (
      !fileType?.mime.startsWith("image") &&
      !fileType?.mime.startsWith("video")
    ) {
      return null;
    }

    return fileType;
  } catch (_) {
    return null;
  }
}

export interface FilePreviewData {
  url: string;
  width: number;
  height: number;
}

export async function getFilePreview(file: File): Promise<FilePreviewData> {
  // Files with "image/*" mimetype can use browser elements
  if (file.type.startsWith("image/")) {
    return new Promise((resolve, reject) => {
      let image: HTMLImageElement | null = new Image();
      image.onload = () => {
        if (image) {
          resolve({
            url: image.src,
            width: image.width,
            height: image.height,
          });

          image.remove();

          image = null;
        }
      };
      image.onerror = (err) => reject(err);
      image.src = URL.createObjectURL(file);
    });
  }

  return await getVideoThumbnail(file);
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
