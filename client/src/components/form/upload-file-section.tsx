import { memo, Suspense, useCallback, useState } from "react";
import {
  Button,
  DropZone,
  FileDropItem,
  FileTrigger,
} from "react-aria-components";
import { getFilePreview, getFileType } from "../../helpers/utils";
import { UploadIcon } from "lucide-react";
import { DropEvent } from "@react-types/shared";
import { FilePreview } from "../common/file-preview";

export const UploadFileSection = memo(function UploadFileSection() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (evt: DropEvent) => {
    const fileDroppedItems: FileDropItem[] = evt.items.filter(
      (file) => file.kind === "file",
    );
    const files = await Promise.all(
      fileDroppedItems.map((file) => file.getFile()),
    );
    setFiles(files);
  }, []);

  const onSelect = useCallback((e: FileList | null) => {
    setFiles(e ? Array.from(e) : []);
  }, []);

  return (
    <section className="mt-16">
      <DropZone onDrop={onDrop} className="flex justify-center">
        <FileTrigger allowsMultiple onSelect={onSelect}>
          <Button className="relative flex h-full w-64 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-xl border-2 border-solid border-transparent bg-gray-200 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl data-drop-target:border-amber-500">
            <UploadIcon className="size-6" />
            <span className="text-base">Drop or click</span>
          </Button>
        </FileTrigger>
      </DropZone>

      <Suspense>
        <div className="m-4 grid grid-cols-5 gap-4">
          {files.map((val) => {
            return <FilePreview key={`FilePreview.${val.name}`} file={val} />;
          })}
        </div>
      </Suspense>
    </section>
  );
});
