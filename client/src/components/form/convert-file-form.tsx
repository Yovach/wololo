"use client";

import { FormEvent, memo, use, useCallback, useMemo, useState } from "react";
import { sendConvertFileRequest } from "../../helpers/send-convert-file-request";
import { getAvailableFormats } from "../../helpers/api";
import { useFFmpeg } from "../../hooks/use-ffmpeg";
import mime from "mime/lite";

type Props = {
  availableFormatsPromise: ReturnType<typeof getAvailableFormats>;
};

const Translations = {
  video: "Video",
  audio: "Audio",
  image: "Image",
} as const;

export const ConvertFileForm = memo(function ConvertFileForm({
  availableFormatsPromise,
}: Props) {
  const { ffmpeg, isReady } = useFFmpeg();
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
            await ffmpeg.writeFile(file.name, fileContent);

            fileName = `output.${format}`;

            await ffmpeg.exec(["-i", file.name, fileName]);

            const data = await ffmpeg.readFile(fileName);
            blob = new Blob([data], { type: mimeType });

            ffmpeg.deleteFile(fileName);
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
        const tmpUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = tmpUrl;
        anchor.download = fileName ?? crypto.randomUUID();
        anchor.click();
        URL.revokeObjectURL(tmpUrl);
      }
    },
    [isReady, ffmpeg],
  );

  const formats = use(availableFormatsPromise).formats;
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
});
