import type { DropEvent, FileDropItem, Selection } from "@react-types/shared";
import { filesize } from "filesize";
import {
  DownloadIcon,
  FileUpIcon,
  ImageIcon,
} from "lucide-react";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  FileTrigger,
  Focusable,
  Key,
  TooltipTrigger,
} from "react-aria-components";
import { downloadFile } from "../../helpers/converter";
import { AVIF_FORMAT, ImageOutputFormat, OUTPUT_FORMAT_CONVERTERS, checkAvifSupport } from "../../helpers/output";
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
  useEffect(() => {
    checkAvifSupport().then(setSupportsAvif);
  }, []);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<Key | null>(null);
  const [supportsAvif, setSupportsAvif] = useState<boolean>(false);

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

    const allFormats = [...OUTPUT_FORMAT_CONVERTERS];
    if (supportsAvif) {
      allFormats.push(AVIF_FORMAT);
    }

    return allFormats.map((val) => ({
      id: val.mimeType,
      name: val.fileExtension,
    })).toSorted((a, b) => a.id.localeCompare(b.id));
  }, [files, supportsAvif]);

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
                Drop or click to convert images
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
                        {item.id.startsWith("image/") && <ImageIcon size={16} />}

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

                const outputFormat: ImageOutputFormat | undefined = OUTPUT_FORMAT_CONVERTERS.find(
                  (val) => val.mimeType === selectedFormat,
                );
                if (outputFormat) {
                  setProgressNumber({});

                  for (const file of selectedFiles) {
                    try {
                      setProgressNumber((current) => ({
                        ...current,
                        [file.name]: 0,
                      }));

                      const imageBitmap = await createImageBitmap(file);
                      const canvas = document.createElement("canvas");
                      canvas.width = imageBitmap.width;
                      canvas.height = imageBitmap.height;

                      const ctx = canvas.getContext("2d");
                      if (!ctx) {
                        throw new Error("Cannot get 2D context");
                      }

                      ctx.drawImage(imageBitmap, 0, 0);

                      let convertedBlob: Blob | null = null;
                      const mimeType = outputFormat.mimeType;
                      const quality = outputFormat.quality;

                      convertedBlob = await new Promise((resolve) => {
                        if (mimeType === "image/png") {
                          canvas.toBlob((blob) => resolve(blob), mimeType);
                        } else {
                          canvas.toBlob((blob) => resolve(blob), mimeType, quality);
                        }
                      });

                      if (!convertedBlob) {
                        throw new Error("Conversion failed - no blob generated");
                      }

                      const lastDotIndex = file.name.lastIndexOf('.');
                      const baseName = lastDotIndex > 0 ? file.name.substring(0, lastDotIndex) : file.name;
                      const fileName = `${baseName}.${outputFormat.fileExtension}`;

                      const outputFile = new File([convertedBlob], fileName, {
                        type: outputFormat.mimeType,
                      });

                      setDownloadLinks((current) => ({
                        ...current,
                        [file.name]: URL.createObjectURL(outputFile),
                      }));

                      setProgressNumber((current) => ({
                        ...current,
                        [file.name]: 100,
                      }));

                      await new Promise((resolve) =>
                        setTimeout(resolve, 100),
                      );
                    } catch (error) {
                      console.error("Error converting image:", error);
                      setProgressNumber((current) => ({
                        ...current,
                        [file.name]: undefined,
                      }));
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
