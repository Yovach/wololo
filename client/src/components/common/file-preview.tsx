import { FileTypeResult } from "file-type";
import { memo, use } from "react";
import { useFilePreviewUrl as useFilePreview } from "../../hooks/use-file-preview-url";
import { useFileType } from "../../hooks/use-file-type";
import { Loader, LoaderCircle } from "lucide-react";

interface Props {
  file: File;
}

export const FilePreview = memo(function FilePreview({ file }: Props) {
  const { data: type } = useFileType(file);
  const { data: filePreview } = useFilePreview(file);
  if (type == null) {
    return null;
  }

  return (
    <div className="flex max-h-48 max-w-48 flex-col justify-evenly gap-2 overflow-clip rounded-lg bg-gray-100 p-4 shadow">
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
        className="max-w-32 overflow-clip text-nowrap text-ellipsis"
        title={file.name}
      >
        {file.name}
      </span>
    </div>
  );
});
