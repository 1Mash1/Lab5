export function getPageData() {

    const windowHeight = document.documentElement.clientHeight;
    const windowWidth = document.documentElement.clientWidth;

    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );

    const documentWidth = Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth
    );

    const currentScrollFromTop = window.pageYOffset || document.documentElement.scrollTop;
    const currentScrollFromLeft = window.pageXOffset || document.documentElement.scrollLeft;

    return {
        windowHeight,
        windowWidth,
        documentHeight,
        documentWidth,
        currentScrollFromTop,
        currentScrollFromLeft
    };
}
