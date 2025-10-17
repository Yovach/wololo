import { memo, useCallback, useState } from "react";
import {
  Button,
  DropZone,
  FileDropItem,
  FileTrigger,
  GridLayout,
  ListBox,
  ListBoxItem,
  ListLayout,
  Size,
  Virtualizer,
} from "react-aria-components";
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
    console.log("set files", files.length);
    setFiles(files);
  }, []);

  const onSelect = useCallback((e: FileList | null) => {
    console.log("set files", e?.length);
    setFiles(e ? Array.from(e) : []);
  }, []);

  return (
    <section className="w-full px-16 pt-16">
      <DropZone onDrop={onDrop} className="flex justify-center">
        <FileTrigger allowsMultiple onSelect={onSelect}>
          <Button className="relative flex h-full w-64 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-xl border-2 border-solid border-transparent bg-gray-200 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl data-drop-target:border-amber-500">
            <UploadIcon className="size-6" />
            <span className="text-base">Drop or click</span>
          </Button>
        </FileTrigger>
      </DropZone>

      <div className="mt-6 h-[420px] overflow-auto rounded-md border border-gray-200">
        <Virtualizer layout={GridLayout} layoutOptions={{minSpace: new Size(16, 16)}}>
          <ListBox
            layout="grid"
            aria-label="Virtualized grid layout"
            selectionMode="multiple"
            items={files}
          >
            {(item) => {
              return (
                <ListBoxItem
                  id={item.name}
                  textValue={item.name}
                  className="h-48 w-48 rounded-lg bg-gray-100 p-4 shadow  max-h-48 max-w-48"
                >
                  {/* <Text>{item.name}</Text> */}
                  <FilePreview file={item} />
                </ListBoxItem>
              );
            }}
          </ListBox>
        </Virtualizer>
      </div>
    </section>
  );
});
