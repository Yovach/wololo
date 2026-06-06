import type { DropEvent, FileDropItem, Selection } from "@react-types/shared";
import { filesize } from "filesize";
import { FileUpIcon, ImageIcon } from "lucide-react";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FileTrigger, type Key } from "react-aria-components";
import {
  AVIF_FORMAT,
  checkAvifSupport,
  type ImageOutputFormat,
  OUTPUT_FORMAT_CONVERTERS,
} from "../../helpers/output";
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

const columns = [
  { name: "Name", id: "name", isRowHeader: true },
  { name: "Size", id: "size" },
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
  const [selectedFormat, setSelectedFormat] = useState<Key | null>(
    OUTPUT_FORMAT_CONVERTERS[0]?.mimeType || null,
  );
  const selectedFormatExtension = useMemo(() => {
    if (!selectedFormat) return null;
    const format = OUTPUT_FORMAT_CONVERTERS.find(
      (f) => f.mimeType === selectedFormat,
    );
    if (format) return format.fileExtension;
    if (selectedFormat === AVIF_FORMAT.mimeType)
      return AVIF_FORMAT.fileExtension;
    return null;
  }, [selectedFormat]);
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

    return allFormats
      .map((val) => ({
        id: val.mimeType,
        name: val.fileExtension,
        label: `.${val.fileExtension}`,
      }))
      .toSorted((a, b) => a.id.localeCompare(b.id));
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
      <div className="flex flex-col items-center justify-center pt-12">
        <h1 className="mb-2 text-2xl font-semibold text-gray-800">
          Image Converter
        </h1>
        <p className="mb-6 text-gray-500">
          Convert your images to JPEG, PNG, WebP or AVIF
        </p>

        <DropZone onDrop={onDrop} className="flex justify-center">
          <FileTrigger allowsMultiple onSelect={onSelect}>
            <Button className="relative flex h-48 w-96 cursor-pointer flex-col items-center justify-center gap-y-3 rounded-2xl border-2 border-dashed border-gray-300 bg-white px-12 py-8 shadow-sm transition-all hover:border-blue-500 hover:bg-gray-50 hover:shadow-md drop-target:border-blue-500 drop-target:bg-blue-50/20">
              <FileUpIcon className="size-8 text-gray-500" />
              <span className="text-base font-medium text-gray-700">
                Drop images here or click to browse
              </span>
              <span className="text-sm text-gray-400">
                Supports: JPG, PNG, WebP, GIF, SVG
              </span>
            </Button>
          </FileTrigger>
        </DropZone>
      </div>

      {files.length > 0 && (
        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center">
          <Table
            selectionMode="multiple"
            aria-label="Uploaded files"
            selectedKeys={selectedFilesNames}
            onSelectionChange={setSelectedFilesNames}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <Column
                  isRowHeader={"isRowHeader" in column}
                  className="bg-gray-50 py-3"
                  width={column.id === "name" ? "1fr" : 120}
                >
                  <span className="text-sm font-medium text-gray-500">
                    {column.name}
                  </span>
                </Column>
              )}
            </TableHeader>
            <TableBody
              items={tableRows}
              dependencies={[downloadLinks]}
              className="divide-y divide-gray-100"
            >
              {(item) => {
                return (
                  <Row
                    id={item.name}
                    columns={columns}
                    dependencies={[downloadLinks[item.file.name]]}
                    className="group transition-colors hover:bg-gray-50/50"
                  >
                    {(column) => (
                      <Cell className="py-3">
                        <div className="flex items-center gap-x-3">
                          {column.id === "name" && (
                            <FilePreview file={item.file} size={32} />
                          )}
                          <span className="text-sm text-gray-700">
                            {item[column.id]}
                          </span>
                        </div>
                      </Cell>
                    )}
                  </Row>
                );
              }}
            </TableBody>
          </Table>

          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-auto">
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
                      <span>{item.label}</span>
                    </SelectItem>
                  );
                }}
              </Select>
            </div>

            <Button
              className="w-full bg-blue-600 text-white transition-colors hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              isDisabled={selectedFiles.length === 0}
              onClick={async () => {
                const outputFormat: ImageOutputFormat | undefined =
                  OUTPUT_FORMAT_CONVERTERS.find(
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
                          canvas.toBlob(
                            (blob) => resolve(blob),
                            mimeType,
                            quality,
                          );
                        }
                      });

                      if (!convertedBlob) {
                        throw new Error(
                          "Conversion failed - no blob generated",
                        );
                      }

                      const lastDotIndex = file.name.lastIndexOf(".");
                      const baseName =
                        lastDotIndex > 0
                          ? file.name.substring(0, lastDotIndex)
                          : file.name;
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

                      await new Promise((resolve) => setTimeout(resolve, 100));
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
              {selectedFormatExtension
                ? `Convert ${selectedFiles.length} file(s) to .${selectedFormatExtension}`
                : `Convert ${selectedFiles.length} file(s)`}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
});
