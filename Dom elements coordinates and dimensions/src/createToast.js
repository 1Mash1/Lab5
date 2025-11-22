export function createToast(element) {
    const toastElement = document.createElement('div');
    toastElement.className = 'toast';

    toastElement.style.position = 'fixed';
    toastElement.style.top = '20px';
    toastElement.style.right = '20px';

    toastElement.appendChild(element);

    return toastElement;
}
