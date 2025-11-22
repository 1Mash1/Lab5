export function hideNotifications() {
    const notificationsContainer = document.querySelector('.notifications');

    if (!notificationsContainer) return;

    notificationsContainer.addEventListener('click', function(event) {
        const closeButton = event.target.closest('.notification-close');

        if (closeButton) {
            const notification = closeButton.closest('.notification');
            if (notification) {
                notification.style.display = 'none';
            }
        }
    });
}
