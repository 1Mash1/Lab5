export function createBlurredCoverElement(elementToCover) {
    const coverElement = document.createElement('div');
    coverElement.className = 'cover';

    const rect = elementToCover.getBoundingClientRect();

    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const absoluteTop = rect.top + scrollY;
    const absoluteLeft = rect.left + scrollX;

    coverElement.style.position = 'absolute';
    coverElement.style.top = absoluteTop + 'px';
    coverElement.style.left = absoluteLeft + 'px';
    coverElement.style.width = rect.width + 'px';
    coverElement.style.height = rect.height + 'px';

    return coverElement;
}
