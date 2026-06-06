export interface FilePreviewData {
  url: string;
  width: number;
  height: number;
}

export async function getImageThumbnail(file: File, size: number): Promise<FilePreviewData> {
  return new Promise((resolve, reject) => {
    let image: HTMLImageElement | null = new Image();
    image.height = size;
    image.width = size;

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
