import mime from "mime-db";

const mimeTypes = Object.keys(mime);

const mimeImagesTypes = mimeTypes.filter((key) => {
  return (
    key.startsWith("image/") &&
    !key.startsWith("image/vnd") &&
    !key.startsWith("image/x-")
  );
});

function isImageFormatSupported(format: string): boolean {
  return mimeImagesTypes.includes(`image/${format}`);
}

export function convertToImage(file: File, mimeType: string): Promise<File> {
  return new Promise((resolve) => {
    const extension = mime[mimeType].extensions?.[0];
    if (!extension || !isImageFormatSupported(extension)) {
      throw new Error(`Format ${mimeType} is not supported`);
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const convertedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, `.${extension}`),
              {
                type: blob.type,
              },
            );
            resolve(convertedFile);
          }
        },
        mimeType,
        1,
      );

      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}

/**
 * Download a file to the user's device
 * @param file The file to download
 */
export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
