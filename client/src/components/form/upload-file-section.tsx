import type { DropEvent, FileDropItem, Selection } from "@react-types/shared";
import { filesize } from "filesize";
import {
  DownloadIcon,
  FileAudioIcon,
  FileIcon,
  FileUpIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Output,
} from "mediabunny";
import { memo, useCallback, useMemo, useState } from "react";
import {
  FileTrigger,
  Focusable,
  Key,
  TooltipTrigger,
} from "react-aria-components";
import { downloadFile } from "../../helpers/converter";
import { OUTPUT_FORMAT_CONVERTERS } from "../../helpers/output";
import { isFileSupported } from "../../helpers/utils";
import { FilePreview } from "../common/file-preview";
import { Button } from "../react-aria/Button";
import { DropZone } from "../react-aria/DropZone";
import { Select, SelectItem } from "../react-aria/Select";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "../react-aria/Table";
import { ProgressBar } from "../react-aria/ProgressBar";
import mime from "mime";
import { Link } from "../react-aria/Link";
import { Tooltip } from "../react-aria/Tooltip";

const columns = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Size", id: "size" },
  { name: "Download", id: "download" },
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

  const [progressNumber, setProgressNumber] = useState<
    Record<string, number | undefined>
  >({});

  const [downloadLinks, setDownloadLinks] = useState<Record<string, string>>(
    {},
  );

  const tableRows = useMemo((): TableRow[] => {
    return files.map((file) => {
      return {
        name: file.name,
        size: filesize(file.size, { locale: true }),
        file,
      };
    });
  }, [files]);

  const [selectedFilesNames, setSelectedFilesNames] = useState<Selection>(
    new Set(),
  );

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

  const availableOutputFormats = useMemo(() => {
    const file = files.at(0);
    if (!file) {
      return [];
    }

    return OUTPUT_FORMAT_CONVERTERS.map((val) => ({
      id: val.mimeType,
      name: val.fileExtension,
    })).toSorted((a, b) => a.id.localeCompare(b.id));
  }, [files]);

  const selectedFiles = useMemo((): File[] => {
    if (selectedFilesNames === "all") {
      return files;
    }

    return Array.from(selectedFilesNames.values())
      .map((selectedFileName) => {
        return files.find((file) => file.name === selectedFileName);
      })
      .filter((file) => file instanceof File);
  }, [files, selectedFilesNames]);

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
            selectionMode="multiple"
            // className="grid auto-rows-fr grid-cols-5 gap-4"
            aria-label="Uploaded files"
            selectedKeys={selectedFilesNames}
            onSelectionChange={setSelectedFilesNames}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <Column isRowHeader={"isRowHeader" in column}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={tableRows} dependencies={[downloadLinks]}>
              {(item) => {
                return (
                  <Row
                    id={item.name}
                    columns={columns}
                    dependencies={[downloadLinks[item.file.name]]}
                    // className="group relative flex cursor-pointer flex-col justify-between rounded-xl bg-gray-100 p-4 shadow transition-all hover:scale-105 hover:bg-gray-100/75"
                  >
                    {(column) => {
                      if (column.id === "download") {
                        const downloadLink = downloadLinks?.[item.file.name];
                        return (
                          <Cell>
                            {downloadLink != null && (
                              <TooltipTrigger>
                                <Focusable>
                                  <Link
                                    href={downloadLink}
                                    target="_blank"
                                    download
                                    className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-500 p-2.5 text-blue-50"
                                  >
                                    <DownloadIcon size={20} />
                                  </Link>
                                </Focusable>
                                <Tooltip>Download file</Tooltip>
                              </TooltipTrigger>
                            )}
                          </Cell>
                        );
                      }
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
                  return (
                    <SelectItem>
                      {item.id.startsWith("video/") && <VideoIcon size={16} />}
                      {item.id.startsWith("image/") && <ImageIcon size={16} />}
                      {item.id.startsWith("audio/") && (
                        <FileAudioIcon size={16} />
                      )}
                      {item.id.startsWith("application/") && (
                        <FileIcon size={16} />
                      )}
                      <span>
                        {item.name} ({item.id})
                      </span>
                    </SelectItem>
                  );
                }}
              </Select>
            </div>

            <Button
              onClick={async () => {
                if (!selectedFormat) {
                  return;
                }

                const outputFormat = OUTPUT_FORMAT_CONVERTERS.find(
                  (val) => val.mimeType === selectedFormat,
                );
                if (outputFormat) {
                  setProgressNumber({});

                  for (const file of selectedFiles) {
                    let input: Input | null = new Input({
                      formats: ALL_FORMATS,
                      source: new BlobSource(file),
                    });

                    let output: Output | null = new Output({
                      format: outputFormat,
                      target: new BufferTarget(),
                    });

                    let conversion: Conversion | null = null;

                    try {
                      conversion = await Conversion.init({ input, output });
                      if (!conversion.isValid) {
                        console.log(conversion.discardedTracks);
                        console.error("an error occured");
                        return;
                      }

                      conversion.onProgress = (progress: number) => {
                        setProgressNumber((current) => ({
                          ...current,
                          [file.name]: progress,
                        }));
                      };

                      await conversion.execute();

                      const target = conversion.output.target;
                      if (
                        target instanceof BufferTarget &&
                        target.buffer != null
                      ) {
                        const extensionsOfMimeType = mime.getAllExtensions(
                          file.type,
                        );

                        let foundExtension: string | null = null;
                        if (extensionsOfMimeType) {
                          for (const ext of extensionsOfMimeType) {
                            if (file.name.endsWith(`.${ext}`)) {
                              foundExtension = ext;
                            }
                          }
                        }

                        const fileName =
                          foundExtension != null
                            ? file.name.replace(
                                foundExtension,
                                output.format.fileExtension,
                              )
                            : `${file.name}.${output.format.fileExtension}`;

                        const outputFile = new File([target.buffer], fileName, {
                          type: output.format.mimeType,
                        });

                        // downloadFile(new File([target.buffer], fileName));
                        setDownloadLinks((current) => ({
                          ...current,
                          [file.name]: URL.createObjectURL(outputFile),
                        }));

                        await new Promise((resolve) =>
                          setTimeout(resolve, 100),
                        );
                      }
                    } finally {
                      conversion = null;
                      output = null;
                      input = null;

                      // setProgressNumber((current) => ({
                      //   ...current,
                      //   [file.name]: undefined,
                      // }));
                    }
                  }
                }
              }}
            >
              Convert selected files to {selectedFormat}
            </Button>
          </div>
        </div>
      )}

      {JSON.stringify(progressNumber)}
    </section>
  );
});
