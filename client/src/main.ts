import "./css/style.css";

import { getAvailableFormats } from "./helpers/api";
import { isFormElement, isSelectElement } from "./helpers/main";

const formEl = document.getElementById("form");
if (!isFormElement(formEl)) {
  throw new Error("Missing or invalid form element");
}

const selectEl = document.getElementById("select-formats");
if (!isSelectElement(selectEl)) {
  throw new Error("Missing or invalid format selector");
}

function createOptGroupFromFormats(label: string, formats: Array<string>): HTMLOptGroupElement {
  const optGroupEl = document.createElement("optgroup");
  optGroupEl.label = label;
  for (const format of formats) {
    const option = document.createElement("option");
    option.textContent = format;
    optGroupEl.appendChild(option);
  }
  return optGroupEl;
}

getAvailableFormats().then((availableFormats) => {
  const optGroupVideoEl = createOptGroupFromFormats(
    "Video",
    availableFormats.formats.video
  )
  selectEl.appendChild(optGroupVideoEl)

  const optGroupImageEl = createOptGroupFromFormats(
    "Image",
    availableFormats.formats.image
  )
  selectEl.appendChild(optGroupImageEl)

  const optGroupAudioEl = createOptGroupFromFormats(
    "Audio",
    availableFormats.formats.audio
  )
  selectEl.appendChild(optGroupAudioEl)
});

formEl.addEventListener("submit", (evt: SubmitEvent) => {
  evt.preventDefault();

  const target = evt.currentTarget;
  if (!isFormElement(target)) {
    return;
  }

  import("./helpers/send-convert-file-request")
    .then(({ sendConvertFileRequest }) => {
      const formData = new FormData(target);
      return sendConvertFileRequest(formData);
    })
    .then(async (response) => {
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
        const errorMessageEl = document.getElementById("error-message");
        if (errorMessageEl) {
          errorMessageEl.textContent = json.error;
        }
      }
    });
});
