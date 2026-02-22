import type { OutputFormat } from "mediabunny";

export const SUPPORTED_MIME_TYPES = {

} as const;

export async function getOutputFormatByMime(
  mime: string,
){
  if (mime === "video/mp4") {
    return import("mediabunny").then((pkg) => pkg.Mp4OutputFormat);
  } else if (mime === "audio/mpeg") {
    return import("mediabunny").then((pkg) => pkg.Mp3OutputFormat);
  } else if (mime === "video/quicktime") {
    return import("mediabunny").then((pkg) => pkg.MovOutputFormat);
  } else if (mime === "video/x-matroska") {
    return import("mediabunny").then((pkg) => pkg.MkvOutputFormat);
  } else if (mime === "audio/ogg") {
    return import("mediabunny").then((pkg) => pkg.OggOutputFormat);
  } else if (mime === "video/webm") {
    return import("mediabunny").then((pkg) => pkg.WebMOutputFormat);
  } else if (mime === "audio/wav") {
    return import("mediabunny").then((pkg) => pkg.WavOutputFormat);
  } else if (mime === "audio/aac") {
    return import("mediabunny").then((pkg) => pkg.AdtsOutputFormat);
  } else if (mime === "audio/flac") {
    return import("mediabunny").then((pkg) => pkg.FlacOutputFormat);
  }

  throw new Error(`Unsupported mime type: ${mime}`);
}
