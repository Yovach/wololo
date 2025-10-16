export function flatSupportedFormats(
  formats: Readonly<{
    image: readonly string[];
    video: readonly string[];
    audio: readonly string[];
  }>,
) {
  return Object.entries(formats).flatMap(([key, values]) => values);
}
