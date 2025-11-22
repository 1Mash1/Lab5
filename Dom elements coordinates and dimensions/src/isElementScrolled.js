export function isElementScrolled(element) {
    if (element === null || element === undefined) {
        return {
            scrollTop: null,
            scrollLeft: null,
            isScrolled: null
        };
    }

    const scrollTop = element.scrollTop || 0;
    const scrollLeft = element.scrollLeft || 0;

    const isScrolled = scrollTop > 0 || scrollLeft > 0;

    return {
        scrollTop,
        scrollLeft,
        isScrolled
    };
}
