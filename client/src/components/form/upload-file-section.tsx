import {
  ForwardRefExoticComponent,
  memo,
  RefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  Button,
  DirectoryDropItem,
  DropZone,
  DropZoneProps,
  FileDropItem,
  FileTrigger,
  Text,
} from "react-aria-components";
import { useGetSupportedFormats } from "../../api/get-supported-formats";
import { flatSupportedFormats } from "../../helpers/utils";
import { UploadIcon } from "lucide-react";
import { DropEvent } from "@react-types/shared";

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
      <DropZone onDrop={onDrop}>
        <FileTrigger allowsMultiple onSelect={onSelect}>
          <Button className="p-6 h-full bg-gray-200 rounded-xl cursor-pointer hover:scale-105 transition-all relative w-64 data-drop-target:border-amber-500 border-2 border-solid border-transparent flex justify-center items-center flex-col gap-y-2 shadow-lg hover:shadow-xl">
            <UploadIcon className="size-6" />
            <span className="text-base">Drop or click</span>
          </Button>
        </FileTrigger>
      </DropZone>
    </section>
  );
});
