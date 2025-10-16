import { FileTypeResult } from "file-type";
import { memo, use } from "react";

interface Props {
  file: File;
  fileType: Promise<FileTypeResult | undefined>;
  filePreviewUrl: Promise<string | undefined>;
}

export const FilePreview = memo(function FilePreview({
  file,
  fileType,
  filePreviewUrl,
}: Props) {
  const type = use(fileType);
  const previewUrl = use(filePreviewUrl);
  if (type == null || previewUrl == null) {
    return null;
  }

  console.log({ type, previewUrl });

  return (
    <div className="flex max-h-48 max-w-48 flex-col justify-evenly gap-2 overflow-clip rounded-lg bg-gray-100 p-4 shadow">
      <img
        src={previewUrl}
        className="h-full max-h-32 w-full max-w-32 object-contain"
      />
      <span
        className="max-w-32 overflow-clip text-nowrap text-ellipsis"
        title={file.name}
      >
        {file.name}
      </span>
    </div>
  );
});
