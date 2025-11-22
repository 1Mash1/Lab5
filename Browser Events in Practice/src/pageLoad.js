export function pageLoad() {

    const loadMark = document.createElement('div');
    loadMark.className = 'page-load-mark';
    loadMark.textContent = '✅ Page loaded successfully';
    document.body.insertBefore(loadMark, document.body.firstChild);

    window.addEventListener('beforeunload', function(event) {
        event.preventDefault();
        event.returnValue = false;
        return false;
    });

    window.onbeforeunload = function() {
        return false;
    };
}
