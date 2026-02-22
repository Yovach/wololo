import type { DropEvent, FileDropItem, Selection } from "@react-types/shared";
import { filesize } from "filesize";
import { FileUpIcon } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { FileTrigger, Key } from "react-aria-components";
import { isFileSupported } from "../../helpers/utils";
import { Button } from "../react-aria/Button";
import { DropZone } from "../react-aria/DropZone";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "../react-aria/Table";
import { ConvertFileForm } from "./convert-file-form";
import { FilePreview } from "../common/file-preview";
import { ConvertAllButton } from "./convert-all-button";
import { Select, SelectItem } from "../react-aria/Select";
import {
  ALL_FORMATS,
  BlobSource,
  Input,
  Mp4InputFormat,
  Output,
  OutputFormat,
} from "mediabunny";
import {
  getOutputFormatByMime,
  SUPPORTED_MIME_TYPES,
} from "../../helpers/output";

const columns = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Size", id: "size" },
  // {name: 'Type', id: 'type'},
  // {name: 'Date Modified', id: 'date'}
] as const;

interface TableRow {
  name: string;
  size: string;
  file: File;
}

export const UploadFileSection = memo(function UploadFileSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<Key | null>(null);

  const tableRows = useMemo((): TableRow[] => {
    return files.map((file) => {
      return {
        name: file.name,
        size: filesize(file.size, { locale: true }),
        file,
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

  const uniqueSelectedMediaTypes = useMemo(() => {
    const formats =
      selectedFiles === "all"
        ? files.map((file) => file.type)
        : [...selectedFiles.values()].map((file) => {
            return files.find((f) => f.name === file)?.type;
          });

    return new Set(
      formats
        .map((format) => format?.split("/", 1)[0])
        .filter((format) => format != null),
    );
  }, [selectedFiles, files]);

  const availableOutputFormats = useMemo(() => {
    const file = files.at(0);
    if (!file) {
      return [];
    }

    const result =
      SUPPORTED_MIME_TYPES[file.type as keyof typeof SUPPORTED_MIME_TYPES];
    if (!result) {
      return [];
    }

    return result.map((val) => ({ id: val, name: val }));
  }, [files]);

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

      {files.length > 0 && (
        <div className="mt-6 h-[420px] w-full lg:max-w-5xl">
          <Table
            selectionMode="single"
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
                    {(column) => {
                      return (
                        <Cell>
                          <div className="inline-flex items-center gap-x-3">
                            {column.id === "name" && (
                              <FilePreview file={item.file} size={32} />
                            )}
                            {item[column.id]}
                          </div>
                        </Cell>
                      );
                    }}
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

          <div className="px-4 py-2">
            <div>
              <Select
                items={availableOutputFormats}
                onChange={(value) => {
                  setSelectedFormat(value);
                }}
              >
                {(item) => {
                  return <SelectItem>{item.name}</SelectItem>;
                }}
              </Select>
            </div>

            <Button
              onClick={async (val) => {
                if (!selectedFormat) {
                  return;
                }

                console.log("ici");
                const outputFormat =
                  await getOutputFormatByMime(selectedFormat);
                console.log("ici");
                const output = new outputFormat();
                console.log(output.mimeType);
              }}
            >
              Convert selected files {selectedFormat}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
});
