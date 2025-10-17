import { FileTypeResult } from "file-type";
import { memo, use } from "react";
import { useFilePreviewUrl as useFilePreview } from "../../hooks/use-file-preview-url";
import { useFileType } from "../../hooks/use-file-type";
import { Loader, LoaderCircle } from "lucide-react";

interface Props {
  file: File;
}

export const FilePreview = memo(function FilePreview({ file }: Props) {
  const { data: type, error } = useFileType(file);
  const { data: filePreview, error: error2 } = useFilePreview(file);
  console.log(type, error, filePreview, error2)
  if (type == null) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between gap-2 overflow-clip h-full">
      {filePreview ? (
        <img
          src={filePreview?.url}
          className="h-full max-h-32 w-full max-w-32 object-contain"
        />
      ) : (
        <div className="flex h-32 w-32 items-center justify-center">
          <LoaderCircle className="h-16 w-16 animate-spin text-gray-500" />
        </div>
      )}

      <span
        className="max-w-44 overflow-clip text-nowrap text-ellipsis"
        title={file.name}
      >
        {file.name}
      </span>
    </div>
  );
});
