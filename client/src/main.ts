import './css/style.css';

import { getAvailableFormats } from './helpers/api';
import { isFormElement, isSelectElement } from './helpers/main';

const formEl = document.getElementById("form");
if (!isFormElement(formEl)) {
    throw new Error("Missing or invalid form element")
}

const selectEl = document.getElementById("select-formats");
if (!isSelectElement(selectEl)) {
    throw new Error("Missing or invalid format selector")
}

getAvailableFormats().then((availableFormats) => {
    for (const format of availableFormats) {
        const option = document.createElement("option");
        option.textContent = format;
        selectEl.appendChild(option);
    }
})

formEl.addEventListener("submit", (evt: SubmitEvent) => {
    evt.preventDefault();

    const target = evt.currentTarget;
    if (!isFormElement(target)) {
        return;
    }

    import("./helpers/send-convert-file-request").then(({ sendConvertFileRequest }) => {
        const formData = new FormData(target);
        return sendConvertFileRequest(formData)
    }).then(async (response) => {
        const blob = await response.blob();
        const filename = response.headers.get("x-file-name");

        console.log(response);
        const tmpUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = tmpUrl;
        anchor.download = filename ?? crypto.randomUUID();
        anchor.click();

        URL.revokeObjectURL(tmpUrl);
    })
})
