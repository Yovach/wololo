import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { fileTypeFromBlob } from "file-type";
import { FilePreviewData, getImageThumbnail } from "./thumbnail";
import { FileDropItem } from "react-aria-components";

export async function getFilePreview(file: File, size: number): Promise<FilePreviewData> {
  return await getImageThumbnail(file, size);
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export async function getFileType(file: File) {
  try {
    const fileType = await fileTypeFromBlob(file);
    if (!fileType?.mime.startsWith("image")) {
      return null;
    }
    return fileType;
  } catch (_) {
    return null;
  }
}

export function isFileSupported(file: File | FileDropItem) {
  return file.type.startsWith("image/");
}
