const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const { waitBrowserLoadEvent } = require('../test-utils/waitBrowserEvent');
const { readTextFile } = require('../test-utils/readTextFile');

// hideNotifications
let hideNotifications = null;
let hideNotificationsModule = null;
try {
    hideNotificationsModule = require('./hideNotifications');
    hideNotifications = hideNotificationsModule.hideNotifications;
} catch (error) { }

// checkLinks
let checkLinks = null;
let checkLinksModule = null;
try {
    checkLinksModule = require('./checkLinks');
    checkLinks = checkLinksModule.checkLinks;
} catch (error) { }

// addSelection
let addSelection = null;
let addSelectionModule = null;
try {
    addSelectionModule = require('./addSelection');
    addSelection = addSelectionModule.addSelection;
} catch (error) { }

describe('Browser Events Basics', () => {
    let htmlString;

    let dom;
    let document;

    let virtualConsole;
    let consoleLogListener;

    let url;

    beforeEach(async () => {
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

    describe('hideNotifications.js', () => {
        let notificationHtmlString;

        beforeEach(() => {
            global.document = document;

            notificationHtmlString = `
            <li class="notification">
                <h3 class="title">Some Title</h3>
                <p class="text">Some Notification</p>

                <button class="notification-close" type="button">
                    CLOSE
                </button>
            </li>
            `;
        });

        it('should create hideNotifications.js file', () => {
            expect(hideNotificationsModule).not.toBeNull();
        });

        it('should close only one notification on a close button click', async () => {
            await waitBrowserLoadEvent(document);
            
            addAdditionalNotification();
            hideNotifications();

            const clickEvent = new dom.window.Event('click', { bubbles: true });
            const closeButton = document.querySelectorAll('.notification-close')[1];
            closeButton.dispatchEvent(clickEvent);
            
            const notificationElements = [...document.querySelectorAll('.notification')]
            const closedNotificationElement = notificationElements[1];
            const openedNotificationElements = notificationElements
                .filter((_, index) => index !== 1); 
            
            const areOtherElementsRemain = openedNotificationElements
                .every((notification) => notification.style.display !== 'none');

            expect(areOtherElementsRemain).toBe(true);
            expect(closedNotificationElement.style.display).toBe('none');
        });

        it('should do nothing when click on some over element', async () => {
            await waitBrowserLoadEvent(document);
            
            addAdditionalNotification();
            hideNotifications();

            const clickEvent = new dom.window.Event('click', { bubbles: true });
            const notificationText = document.querySelectorAll('.notification .text')[1];
            notificationText.dispatchEvent(clickEvent);
            
            const notificationElements = [...document.querySelectorAll('.notification')]
            const areAllElementsRemain = notificationElements
                .every((notification) => notification.style.display !== 'none');

            expect(areAllElementsRemain).toBe(true);
        });

        function addAdditionalNotification() {
            const notifications = document.querySelector('.notifications')
            notifications && notifications.insertAdjacentHTML('beforeend', notificationHtmlString);
        }
    });

    describe('checkLinks.js', () => {
        let otherLinkAddress1;
        let otherLinkAddress2;

        let confirmMock;
        let confirmMessage;

        beforeEach(() => {
            jest.resetAllMocks();

            confirmMock = jest.fn();
            confirmMessage = 'Do you want to proceed and leave our cool website?';

            global.document = document;

            otherLinkAddress1 = 'https://otherLinkAddress1.com';
            otherLinkAddress2 = 'https://otherLinkAddress2.com';

            confirmMock.mockReturnValue(false);

            global.confirm = confirmMock;
            global.location = dom.window.location;
        });

        it('should create checkLinks.js file', () => {
            expect(checkLinksModule).not.toBeNull();
        });

        it('should show confirmation', async () => {
            await waitBrowserLoadEvent(document);
            replaceOtherLinks();
            checkLinks();

            
            const links = getLinks();
            const lastLink = links[4];
            const clickEvent = new dom.window.Event('click', { bubbles: true });
            
            lastLink.dispatchEvent(clickEvent);

            expect(confirmMock).toHaveBeenCalledWith(confirmMessage);
        });

        it('should not show confirmation for a website links', async () => {
            await waitBrowserLoadEvent(document);
            replaceOtherLinks();
            checkLinks();

            const links = getLinks();
            const firstLink = links[0];
            const clickEvent = new dom.window.Event('click', { bubbles: true });

            firstLink.dispatchEvent(clickEvent);
            expect(confirmMock).not.toHaveBeenCalled();
        });

        it('should prevent default when user declines', async () => {
            await waitBrowserLoadEvent(document);
            replaceOtherLinks();
            checkLinks();

            const links = getLinks();
            const link = links[4];
            const clickEvent = new dom.window.Event('click', { bubbles: true });
            clickEvent.preventDefault = jest.fn();

            link.dispatchEvent(clickEvent);
            expect(clickEvent.preventDefault).toHaveBeenCalled();
        });

        it('should not prevent default when user confirms redirect', async () => {
            confirmMock.mockReturnValue(true);

            await waitBrowserLoadEvent(document);
            replaceOtherLinks();
            checkLinks();

            const links = getLinks();
            const link = links[4];
            const clickEvent = new dom.window.Event('click', { bubbles: true, cancellable: false });
            clickEvent.preventDefault = jest.fn();

            link.dispatchEvent(clickEvent);
            
            expect(clickEvent.preventDefault).not.toHaveBeenCalled();
        });

        function replaceOtherLinks() {
            const links = getLinks();
            const lastLinkIndex = links.length - 1;

            const lastLink = links[lastLinkIndex];
            const beforeLastLink = links[lastLinkIndex - 1];

            lastLink.href = otherLinkAddress1;
            beforeLastLink.href = otherLinkAddress2;
        };

        function getLinks() {
            return [...document.querySelectorAll('.check-links a')];
        }
    });

    describe('addSelection.js', () => {
        let additionalySelectableItems;
        let selectedClassName;

        let clickEvent;

        beforeEach(() => {
            jest.resetAllMocks();

            additionalySelectableItems = `<li class="selectable-item">RHCP</li>
            <li class="selectable-item">Queen</li>`;
            selectedClassName = 'selected';

            clickEvent = new dom.window.Event('click', { bubbles: true });

            global.document = document;
        });

        it('should create addSelection.js file', () => {
            expect(addSelectionModule).not.toBeNull();
        });

        it('should select one item', async () => {
            await waitBrowserLoadEvent(document);
            addSelectableItems();
            addSelection();
            
            const selectableItems = getSelectableItems();
            const itemIndex = selectableItems.length - 1;
            const [selectableItem, itemsWithoutSelected] = separateItemFromTheRest(itemIndex, selectableItems);

            selectableItem.dispatchEvent(clickEvent);

            const areTheRestItemsAreNotSelected = itemsWithoutSelected
                .every((item) => !item.classList.contains(selectedClassName));

            expect(areTheRestItemsAreNotSelected).toBe(true);
            expect(selectableItem.classList.contains(selectedClassName)).toBe(true);
        });

        it('should deselect previously selected item', async () => {
            await waitBrowserLoadEvent(document);
            addSelectableItems();
            addSelection();

            const selectableItems = getSelectableItems();
            const previouslySelectedItem1 = selectableItems[2];
            previouslySelectedItem1.classList.add(selectedClassName);
            const previouslySelectedItem2 = selectableItems[3];
            previouslySelectedItem2.classList.add(selectedClassName);

            const itemIndex = selectableItems.length - 1;
            const [selectableItem, itemsWithoutSelected] = separateItemFromTheRest(itemIndex, selectableItems);

            selectableItem.dispatchEvent(clickEvent);

            const areTheRestItemsAreNotSelected = itemsWithoutSelected
                .every((item) => !item.classList.contains(selectedClassName));

            expect(areTheRestItemsAreNotSelected).toBe(true);
            expect(selectableItem.classList.contains(selectedClassName)).toBe(true);
        });

        describe('when CTRL/CMD key pressed', () => {
            beforeEach(() => {
                clickEvent = new dom.window.MouseEvent('click', { bubbles: true, ctrlKey: true });
            });

            it('should select an item and not deselect previously selected item', async () => {
                await waitBrowserLoadEvent(document);
                addSelectableItems();
                addSelection();
    
                const selectableItems = getSelectableItems();
                const previouslySelectedItemIndex = 2;
                const itemIndex = selectableItems.length - 1;
                const [selectableItem, itemsWithouNewlytSelected] = separateItemFromTheRest(itemIndex, selectableItems);
                const [previouslySelectedItem, itemsWithoudAllSelected] = separateItemFromTheRest(previouslySelectedItemIndex, itemsWithouNewlytSelected);
                previouslySelectedItem.classList.add(selectedClassName);

                selectableItem.dispatchEvent(clickEvent);
    
                const areTheRestItemsAreNotSelected = itemsWithoudAllSelected
                    .every((item) => !item.classList.contains(selectedClassName));
    
                expect(areTheRestItemsAreNotSelected).toBe(true);
                expect(selectableItem.classList.contains(selectedClassName)).toBe(true);
                expect(previouslySelectedItem.classList.contains(selectedClassName)).toBe(true);
            });

            it('should deselect an item and not deselect previously selected item', async () => {
                await waitBrowserLoadEvent(document);
                addSelectableItems();
                addSelection();
    
                const selectableItems = getSelectableItems();
                const previouslySelectedItemIndex = 2;
                const itemIndex = selectableItems.length - 1;
                const [selectableItem, itemsWithouNewlytSelected] = separateItemFromTheRest(itemIndex, selectableItems);
                const [previouslySelectedItem, itemsWithoudAllSelected] = separateItemFromTheRest(previouslySelectedItemIndex, itemsWithouNewlytSelected);
                selectableItem.classList.add(selectedClassName);
                previouslySelectedItem.classList.add(selectedClassName);

                selectableItem.dispatchEvent(clickEvent);
    
                const areTheRestItemsAreNotSelected = itemsWithoudAllSelected
                    .every((item) => !item.classList.contains(selectedClassName));
     
                expect(areTheRestItemsAreNotSelected).toBe(true);
                expect(selectableItem.classList.contains(selectedClassName)).toBe(false);
                expect(previouslySelectedItem.classList.contains(selectedClassName)).toBe(true);
            });
        });

        function addSelectableItems() {
            const ul = document.querySelector('.add-selection list');
            ul && ul.insertAdjacentHTML('beforeend', additionalySelectableItems);
        };

        function getSelectableItems() {
            return [...document.querySelectorAll('.add-selection .selectable-item')];
        }

        function separateItemFromTheRest(itemIndex, allItems) {
            const selectableItem = allItems[itemIndex];
            const itemsWithoutSelected = allItems.filter((_, index) => index !== itemIndex);

            return [selectableItem, itemsWithoutSelected]
        }
    });
});
