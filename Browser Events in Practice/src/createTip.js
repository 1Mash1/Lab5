export function createTip(tipText) {
    const section = document.createElement('section');
    section.className = 'tip';
    section.tabIndex = 0;

    const title = document.createElement('h3');
    title.className = 'tip__title';
    title.textContent = '💡 Tip of the day:';

    const text = document.createElement('p');
    text.className = 'tip__text';
    text.textContent = tipText;

    const check = document.createElement('p');
    check.className = 'tip__check hidden';
    check.textContent = '✅Got it!';

    section.appendChild(title);
    section.appendChild(text);
    section.appendChild(check);

    section.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            check.classList.toggle('hidden');
        } else if (event.key === 'Escape') {
            const isConfirmed = confirm('Are you sure you want remove this tip?');
            if (isConfirmed) {
                section.remove();
            }
        }
    });

    return section;
}
