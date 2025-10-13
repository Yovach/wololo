"use client";

import { useQuery } from "@tanstack/react-query";
import mime from "mime/lite";
import {
  FormEvent,
  memo,
  NamedExoticComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { DEFAULT_FORMATS, getAvailableFormats } from "../../helpers/api";
import { sendConvertFileRequest } from "../../helpers/send-convert-file-request";
import { useFFmpeg } from "../../contexts/ffmpeg-context";
import { ffmpegInstance } from "../../helpers/ffmpeg";
import { saveAs } from "file-saver";

const Translations = {
  video: "Video",
  audio: "Audio",
  image: "Image",
} as const;

export const ConvertFileForm: NamedExoticComponent = memo(
  function ConvertFileForm() {
    const { isReady } = useFFmpeg();
    const [errorMessage, setErrorMessage] = useState<string>();
    const onSubmit = useCallback(
      async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        const formData = new FormData(evt.currentTarget);

        let blob: Blob | null = null;
        let fileName: string | null = null;

        try {
          if (isReady) {
            const file = formData.get("file");
            if (file instanceof File) {
              // Ensure format is string
              const format = formData.get("format");
              if (typeof format !== "string") {
                throw new Error("Invalid format");
              }

              // Get mimeType from selected format and check if it's valid
              const mimeType = mime.getType(format);
              if (typeof mimeType !== "string") {
                throw new Error("Invalid format");
              }

              const fileBytes = await file.arrayBuffer();
              const fileContent = new Uint8Array(fileBytes);
              await ffmpegInstance.writeFile(file.name, fileContent);

              fileName = `output.${format}`;

              await ffmpegInstance.exec(["-i", file.name, fileName]);

              const data = await ffmpegInstance.readFile(fileName);
              if (typeof data !== "string") {
                blob = new Blob([new Uint8Array(data)], { type: mimeType });
                ffmpegInstance.deleteFile(fileName);
              } else {
                setErrorMessage("This format is not supported");
              }
            }
          } else {
            const response = await sendConvertFileRequest(formData);
            if (response.ok) {
              blob = await response.blob();
              fileName = response.headers.get("x-file-name");
            } else {
              const json = await response.json();
              setErrorMessage(json.error);
            }
          }
        } catch (e) {
          console.error(e);
          setErrorMessage("An error occured");
        }

        if (blob !== null && fileName !== null) {
          saveAs(blob, fileName);
        }
      },
      [isReady],
    );

    // const formats = use(availableFormatsPromise).formats;
    const { data: formats } = useQuery({
      queryKey: ["available-formats"],
      initialData: DEFAULT_FORMATS,
      queryFn: () => getAvailableFormats().then((val) => val.formats),
    });
    const groups = useMemo(
      () => Object.keys(formats) as unknown as (keyof typeof formats)[],
      [formats],
    );

    return (
      <>
        <form
          id="form"
          action="/"
          method="post"
          encType="multipart/form-data"
          onSubmit={onSubmit}
        >
          <div className="fields">
            <fieldset className="field-format">
              <label htmlFor="select-formats">
                Please select an output format
              </label>
              <select id="select-formats" name="format">
                {groups.map((group) => (
                  <optgroup
                    label={Translations[group]}
                    key={`SelectFormat.${group}`}
                  >
                    {formats[group].map((format) => (
                      <option key={`SelectFormat.${group}.${format}`}>
                        {format}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </fieldset>

            <fieldset>
              <input type="file" name="file" required />
            </fieldset>
          </div>

          <button type="submit">Convert your file</button>
        </form>

        {errorMessage != null && (
          <div className="error-container">
            <span id="error-message">{errorMessage}</span>
          </div>
        )}
      </>
    );
  },
);
