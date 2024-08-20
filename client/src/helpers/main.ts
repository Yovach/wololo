export function isSelectElement(htmlElement: HTMLElement | null): htmlElement is HTMLSelectElement {
    return htmlElement instanceof HTMLSelectElement;
}

export function isFormElement(htmlElement: HTMLElement | EventTarget | null): htmlElement is HTMLFormElement {
    return htmlElement instanceof HTMLFormElement;
}
