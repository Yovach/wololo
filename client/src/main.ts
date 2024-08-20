import './css/style.css';
import { getAvailableFormats } from './helpers/api';
import { isSelectElement } from './helpers/main';

const selectEl = document.getElementById("select-formats");
if (!isSelectElement(selectEl)) {
    throw new Error("Missing or invalid format selector")
}

const availableFormats = await getAvailableFormats();

for (const format of availableFormats) {
    const option = document.createElement("option");
    option.textContent = format;
    selectEl.appendChild(option);
}
