const path = require('path');
const {JSDOM, VirtualConsole} = require('jsdom');

const {readTextFile} = require('../test-utils/readTextFile');
const {waitBrowserLoadEvent} = require('../test-utils/waitBrowserEvent');
const {addFileProtocolToElements} = require('../test-utils/addFileProtocolToElements');
const {replaceScriptSrcFilePathInString} = require('../test-utils/replaceScriptSrcFilePathInString');
jest.setTimeout(20000);

describe('Useful browser features and APIs', () => {
    let htmlString;
    let emptyHtmlString;

    let dom;
    let document;
    let emptyDOM;
    let emptyDocument;

    let virtualConsole;
    let consoleLogListener;


    beforeEach(async () => {
        consoleLogListener = jest.fn();
        virtualConsole = new VirtualConsole();
        virtualConsole.on('log', consoleLogListener);

        const filePath = path.join(__dirname, '../test-utils/index-test.html');
        const sampleFilePath = path.join(__dirname, '../test-utils/empty-sample.html');
        htmlString = await readTextFile(filePath);
        emptyHtmlString = await readTextFile(sampleFilePath);
        const newHtmlString = replaceScriptSrcFilePathInString(htmlString, ['script.js'], __dirname);
        const emptyNewHtmlString = replaceScriptSrcFilePathInString(emptyHtmlString, ['script.js'], __dirname);

        // Create fake DOM
        dom = new JSDOM(newHtmlString, {
            url: 'https://www.site-test-domain.com/path/?query-one=one&query-two=two',
            runScripts: 'dangerously',
            resources: 'usable',
            virtualConsole,
        });
        document = dom.window.document;

        // Create empty DOM for testing
        emptyDOM = new JSDOM(emptyNewHtmlString, {
            url: 'https://www.site-test-domain.com/path/?query-one=one&query-two=two',
            runScripts: 'dangerously',
            resources: 'usable',
            virtualConsole,
        });
        emptyDocument = emptyDOM.window.document;

        const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
        addFileProtocolToElements(linkElements, 'href', __dirname);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getClassArray', () => {
        it('should return array of classes', async () => {
            await waitBrowserLoadEvent(document);

            const getClassArray = dom.window.getClassArray;
            const classArray = getClassArray();

            expect(classArray).toEqual(["wrapper", "paragraph"]);
        });

        it('should return empty array when DOM does not have any elements with class attribute', async () => {
            await waitBrowserLoadEvent(emptyDocument);

            const getClassArray = emptyDOM.window.getClassArray;
            const classArray = getClassArray();

            expect(classArray).toEqual([]);
        });
    });

    describe('addContentToContainer', () => {
        it('should add text', async () => {
            await waitBrowserLoadEvent(document);

            const addContentToContainer = dom.window.addContentToContainer;
            addContentToContainer('text');

            expect(dom.window.task2.innerHTML).toEqual('text');
        });

        it('should add paragraph tag with text', async () => {
            await waitBrowserLoadEvent(document);

            const addContentToContainer = dom.window.addContentToContainer;
            addContentToContainer('<p>text</p>');

            expect(dom.window.task2.innerHTML).toEqual('<p>text</p>');
        });
    });

    describe('removeHiddenParagraphs', () => {
        it('should return 2 when container with id="task2" has 2 hidden items', async () => {
            await waitBrowserLoadEvent(document);
            const removeHiddenParagraphs = dom.window.removeHiddenParagraphs;
            const numberOfRemovedItems = removeHiddenParagraphs();

            expect(numberOfRemovedItems).toEqual(2);
        });

        it('should return 0 when container with id="task2" has 0 hidden items', async () => {
            await waitBrowserLoadEvent(emptyDocument);

            const removeHiddenParagraphs = emptyDOM.window.removeHiddenParagraphs;
            const numberOfRemovedItems = removeHiddenParagraphs();

            expect(numberOfRemovedItems).toEqual(0);
        });

        it('should have items with class="paragraph_hidden" before removeHiddenParagraphs function execution', async () => {
            await waitBrowserLoadEvent(document);

            expect(dom.window.task3.innerHTML).toContain('hidden');
        });

        it('should remain only items without class="paragraph_hidden"', async () => {
            await waitBrowserLoadEvent(document);
            const removeHiddenParagraphs = dom.window.removeHiddenParagraphs;
            removeHiddenParagraphs();

            expect(dom.window.task3.innerHTML).not.toContain('hidden');
        });
    });

    describe('setDataAttr', () => {
        it('should add attribute data-type="text" for tag that does NOT have nested tags', async () => {
            await waitBrowserLoadEvent(document);

            const setDataAttr = dom.window.setDataAttr;
            setDataAttr();

            const textElement =  dom.window.document.querySelector('#task4 h3').outerHTML;

            expect(textElement).toContain('data-type="text"');
        });

        it('should add attribute data-type="text" for tag that does NOT have nested tags ', async () => {
            await waitBrowserLoadEvent(document);

            const setDataAttr = dom.window.setDataAttr;
            setDataAttr();

            const textElement =  dom.window.document.querySelector('#task4 p').outerHTML;

            expect(textElement).toContain('data-type="text"');
        });

        it('should add attribute data-type="container" for tag that have nested tags ', async () => {
            await waitBrowserLoadEvent(document);

            const setDataAttr = dom.window.setDataAttr;
            setDataAttr();

            const textElement =  dom.window.document.querySelector('#task4 section').outerHTML;

            expect(textElement).toContain('data-type="container"');
        });
    });
});
