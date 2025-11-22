# Browser Events in Practice

## Using Browser Events in Complicated Scenarios

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

1. **The Function "createTip"**
Write the function `createTip` for creating an `HTML` element that presents a card with a user tip. Also, this function should add all the required event handlers.
In the `src` folder, create the file `createTip.js`. This file should export the function `createTip`:
```js
export function createTip(tipText) {
    // Your code
}
```
It takes one parameter:
- `tipText`: a string with the text of a tip

### HTML markup creation requirements

1. This function should create a `<section>` element with the class `tip`. This element will be called `a root element`.

The `HTML` markup should be (including root `<section>` element):
```html
<section class="tip">
    <h3 class="tip__title">💡 Tip of the day:</h3>
    <p class="tip__text">{{TEXT}}</p>
    <p class="tip__check hidden">✅Got it!</p>
</section>
```
2. The function must return the created `<section>` element object. Please note it must be the `<section>` element object, not the string with the `HTML` tags. `document.createElement` returns such an object.
3. The string value from the `tipText` parameter should be inside the element with the class name `tip__text`, as seen in the `HTML` above.
4. Please note that an element with the class `tip__check` should also have `hidden` class.

### Requirements for event handlers
You should add an event handler for the `keyup` event on the root `<section>` element.
Please note that you only have to handle the `keyup` event if the `<section class="tip">` element is in focus when an event happens. To focus on an element, press the `Tab` key several times until the focus is on it, or just click on it. 

In this task, when an element is in focus, it has **blue outline**.

1. Inside the tip element, there is an element with the class name `tip__check`. Its purpose is to mark the tip as read by the user. So, logic needs to be provided for showing and hiding it.

If the `Enter` key is pressed, you should toggle the `hidden` class name on the element with the class `tip__check`. Toggle means that if an element has the class name `hidden`, it should be removed, and vice versa. If there is a `hidden` class, the tip is considered not marked as read and is hidden.

2. Now, you need to develop logic for removing a tip from the screen. 
If the `Escape` key is pressed by the user, they should be asked for confirmation. The tip element should be removed if this is confirmed. 

