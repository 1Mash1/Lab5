const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const { waitBrowserLoadEvent } = require('../test-utils/waitBrowserEvent');
const { readTextFile } = require('../test-utils/readTextFile');

// createTip
let createTip = null;
let createTipModule = null;
try {
    createTipModule = require('./createTip');
    createTip = createTipModule.createTip;
} catch (error) { }

// validateEmailForm
let validateEmailForm = null;
let validateEmailFormModule = null;
try {
    validateEmailFormModule = require('./validateEmailForm');
    validateEmailForm = validateEmailFormModule.validateEmailForm;
} catch (error) { }

// pageLoad
let pageLoad = null;
let pageLoadModule = null;
try {
    pageLoadModule = require('./pageLoad');
    pageLoad = pageLoadModule.pageLoad;
} catch (error) { }

describe('Browser Events Basics', () => {
    let htmlString;

    let dom;
    let document;

    let virtualConsole;
    let consoleLogListener;

    let url;

    beforeEach(async () => {
        jest.resetAllMocks();

        url = 'https://1.1.1.1/'
        consoleLogListener = jest.fn();
        virtualConsole = new VirtualConsole();
        // You can listen for other console methods as well https://github.com/jsdom/jsdom#virtual-consoles
        virtualConsole.on('log', consoleLogListener);

        const filePath = path.join(__dirname, 'index.html');
        htmlString = await readTextFile(filePath);

        // Create fake DOM
        dom = new JSDOM(htmlString, {
            runScripts: 'dangerously',
            resources: 'usable',
            url,
            virtualConsole,
        });

        document = dom.window.document;
    });

    describe('createTip.js', () => {
        let tipText;

        beforeEach(() => {
            tipText = 'tipText';
            global.document = document;
        });

        it('should create createTip.js file', () => {
            expect(createTipModule).not.toBeNull();
        });

        describe('creating an HTML for a tip', () => {
            it('should create a root <section> element and return it', async () => {
                await waitBrowserLoadEvent(document);

                const tipElement = createTip(tipText);

                expect(tipElement.tagName).toBe('SECTION');
                expect(tipElement.classList.contains('tip')).toBe(true);
            });

            it('tip should have expected title element', async () => {
                await waitBrowserLoadEvent(document);

                const tipElement = createTip(tipText);
                const children = tipElement.children;
                const element = children[0];
                const textContent = element.textContent.trim();

                expect(element.tagName).toBe('H3');
                expect(element.classList.contains('tip__title')).toBe(true);
                expect(textContent).toBe('💡 Tip of the day:');
            });

            it('tip should have expected text element', async () => {
                await waitBrowserLoadEvent(document);

                const tipElement = createTip(tipText);
                const children = tipElement.children;
                const element = children[1];
                const textContent = element.textContent.trim();

                expect(element.tagName).toBe('P');
                expect(element.classList.contains('tip__text')).toBe(true);
                expect(textContent).toBe(tipText);
            });

            it('tip should have hidden tip check element', async () => {
                await waitBrowserLoadEvent(document);

                const tipElement = createTip(tipText);
                const children = tipElement.children;
                const element = children[2];
                const textContent = element.textContent.trim();

                expect(element.tagName).toBe('P');
                expect(element.classList.contains('tip__check')).toBe(true);
                expect(element.classList.contains('hidden')).toBe(true);
                expect(textContent).toBe('✅Got it!');
            });
        });

        describe('event handlers', () => {
            let confirmMock;
            let confirmMessage;

            beforeEach(() => {
                confirmMock = jest.fn();
                confirmMessage = 'Are you sure you want remove this tip?';

                global.confirm = confirmMock;
            });

            it('should toggle tip check on Enter pressed', async () => {
                await waitBrowserLoadEvent(document);

                const tipElement = createTip(tipText);
                const children = tipElement.children;
                const element = children[2];
                tipElement.focus();

                const keyUpEvent1 = createKeyUpEvent('Enter');
                tipElement.dispatchEvent(keyUpEvent1);

                expect(element.classList.contains('hidden')).toBe(false);

                const keyUpEvent2 = createKeyUpEvent('Enter');
                tipElement.dispatchEvent(keyUpEvent2);

                expect(element.classList.contains('hidden')).toBe(true);

            });

            it('should do nothing when some other key pressed', async () => {
                await waitBrowserLoadEvent(document);

                const tipElement = createTip(tipText);
                const children = tipElement.children;
                const element = children[2];
                tipElement.focus();

                const keyUpEvent = createKeyUpEvent('Tab');
                tipElement.dispatchEvent(keyUpEvent);

                expect(element.classList.contains('hidden')).toBe(true);
            });

            it('should show confirmation on Escape pressed', async () => {
                await waitBrowserLoadEvent(document);

                const tipElement = createTip(tipText);
                tipElement.focus();

                document.body.append(tipElement);

                const keyUpEvent = createKeyUpEvent('Escape');
                tipElement.dispatchEvent(keyUpEvent);

                expect(confirmMock).toHaveBeenCalledWith(confirmMessage);
            });

            it('should remove element if confirmed', async () => {
                confirmMock.mockReturnValue(true);
                await waitBrowserLoadEvent(document);

                const tipElement = createTip(tipText);
                tipElement.focus();

                document.body.append(tipElement);

                const keyUpEvent = createKeyUpEvent('Escape');
                tipElement.dispatchEvent(keyUpEvent);
                const removedTipElement = document.querySelector('section.tip');

                expect(removedTipElement).toBeNull();
            });

            function createKeyUpEvent(key) {
                let keyCode;

                if (key === 'Enter') {
                    keyCode = 13;
                }

                if (key === 'Escape') {
                    keyCode = 27;
                }

                if (key === 'Tab') {
                    keyCode = 9;
                }

                return new dom.window.KeyboardEvent('keyup', {
                    cancelable: true,
                    code: key,
                    key,
                    keyCode,
                    which: keyCode,
                });
            }
        });
    });

    describe('validateEmailForm.js', () => {
        let hiddenClassName;

        beforeEach(() => {
            hiddenClassName = 'hidden';
            global.document = document;
            global.CustomEvent = dom.window.CustomEvent;
        });

        it('should create validateEmailForm.js file', () => {
            expect(validateEmailFormModule).not.toBeNull();
        });

        describe('"To" Field Validation', () => {
            it('should be valid when @ char is in the middle of a string', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = 'ggg@lll';
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector('.email-form #to-field-wrapper');
                const toField = toFieldWrapper.querySelector('#to-field');
                const validMark = toFieldWrapper.querySelector('.email-form__valid-mark');
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName))
                    .toBe(false);
            });

            it('should be invalid when @ char is in the middle of a string but string is to short', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = 'g@l';
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector('.email-form #to-field-wrapper');
                const toField = toFieldWrapper.querySelector('#to-field');
                const validMark = toFieldWrapper.querySelector('.email-form__valid-mark');
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName))
                    .toBe(true);
            });

            it('should be invalid when @ char is the first one in a string', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = '@lgggg';
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector('.email-form #to-field-wrapper');
                const toField = toFieldWrapper.querySelector('#to-field');
                const validMark = toFieldWrapper.querySelector('.email-form__valid-mark');
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName))
                    .toBe(true);
            });

            it('should be invalid when @ char is the last one in a string', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = 'lgggg@';
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector('.email-form #to-field-wrapper');
                const toField = toFieldWrapper.querySelector('#to-field');
                const validMark = toFieldWrapper.querySelector('.email-form__valid-mark');
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName))
                    .toBe(true);
            });

            it('should be invalid when @ char in the middle but only with spaces', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = '   k@h   ';
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector('.email-form #to-field-wrapper');
                const toField = toFieldWrapper.querySelector('#to-field');
                const validMark = toFieldWrapper.querySelector('.email-form__valid-mark');
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName))
                    .toBe(true);
            });

            it('should be invalid when there spaces inside', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const newValue = 'kk k@hh';
                const inputEvent = createInputEvent(newValue);

                const toFieldWrapper = document.querySelector('.email-form #to-field-wrapper');
                const toField = toFieldWrapper.querySelector('#to-field');
                const validMark = toFieldWrapper.querySelector('.email-form__valid-mark');
                toField.value = newValue;

                toField.dispatchEvent(inputEvent);

                expect(validMark.classList.contains(hiddenClassName))
                    .toBe(true);
            });

            function createInputEvent(value) {
                return new dom.window.InputEvent('input', {
                    data: value,
                    cancelable: true,
                    bubbles: true,
                });
            }
        });

        describe('"Topic" Field Validation', () => {
            let warningClassName;
            let topicFieldSelector;

            beforeEach(() => {
                topicFieldSelector = '.email-form #topic-field-wrapper #topic-field';
                warningClassName = 'email-form__input_warning';
            });

            it('should get warning class after focus and blur', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const topicField = document.querySelector(topicFieldSelector);

                const focusEvent = createFocusEvent('focus');
                const blurEvent = createFocusEvent('blur');

                topicField.dispatchEvent(focusEvent);
                topicField.dispatchEvent(blurEvent);

                expect(topicField.classList.contains(warningClassName)).toBe(true);
            });

            it('should get warning class after focus and blur if only spaces', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const topicField = document.querySelector(topicFieldSelector);

                const focusEvent = createFocusEvent('focus');
                const blurEvent = createFocusEvent('blur');

                topicField.dispatchEvent(focusEvent);
                topicField.value = '      ';
                topicField.dispatchEvent(blurEvent);

                expect(topicField.classList.contains(warningClassName)).toBe(true);
            });

            it('should remove warning class name on focus', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const topicField = document.querySelector(topicFieldSelector);

                const focusEvent1 = createFocusEvent('focus');
                const focusEvent2 = createFocusEvent('focus');
                const blurEvent = createFocusEvent('blur');

                topicField.dispatchEvent(focusEvent1);
                topicField.dispatchEvent(blurEvent);
                topicField.dispatchEvent(focusEvent2);

                expect(topicField.classList.contains(warningClassName)).toBe(false);
            });

            it('should not add warning class name if topic was typed', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();

                const topicField = document.querySelector(topicFieldSelector);

                const focusEvent = createFocusEvent('focus');
                const blurEvent = createFocusEvent('blur');

                topicField.dispatchEvent(focusEvent);
                topicField.value = ' Some New Topic'
                topicField.dispatchEvent(blurEvent);

                expect(topicField.classList.contains(warningClassName)).toBe(false);
            });

            function createFocusEvent(eventType) {
                return new dom.window.FocusEvent(eventType, {
                    cancelable: true,
                    bubbles: true,
                });
            }
        });

        describe('Form submit button', () => {
            let emailFormSelector;
            let acceptCheckboxSelector;
            let submitButtonSelector;

            beforeEach(() => {
                emailFormSelector = '.email-form';
                acceptCheckboxSelector = `${emailFormSelector} .email-form__accept-terms`;
                submitButtonSelector = `${emailFormSelector} .email-form__button`;
            });

            it('should enable submit button when accepted terms', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();
                const isButtonDisabled = true;
                const { submitButton, acceptCheckbox } = getSubmitControls(isButtonDisabled);
                initiateCheckboxEvents(acceptCheckbox);

                expect(submitButton.disabled).toBe(false);
            });

            it('should disable submit button when not accepted terms', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();
                const isButtonDisabled = true;
                const { submitButton, acceptCheckbox } = getSubmitControls(isButtonDisabled);
                initiateCheckboxEvents(acceptCheckbox);
                initiateCheckboxEvents(acceptCheckbox);

                expect(submitButton.disabled).toBe(true);
            });

            it('should prevent default when submit', async () => {
                await waitBrowserLoadEvent(document);
                validateEmailForm();
                const isButtonDisabled = true;
                const { acceptCheckbox } = getSubmitControls(isButtonDisabled);
                initiateCheckboxEvents(acceptCheckbox);

                const emailForm = document.querySelector(emailFormSelector);
                const submitEvent = createSubmitEvent();
                submitEvent.preventDefault = jest.fn();

                emailForm.dispatchEvent(submitEvent);

                expect(submitEvent.preventDefault).toHaveBeenCalled();
            });

            it('should initiate custom event', async () => {
                await waitBrowserLoadEvent(document);

                validateEmailForm();
                const isButtonDisabled = true;
                const { acceptCheckbox } = getSubmitControls(isButtonDisabled);
                initiateCheckboxEvents(acceptCheckbox);

                const emailForm = document.querySelector(emailFormSelector);
                const submitEvent = createSubmitEvent();
                submitEvent.preventDefault = jest.fn();
                const eventPromise = eventListenerPromise('email-form-submit', document.body);

                emailForm.dispatchEvent(submitEvent);
                const isInitiated = await eventPromise;

                expect(isInitiated).toBe(true);
            });

            function getSubmitControls(isButtonDisabled) {
                const submitButton = document.querySelector(submitButtonSelector);
                const acceptCheckbox = document.querySelector(acceptCheckboxSelector);

                submitButton.disabled = isButtonDisabled;
                acceptCheckbox.checked = false;

                return { submitButton, acceptCheckbox };
            }

            function initiateCheckboxEvents(acceptCheckbox) {
                const options = {
                    cancelable: true,
                    bubbles: true,
                };

                const clickEvent = new dom.window.MouseEvent('click', options);
                const changeEvent = new dom.window.Event('change', options);
                const inputEvent = new dom.window.Event('input', options);

                acceptCheckbox.dispatchEvent(inputEvent);
                acceptCheckbox.dispatchEvent(clickEvent);
                acceptCheckbox.dispatchEvent(changeEvent);
            }

            function createSubmitEvent() {
                return new dom.window.Event('submit', {
                    cancelable: true,
                    bubbles: true,
                });
            }

            function eventListenerPromise(eventType, element) {
                return new Promise((resolve) => {
                    element.addEventListener(eventType, () => {
                        resolve(true);
                    });
                });
            }
        });
    });

    describe('pageLoad.js', () => {
        beforeEach(() => {
            global.window = dom.window;
            global.document = document;
        });

        it('should create pageLoad.js file', () => {
            expect(pageLoadModule).not.toBeNull();
        });

        it('should add an event handler for "beforeunload" event', async () => {
            await waitBrowserLoadEvent(document);

            pageLoad();

            const onbeforeunload = dom.window.onbeforeunload;
            expect(onbeforeunload()).toBe(false);
        });

        it('should add Page Loaded message', async () => {
            pageLoad();
            await waitBrowserLoadEvent(document);

            const loadedMessage = document.body.firstElementChild;

            expect(loadedMessage.tagName).toBe('DIV');
            expect(loadedMessage.classList.contains('page-load-mark')).toBe(true);
            expect(loadedMessage.textContent.trim()).toBe('✅ Page loaded successfully');
        });
    });

});
