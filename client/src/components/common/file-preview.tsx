import { FileExclamationPointIcon, LoaderCircle } from "lucide-react";
import { memo } from "react";
import { useFilePreviewUrl as useFilePreview } from "../../hooks/use-file-preview-url";
import { useFileType } from "../../hooks/use-file-type";

interface Props {
  file: File;
}

export const FilePreview = memo(function FilePreview({ file }: Props) {
  const { data: type, error } = useFileType(file);
  const { data: filePreview, error: error2, isLoading } = useFilePreview(file);
  console.log(filePreview, type, error, error2)
  if (type == null) {
    return null;
  }

  if (filePreview) {
    return (
      <div className="flex h-48 w-48 items-center justify-center">
        <img
          src={filePreview?.url}
          className="h-full max-h-48 w-full max-w-48 object-cover"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-48 w-48 items-center justify-center">
        <LoaderCircle className="h-16 w-16 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-48 w-48 items-center justify-center">
      <FileExclamationPointIcon className="h-16 w-16 text-red-500" />
    </div>
  );
});