To confirm removal, the global `confirm` function will be used. This event handler should call a `confirm` function with the message `Are you sure you want to remove this tip?`. You can read more about the `confirm` function here: [Confirm function](https://javascript.info/alert-prompt-confirm#confirm).

If the user declines, nothing should be done. If the user confirms, the root `<section class="tip">` element should be removed by calling its `remove` method.

3. Please note that the function `createTip` should not add a DOM element to the page. This is important and will be checked by tests.

**An example of using the function:**
```js
const tipText = 'Carry a water bottle with you and refill it throughout the day.'

const tipElement = createTip(tipText);
document.body.append(tipElement); // The tip element is put on the page by external code.
```

**After creating a tip element, its HTML markup, including the root element, looks like this:**

```html
<section class="tip">
    <h3 class="tip__title">💡 Tip of the day:</h3>
    <p class="tip__text">Carry a water bottle with you and refill it throughout the day.</p>
    <p class="tip__check hidden">✅Got it!</p>
</section>
```

2. **The Function "validateEmailForm"**

Write the function `validateEmailForm` for adding validation to an email form.

In the `src` folder, create the file `validateEmailForm.js`. This file should export the function `validateEmailForm`:

```js
export function validateEmailForm() {
    // Your code
}
```

All the `HTML` and `CSS` required for this task have already been created and added to the file `index.html`. You can find it in the element with the class name `email-form`, which looks like this:

```html
<form action="POST" class="email-form">
    <legend class="email-form__legend">Please email us your thoughts.</legend>

    <div class="email-form__row" id="to-field-wrapper">
        <label for="to-field" class="email-form__label">To</label>
        <input type="text" name="to" id="to-field" class="email-form__input">
        <div class="email-form__valid-mark hidden" aria-lable="To field is valid">✅</div>
    </div>

    <div class="email-form__row" id="topic-field-wrapper">
        <label for="topic-field" class="email-form__label">Topic</label>
        <input type="text" name="topic" id="topic-field" class="email-form__input">
    </div>

    <div class="email-form__row">
        <label for="text-field" class="email-form__label">Text</label>
        <textarea class="email-form__text" name="text" id="text-field" cols="30" rows="10"></textarea>
    </div>

    <div class="email-form__row">
        <input class="email-form__accept-terms" type="checkbox" name="accept-terms" id="accept-terms">
        <label for="accept-terms" class="email-for__label">Accept Terms</label>
    </div>

    <button disabled class="email-form__button" type="submit">Send</button>
</form>
```
As you can see, it is a form for writing an email with four fields and a button for sending it.

### Validation of `<input>` inside an element with the id attribute `to-field-wrapper`

This field is for the recipient's email address, so it should contain the `@` symbol. 

Now, please add validation for the input data. A string is considered valid if it meets the following requirements:
1. The `@` symbol is in the typed string and is **not the first** and **not the last** character. Please note that spaces should be rejected at the beginning and the end of the string. So, the string `"   @    "` is not valid.
2. A string has at least four characters, including the `@` symbol.
3. A string does not have spaces between characters.

```js
'test@gmail.com'; // valid
'@gmail.com'; // invalid: @ symbol is the first character
'test@'; // invalid: @ symbol is the last character 
't@g'; // invalid: string is too short
'    t@g    '; // invalid: string it too short
'test @gmail.com'; // invalid: spaces between characters
```

Every change made by a user should be validated, and `input` event should be used on the `<input>` element.

- If this field is valid, you should see an element with the class `email-form__valid-mark` located just after the input. By default, it contains the `hidden` class. To show it, this class must be removed.
- If this field is not valid, the element with the class name `email-form__valid-mark` should be hidden.

### Validating `<input>` inside an element with the id `topic-field-wrapper`

This field is for the subject line of an email. This field will be marked accordingly if it is not valid.

**The Validation Process:**

T run validation, the events `focus` and `blur` will be used.

1. If the user focuses on a field, leaves it empty, and focuses on another field or focuses out, they should be notified that they are expected to fill it. In this case, the `email-form__input_warning` class is added to an `<input>` element.
2. If the user focuses on the field again, the `email-form__input_warning` class name should be removed. This behavior is required. `<input>` should not have `email-form__input_warning` while it is in focus.
3. If the user focuses on another field and the topic field is not empty, no additional classes need to be added.

Please note that if the topic field has only spaces inside, it is considered empty and is not valid.

### Disable/enable the Submit button

At the bottom of the form, there is a submit button with the class name `email-form__button`. By default, it is disabled. It is enabled/disabled by checking the `"Accept Terms"` box, which has the class name `email-form__accept-terms`. If the user accepts the terms, form submission is enabled.

1. If the user checks the box, the button should be enabled. 
2. If the user unchecks the box, the button should be disabled.

### Submit the email form

For now, the form will not be sent upon submission. 
If the user submits the form, you should:

1. Prevent the default action by calling the `preventDefault` method of the event object inside the handler. You must prevent the default action by calling the method to pass the tests, not by returning `false`. 
2. Dispatch a custom event on the `<form class="email-form">` element.
    - Event name `email-form-submit`
    - The event should bubble

Please note that users can submit the form not only by clicking the button but also by pressing Enter on the keyboard. So, please use the `submit` event. For more about this event: [Event: submit](https://javascript.info/forms-submit#event-submit).

**An example of using the function:**

```js
validateEmailForm(); // All the event handlers added

document.body.addEventListener('email-form-submit', () => {
    console.log('email-form-submit event');
}); // External event listener for a custom event
```

3. **The Function "pageLoad"**

Write the function `pageLoad` for adding a load status message to the page and a confirmation when the user leaves the website.

In the `src` folder, create the file `pageLoad.js`. This file should export the function `pageLoad`:

```js
export function pageLoad() {
    // Your code
}
```

### Requirements

1. Add an event listener for a page `load` event.
2. When this event happens, add `<div class="page-load-mark">✅ Page loaded successfully</div>` as the first child of `<body>` element.
3. Using the `beforeunload` event, force the browser to ask for confirmation when the user leaves the website.

**An example of using the function:**

```js
pageLoad(); // All the event handlers added
```
