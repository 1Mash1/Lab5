export function checkLinks() {
    const linksContainer = document.querySelector('.check-links');

    if (!linksContainer) return;

    linksContainer.addEventListener('click', function(event) {
        const link = event.target.closest('a');

        if (!link) return;

        const originalHref = link.getAttribute('href');

        if (originalHref && (originalHref.startsWith('http://') || originalHref.startsWith('https://'))) {
            const shouldProceed = confirm('Do you want to proceed and leave our cool website?');

            if (!shouldProceed) {
                event.preventDefault();
            }
        }
    });
}
