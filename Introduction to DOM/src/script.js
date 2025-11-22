function getClassArray() {
    const container = document.getElementById('task1');
    const elements = container.getElementsByTagName('*');
    const result = [];

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.className && element.className !== '' && !element.className.includes('paragraph_hidden')) {
            result.push(element.className);
        }
    }

    return result;
}

function addContentToContainer(data) {
    const container = document.getElementById('task2');
    container.innerHTML = data;
}

function removeHiddenParagraphs() {
    const container = document.getElementById('task3');
    const elements = container.querySelectorAll('*');
    let count = 0;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.className && element.className.includes('hidden')) {
            element.remove();
            count++;
        }
    }

    return count;
}

function setDataAttr() {
    const container = document.getElementById('task4');
    const elements = container.querySelectorAll('*');

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.children.length > 0) {
            element.setAttribute('data-type', 'container');
        } else {
            element.setAttribute('data-type', 'text');
        }
    }
}
