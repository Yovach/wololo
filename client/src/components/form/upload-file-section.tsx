import { memo, useState } from "react";
import {
  Button,
  DropZone,
  FileDropItem,
  FileTrigger,
  Text,
} from "react-aria-components";

export const UploadFileSection = memo(function UploadFileSection() {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <section>
      <DropZone
        onDrop={(evt) => {
          const files = evt.items.filter(
            (file) => file.kind === "file",
          ) as FileDropItem[];
          const filenames = files.map((file) => file.name);
          setFiles(filenames.join(", "));
        }}
      >
        <FileTrigger
          allowsMultiple
          onSelect={(e) => {
            const files = Array.from(e);
            const filenames = files.map((file) => file.name);
            setFiles(filenames.join(", "));
          }}
        >
          <Button>Select files</Button>
        </FileTrigger>
        <Text>Drag and drop your file here, or click to select a file</Text>
      </DropZone>
    </section>
  );
});
