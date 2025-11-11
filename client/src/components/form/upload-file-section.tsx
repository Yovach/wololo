import { DropEvent, Selection } from "@react-types/shared";
import { clsx } from "clsx";
import { CircleCheck, UploadIcon } from "lucide-react";
import { memo, useCallback, useState } from "react";
import {
  Button,
  DropZone,
  FileDropItem,
  FileTrigger,
  ListBox,
  ListBoxItem,
  Text
} from "react-aria-components";
import { FilePreview } from "../common/file-preview";
import { ConvertAllButton } from "./convert-all-button";

export const UploadFileSection = memo(function UploadFileSection() {
  const [files, setFiles] = useState<File[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<Selection>(new Set());

  const uploadFiles = useCallback((fileList: File[]) => {
    setFiles((current) => {
      const currentNames = current.map((file) => file.name);
      return [...current, ...Array.from(fileList).filter((file) => !currentNames.includes(file.name))];
    });
  }, []);

  const onDrop = useCallback(async (evt: DropEvent) => {
    const fileDroppedItems: FileDropItem[] = evt.items.filter(
      (file) => file.kind === "file",
    );
    const files = await Promise.all(
      fileDroppedItems.map((file) => file.getFile()),
    );
    console.log("set files", files);
    uploadFiles(files);
  }, []);

  const onSelect = useCallback((fileList: FileList | null) => {
    if (fileList == null) {
      return;
    }

    console.log("set files", fileList);
    uploadFiles(Array.from(fileList));
  }, []);

  return (
    <section className="mx-4">
      <DropZone onDrop={onDrop} className="flex justify-center">
        <FileTrigger allowsMultiple onSelect={onSelect}>
          <Button className="relative flex h-full w-64 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-xl border-2 border-solid border-transparent bg-gray-200 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl data-drop-target:border-amber-500">
            <UploadIcon className="size-6" />
            <span className="text-base">Drop or click</span>
          </Button>
        </FileTrigger>
      </DropZone>

      <div className="flex gap-x-4">
        <Button>Select all</Button>
        <ConvertAllButton
          nbSelectedElements={
            selectedFiles === "all" ? files.length : selectedFiles.size
          }
        />
      </div>

      <div className="mt-6 h-[420px] w-full lg:max-w-5xl">
        <ListBox
          selectionMode="multiple"
          className="grid auto-rows-fr grid-cols-5 gap-4"
          items={files}
          selectedKeys={selectedFiles}
          onSelectionChange={setSelectedFiles}
        >
          {(item) => {
            return (
              <ListBoxItem
                id={item.name}
                textValue={item.name}
                className="group relative flex cursor-pointer flex-col justify-between rounded-xl bg-gray-100 p-4 shadow transition-all hover:scale-105 hover:bg-gray-100/75"
              >
                <div className="flex flex-row gap-x-4">
                  <div
                    className={clsx(
                      "flex size-8 items-center justify-center rounded-full bg-white/10 opacity-0 transition-all group-hover:opacity-50 group-data-selected:opacity-100",
                    )}
                  >
                    <CircleCheck className="size-4 fill-white text-black/25 group-data-selected:text-blue-500" />
                  </div>
                  <Text className="w-fit overflow-auto text-sm text-ellipsis text-gray-700">
                    {item.name}
                  </Text>
                </div>
                <div className="mt-4 flex flex-row justify-center">
                  <FilePreview file={item} />
                </div>
              </ListBoxItem>
            );
          }}
        </ListBox>
      </div>
    </section>
  );
});
