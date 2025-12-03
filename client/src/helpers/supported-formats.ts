import mime from "mime-db";

const filteredMimes = Object.entries(mime).filter(([key, value]) => {
  const isTypeSupported =
    key.startsWith("image") ||
    key.startsWith("video") ||
    key.startsWith("audio");
  if (!isTypeSupported) {
    return false;
  }

  const mimeChunk = key.split("/", 2)[1];
  const isStandard =
    mimeChunk != null &&
    !mimeChunk.startsWith("vnd") &&
    !mimeChunk.startsWith("x-");
  if (!isStandard) {
    return false;
  }

  return value.extensions != null && value.extensions.length > 0;
});

const videoFormats: string[] = filteredMimes
  .filter(
    ([key, value]) => key.startsWith("video") && value.extensions?.[0] != null,
  )
  .map(([, value]) => {
    const firstExtension = value.extensions?.[0];
    if (firstExtension == null) {
      throw new Error("Can't be here");
    }

    return firstExtension;
  });

/// List of supported output file extensions for videos
export const SUPPORTED_VIDEO_FORMATS: readonly string[] =
  Object.freeze(videoFormats);

const audioFormats: string[] = filteredMimes
  .filter(
    ([key, value]) => key.startsWith("audio") && value.extensions?.[0] != null,
  )
  .map(([, value]) => {
    const firstExtension = value.extensions?.[0];
    if (firstExtension == null) {
      throw new Error("Can't be here");
    }

    return firstExtension;
  });

/// List of supported output file extensions for audios
export const SUPPORTED_AUDIO_FORMATS: readonly string[] =
  Object.freeze(audioFormats);

const imageFormats: string[] = filteredMimes
  .filter(
    ([key, value]) => key.startsWith("image") && value.extensions?.[0] != null,
  )
  .map(([, value]) => {
    const firstExtension = value.extensions?.[0];
    if (firstExtension == null) {
      throw new Error("Can't be here");
    }

    return firstExtension;
  });

/// List of supported output file extensions for images
export const SUPPORTED_IMAGE_FORMATS: readonly string[] =
  Object.freeze(imageFormats);
