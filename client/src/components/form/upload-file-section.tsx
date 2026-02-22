import type { DropEvent, FileDropItem, Selection } from "@react-types/shared";
import { filesize } from "filesize";
import { FileUpIcon } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { FileTrigger } from "react-aria-components";
import { isFileSupported } from "../../helpers/utils";
import { Button } from "../react-aria/Button";
import { DropZone } from "../react-aria/DropZone";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "../react-aria/Table";

const columns = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Size", id: "size" },
  // {name: 'Type', id: 'type'},
  // {name: 'Date Modified', id: 'date'}
] as const;

interface TableRow {
  name: string;
  size: string;
}

export const UploadFileSection = memo(function UploadFileSection() {
  const [files, setFiles] = useState<File[]>([]);
  const tableRows = useMemo((): TableRow[] => {
    return files.map((file) => {
      return {
        name: file.name,
        size: filesize(file.size, { locale: true }),
      };
    });
  }, [files]);

  const [selectedFiles, setSelectedFiles] = useState<Selection>(new Set());

  const uploadFiles = useCallback((fileList: File[]) => {
    setFiles((current) => {
      const currentNames = new Set(current.map((file) => file.name));

      const result = [
        ...current,
        ...fileList.filter((file) => !currentNames.has(file.name)),
      ];

      return result;
    });
  }, []);

  const onDrop = useCallback(
    async (evt: DropEvent) => {
      const fileDroppedItems = evt.items.filter(
        (file): file is FileDropItem =>
          file.kind === "file" && isFileSupported(file),
      );

      const files = await Promise.all(
        fileDroppedItems.map((file) => file.getFile()),
      );
      uploadFiles(files);
    },
    [uploadFiles],
  );

  const onSelect = useCallback(
    (fileList: FileList | null) => {
      if (fileList == null) {
        return;
      }

      uploadFiles(Array.from(fileList).filter(isFileSupported));
    },
    [uploadFiles],
  );

  return (
    <section className="mx-4">
      <div className="flex">
        <DropZone onDrop={onDrop} className="flex justify-center">
          <FileTrigger allowsMultiple onSelect={onSelect}>
            <Button className="relative flex h-40 w-92 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-xl border-2 border-solid border-transparent bg-gray-200 px-12 py-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl drop-target:border-amber-500">
              <FileUpIcon className="size-6" />
              <span className="text-base">
                Drop or click to start converting
              </span>
            </Button>
          </FileTrigger>
        </DropZone>

        {/*{files.length > 0 && (
          <ConvertAllButton files={files} selectedFiles={selectedFiles} />
        )}*/}
      </div>

      <div className="mt-6 h-[420px] w-full lg:max-w-5xl">
        <Table
          selectionMode="multiple"
          // className="grid auto-rows-fr grid-cols-5 gap-4"
          aria-label="Uploaded files"
          selectedKeys={selectedFiles}
          onSelectionChange={setSelectedFiles}
        >
          <TableHeader columns={columns}>
            {(column) => <Column>{column.name}</Column>}
          </TableHeader>
          <TableBody items={tableRows}>
            {(item) => {
              return (
                <Row
                  id={item.name}
                  columns={columns}
                  // className="group relative flex cursor-pointer flex-col justify-between rounded-xl bg-gray-100 p-4 shadow transition-all hover:scale-105 hover:bg-gray-100/75"
                >
                  {(column) => <Cell>{item[column.id]}</Cell>}
                  {/*<div className="flex flex-row gap-x-4">
                    <div
                      className={clsx(
                        "flex size-8 items-center justify-center rounded-full bg-white/10 opacity-0 transition-all group-hover:opacity-50 group-selected:opacity-100",
                      )}
                    >
                      <CircleCheck className="size-4 fill-white text-black/25 group-selected:text-blue-500" />
                    </div>
                    <Text className="w-fit overflow-auto text-sm text-ellipsis text-gray-700">
                      {item.name}
                    </Text>
                  </div>
                  <div className="mt-4 flex flex-row justify-center">
                    <FilePreview file={item} />
                  </div>*/}
                </Row>
              );
            }}
          </TableBody>
        </Table>
      </div>
    </section>
  );
});
