import { FileExclamationPointIcon, LoaderCircle } from "lucide-react";
import { memo } from "react";
import { useFilePreviewUrl as useFilePreview } from "../../hooks/use-file-preview-url";
import { useFileType } from "../../hooks/use-file-type";

interface Props {
  file: File;
  size?: number;
}

export const FilePreview = memo(function FilePreview({ file, size }: Props) {
  const { data: type, error } = useFileType(file);
  const {
    data: filePreview,
    error: error2,
    isLoading,
  } = useFilePreview(file, size);
  if (type == null) {
    return null;
  }

  if (filePreview) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <img
          src={filePreview?.url}
          className="h-full w-full object-cover"
          style={{ maxHeight: size, maxWidth: size }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <LoaderCircle className="size-16 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <FileExclamationPointIcon className="size-16 text-red-500" />
    </div>
  );
});
