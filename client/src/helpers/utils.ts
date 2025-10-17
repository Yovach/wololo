import { fileTypeFromBlob } from "file-type";

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

interface Props {
  url: string;
  width: number;
  height: number;
}

export async function getFilePreview(file: File, seekTime = 0): Promise<Props> {
  console.log("getFilePreview");

  if (!file.type.startsWith("video/")) {
    console.log("getFilePreview: not video");
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve({
          url: image.src,
          width: image.width,
          height: image.height,
        });
      };
      image.src = URL.createObjectURL(file);
    });
  }

  console.log("getFilePreview: video");

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.setAttribute("crossorigin", "anonymous");
    video.muted = true;
    video.playsInline = true;

    const cleanUp = () => {
      URL.revokeObjectURL(video.src);
      video.remove();
      canvas.remove();
    };

    video.onerror = () => {
      cleanUp();
      reject(new Error("Unable to load the video"));
    };

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.currentTime = Math.min(seekTime, video.duration);
    };

    video.onseeked = () => {
      if (!ctx) {
        cleanUp();
        reject(new Error("2D canvas context unavailable"));
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          cleanUp();
          reject(new Error("Failed to convert canvas to blob"));
          return;
        }

        const url = URL.createObjectURL(blob);
        cleanUp();

        resolve({
          url,
          width: canvas.width,
          height: canvas.height,
        });
      }, "image/jpeg");
    };

    video.src = URL.createObjectURL(file);
    video.load();
  });
}
