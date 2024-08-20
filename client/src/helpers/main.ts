export function isSelectElement(htmlElement: HTMLElement | null): htmlElement is HTMLSelectElement {
    return htmlElement instanceof HTMLSelectElement;
}
