import { FormEvent, useCallback, useState } from "react";
import { sendConvertFileRequest } from "../../helpers/send-convert-file-request";

export function ConvertFileForm() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const onSubmit = useCallback(async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    try {
      const response = await sendConvertFileRequest(formData);
      if (response.ok) {
        const blob = await response.blob();
        const filename = response.headers.get("x-file-name");

        const tmpUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = tmpUrl;
        anchor.download = filename ?? crypto.randomUUID();
        anchor.click();
        URL.revokeObjectURL(tmpUrl);
      } else {
        const json = await response.json();
        setErrorMessage(json.error);
      }
    } catch (e) {
      setErrorMessage("An error occured");
    }
  }, []);

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
            <select id="select-formats" name="format"></select>
          </fieldset>

          <fieldset>
            <input type="file" name="file" />
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
}
