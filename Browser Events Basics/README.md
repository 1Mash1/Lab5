# Browser Events Basics

## Writing Functions for Working With DOM and Events

## Before we start

1. This practical task is verified automatically with tests. 
2. Please, put all your `JavaScript` code in the `src/script.js` and `HTML` code in the `src/index.html` files. Functions from `src/script.js` are used in the `<script>` inside `src/index.html`. If you use any other file, we would not be able to verify it.
3. Please, don't change the page structure, if it is not required for a task. It may affect tests.

## Development

While developing, you can open `src/index.html` in your browser to check it. However, we have prepared a more convenient way to run it locally, you can find the details here: [Local Development](https://gitlab.com/gap-bs-front-end-autocode-documents/autocode-documents/-/blob/main/docs/LocalDevelopment.md).

## Run JavaScript code in RunJS application

`RunJS` is a JavaScript and TypeScript playground for desktop operating systems. It runs code as it's written and displays formatted results in the output panel on the right.

![RunJS application in work](https://gitlab.com/gap-bs-front-end-autocode-documents/autocode-documents/-/raw/main/images/runjs-intro.png)

RunJS is available on macOS, Windows, and Linux operating systems.

Here are detailed instructions how to install and use it: [RunJS documentation](https://runjs.app/docs).

## Check your solution before submitting it (OPTIONAL)
To be sure you submit a correct solution, you can verify it locally. This requires some local setup. Here are the instructions: [Verify your solution locally](https://gitlab.com/gap-bs-front-end-autocode-documents/autocode-documents/-/blob/main/docs/VerifySolutionLocally.md).

## Task Requirements

Every function should be in its own file and exported from this file, as shown below. Please use the file names mentioned in the requirements to pass the tests.

Use the `addEventListener` function to add event handlers; otherwise, the tests may not pass.

1. **The Function "hideNotifications"**
Write the function `hideNotifications` for finding all notification elements and adding an event listener to hide each one.
In the `src` folder, create the file `hideNotifications.js`, which should export the function `hideNotifications`:
```js
export function hideNotifications() {
    // Your code
}
```
All the `HTML'and `CSS` required for this task have already been created and added to the `index.html` file. You can find it in the element with the class name: `notifications`, which looks like this:
```html
<ul class="notifications">
    <li class="item">
        <h3 class="title">John Doe</h3>
        <p class="text">Hey bro! Long time no see, I'm glad to hear from you!</p>
        <button class="close" type="button">
            CLOSE
        </button>
    </li>
    <li class="item">
        <h3 class="title">Matthew</h3>
        <p class="text">Hi, please look at this pic in the attachment</p>
        <button class="close" type="button">
            CLOSE
        </button>
    </li>
    <li class="item">
        <h3 class="title">Ana</h3>
        <p class="text">A friendly reminder to look out for...</p>
        
        <button class="close" type="button">
            CLOSE
        </button>
    </li>
</ul>
```
As you can see, there are three notifications available. 
Every notification element has the class name `notification`.
Add a `click` event handler to close buttons (elements with the class name `notification-close`) to hide the corresponding notification element when the user clicks the close button.
**Detailed requirements:**
1. You can find the close button element using the `notification-close` class name.
2. If you decide to use the event delegation approach, please add an event listener to the `<ul>` element with the class name `notifications`, not to the whole document.
3. To hide a notification element, it is **mandatory** to add `display: none;` to an element using the `style` property. If you hide it differently, it may not work with the tests for this task.
4. Your solution must be universal and work with any number of notifications.
4. If you decide to use the event delegation approach, please add an event listener to the element with the class name `notifications`, not to the whole document.
**An example of using the function:**
```js
hideNotifications(); // All the event handlers added
```
2. **The Function "checkLinks"**
Write the function `checkLinks` for finding all links to other websites and adding event handlers with confirmation.
In the folder `src`, create the file `checkLinks.js`, which should export the function `checkLinks`:
```js
export function checkLinks() {
    // Your code
}
```
All the `HTML'and `CSS` required for this task have already been created and added to the `index.html` file, which you can find in the element with the class name `check-links`. It looks like this:
```html
<article class="check-links">
    <header>Lorem</header>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores ullam accusamus sit sint. Reiciendis, nam necessitatibus? Officiis pariatur dolorem reprehenderit, est aliquid voluptatum quaerat, distinctio neque veritatis vel natus vero!</p>
    <p>
        <a href="page2.html">Page 2 link</a>
    </p>
    <p>
        <a href="#task-1">Task 1 in the text</a>
    </p>
    <p>
        <a href="#task-2">Task 2 in the text</a>
    </p>
    <p>
        <a href="https://developer.mozilla.org/en-US/">MDN (Link to another website)</a>
    </p>
    <p>
        <a href="https://www.w3schools.com/">w3schools (Link to another website)</a>
    </p>
</article>
```
As you can see, there are three types of links:
1. Links to another page of the website (for instance, `href="page2.html"`)
2. Links with anchors (for instance, `href="#task-1"`)
3. Links to another website (for instance, `href="https://developer.mozilla.org/en-US/"`)
You should add code for asking a user to confirm they want to leave a website when the third type of link is clicked.
**Detailed requirements:**
1. The `checkLinks` function should add an event handler for a click event only to links that lead to other websites like `href="https://developer.mozilla.org/en-US/"`.
2. This event handler should call a global `confirm` function with the message `Do you want to proceed and leave our cool website?`. You can read more about the `confirm` function here: [Confirm function](https://javascript.info/alert-prompt-confirm#confirm).
3. If the user confirms, you do nothing. But if the user declines, you should prevent the default behavior and stop the link from redirecting by calling the `preventDefault` method of the event object inside the handler. To pass the tests, you must prevent the default action by calling the method, not by returning `false`. 
4. Your solution must be universal. In other words, it must work with any link to another website, not just with links from index.html.file.
5. If you decide to use the event delegation approach, please add an event listener to the element with the class name `check-links`, not to the whole document.
**An example of using the function:**
```js
checkLinks(); // All the event handlers added
```
3. **The Function "addSelection"**
Write the function `addSelection` for adding the required event handlers to make items in a list visually selectable by clicking on them.
In the folder `src`, create the file `addSelection.js`, which should export the function `addSelection`:
```js
export function addSelection() {
    // Your code
}
```
All the `HTML'and `CSS` required for this task have already been created and added to the `index.html` file. You can find it in the element with the class name `add-selection`, which looks like this:
```html
<article class="add-selection">
    <header>Choose your favourite bands</header>
    <ul class="list">
        <li class="selectable-item">Arch Ameny</li>
        <li class="selectable-item">Disturbed</li>
        <li class="selectable-item">Korn</li>
        <li class="selectable-item">Bullet for My Valentine</li>
        <li class="selectable-item">Slipknot</li>
        <li class="selectable-item">BTS</li>
    </ul>
</article>
```
- You need to work with all list elements: any `<li>` element with the class name `selectable-item`.
- To mark an element as selected, you need to add the CSS class name `selected`.
**Detailed requirements:**
1. If a user clicks on a list element, this element should be selected, and all other elements should be deselected.
2. If a user clicks on a list element and the `Ctrl` (`Cmd` for Mac) button is pressed on the keyboard, the selection is toggled on the element, but the other elements remain as is. "Toggle" means that if an element was selected before, it should be deselected, and vice versa.
3. If you decide to use the event delegation approach, please add an event listener to the element with the class name `add-selection`, not to the whole document.
**An example of using the function:**
```js
addSelection(); // All the event handlers added
```

