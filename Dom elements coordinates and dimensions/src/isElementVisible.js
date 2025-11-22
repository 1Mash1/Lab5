export function isElementVisible(element) {
    if (element === null || element === undefined) {
        return false;
    }

    return element.offsetHeight > 0 || element.offsetWidth > 0;
}
