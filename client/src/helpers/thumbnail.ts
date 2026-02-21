import {
  ALL_FORMATS,
  BlobSource,
  CanvasSink,
  Input,
  UrlSource,
} from "mediabunny";

export interface FilePreviewData {
  url: string;
  width: number;
  height: number;
}

// Use Mediabunny to generate video thumbnail
export async function getVideoThumbnail(file: File): Promise<FilePreviewData> {
  const source =
    file instanceof File ? new BlobSource(file) : new UrlSource(file);

  const input = new Input({
    source,
    formats: ALL_FORMATS, // Accept all formats
  });

  const videoTrack = await input.getPrimaryVideoTrack();
  if (!videoTrack) {
    throw new Error("File has no video track.");
  }

  if (videoTrack.codec === null) {
    throw new Error("Unsupported video codec.");
  }

  if (!(await videoTrack.canDecode())) {
    throw new Error("Unable to decode the video track.");
  }

  const THUMBNAIL_SIZE = 200;

  // Compute width and height of the thumbnails such that the larger dimension is equal to THUMBNAIL_SIZE
  const width =
    videoTrack.displayWidth > videoTrack.displayHeight
      ? THUMBNAIL_SIZE
      : Math.floor(
          (THUMBNAIL_SIZE * videoTrack.displayWidth) / videoTrack.displayHeight,
        );

  const height =
    videoTrack.displayHeight > videoTrack.displayWidth
      ? THUMBNAIL_SIZE
      : Math.floor(
          (THUMBNAIL_SIZE * videoTrack.displayHeight) / videoTrack.displayWidth,
        );

  const sink = new CanvasSink(videoTrack, {
    width: Math.floor(width * window.devicePixelRatio),
    height: Math.floor(height * window.devicePixelRatio),
    fit: "fill",
  });

  const wrappedCanvas = await sink.getCanvas(0);
  if (!wrappedCanvas) {
    throw new Error("Invalid canvas");
  }

  let blob: Blob | null = null;
  const canvas = wrappedCanvas.canvas;
  if (canvas instanceof HTMLCanvasElement) {
    blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg"),
    );
  } else {
    blob = await canvas.convertToBlob({ type: "image/jpeg" });
  }

  if (!blob) {
    throw new Error("Invalid blob");
  }

  return {
    height,
    width,
    url: URL.createObjectURL(blob),
  };
}

export async function getImageThumbnail(file: File): Promise<FilePreviewData> {
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
