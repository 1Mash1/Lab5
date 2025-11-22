export function addSelection() {
    const selectionContainer = document.querySelector('.add-selection');

    if (!selectionContainer) return;

    selectionContainer.addEventListener('click', function(event) {
        const item = event.target.closest('.selectable-item');

        if (!item) return;

        if (event.ctrlKey || event.metaKey) {
            item.classList.toggle('selected');
        } else {
            const allItems = document.querySelectorAll('.selectable-item');
            allItems.forEach(otherItem => {
                otherItem.classList.remove('selected');
            });
            item.classList.add('selected');
        }
    });
}
