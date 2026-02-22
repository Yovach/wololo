import { fileTypeFromBlob } from "file-type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FilePreviewData, getImageThumbnail, getVideoThumbnail } from "./thumbnail";
import { FileDropItem } from "react-aria-components";

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


export async function getFilePreview(file: File, size: number): Promise<FilePreviewData> {
  // Files with "image/*" mimetype can use browser elements
  if (file.type.startsWith("image/")) {
    return await getImageThumbnail(file, size);
  }

  return await getVideoThumbnail(file);
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function isFileSupported(file: File | FileDropItem) {
  return file.type.startsWith("video/") || file.type.startsWith("image/");
}
