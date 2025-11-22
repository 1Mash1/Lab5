# Introduction to DOM

## Writing Functions for Working With the DOM

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

Write functions for working with DOM. Requirements are below.

Please note that you should edit the `src/script.j`s` file. We can't verify your solution if you use a different file.

To create a function, you must use `Function Declaration`, or we will not be able to verify it. Here is how to use `Function Declaration`: [javascript.info: Function Declaration](https://javascript.info/function-basics#function-declaration).

**Please, note:**
- If a task requirement says "Function should return," it should deliberately return the expected value. If you show a value in the console instead of returning it, it will not pass the check. More about function returning a value: [Returning a value](https://javascript.info/function-basics#returning-a-value).
- Each task has its own container with elements that should be used during the task. 
Example: For `task`1, you should search for a container with `id="task1"`, and only its children should be affected during `task1`. 
For `task2`, you should use container `id="task2"`, and so on.
- To get the corresponding container and its children for each task, check out the article: [Search for Elements ](https://javascript.info/searching-elements-dom).

### Requirements for the functions

1. **Function "getClassArray"**

Write the function `getClassArray` to return an array that contains each element's class attribute.

```js
function getClassArray() {
    // your code...
}
```

    1. This function should return an array with classes that the wrapper with id `task1` contains (`id="task1"`).
    2. If an element's class name is `paragraph_hidden`, its class names should not be included in the returned array.

**An example of using the function:**
```js
// HTML: 
//     <div class="container" id="task1">         // wrapper with id task1
//         <p class="paragraph paragraph_hidden"> // ignored because contains class 'paragraph_hidden'
//             Text should be visible
//         </p>
//         <div class="wrapper">                  // should be added to array
//             <p class="paragraph">              // should be added to array
//                 Text should be visible
//             </p>
//         </div>
//     </div>
let classArray = getClassArray();
classArray;
// ["wrapper", "paragraph"]

// HTML: 
//     <div id="task1">                           // wrapper with id task1
//         <div class="wrapper container">        // should be added to array
//         </div>
//         <p class="paragraph">                  // should be added to array
//             Text
//         </p>
//         <p class="paragraph paragraph_hidden"> // ignored because contains class 'paragraph_hidden'
//             Text
//         </p>
//     </div>
let classArray = getClassArray();
classArray;
// ["wrapper container", "paragraph"]

```

2. **Function "addContentToContainer"**

Write the function `addContentToContaine` to add content to the container with id `task2` (`id="task2"`).

```js
function addContentToContainer(data) {
    // your code...
}
```
    1. This function should add content to the container with id `task2` (`id="task2"`).
    2. The `data` should be a string.


**An example of using the function:**
```js
// initial HTML:
// <div class="container" id="task2"></div>

let data = 'mock text';
addContentToContainer(data);
// HTML:
// <div class="container" id="task2">mock text</div>

let dataWithTag = '<p>text</p>';
addContentToContainer(data);
// HTML:
// <div class="container" id="task2"><p>text</p></div>
```

3. **Function "removeHiddenParagraphs"**
    
Write the function `removeHiddenParagraphs` to remove HTML tags that contain the class `'hidden'` in the class name. The function should return the number of items removed.

```js
function removeHiddenParagraphs() {
    // your code...
}
```
    1. The function should return the number of items that were removed from the HTML.
    2. The function should remove all elements that contain the class `"hidden"` in the container with `id="task3"`.

**An example of using the function:**

```js

// Initial HTML:
//     <div class="container" id="task3">          // wrapper with id task3     
//         <p class="paragraph paragraph_hidden">  // should remove this tag from HTML
//             Text should be hidden
//         </p>
//         <p class="paragraph">                   // this item should remain
//             Text should be visible
//         </p>
//         <p class="paragraph paragraph_hidden">  // should remove this tag from HTML
//             Text should be hidden as well
//         </p>
//     </div>
const numberOfRemovedItems = removeHiddenParagraphs(data);
numberOfRemovedItems; // 2
// HTML after function execution:
//     <div class="container" id="task3">          // wrapper with id task3
//         <p class="paragraph">                   // this item should remain
//             Text should be visible
//         </p>
//     </div>


//======================================================================


// Initial HTML:
//     <div class="container" id="task3">          // wrapper with id task3     
//         <span class="hidden">                   // should remove this tag from HTML
//             Text should be hidden
//         </span>
//         <p class="paragraph">                   // this item should remain
//             Text should be visible
//         </p>
//     </div>

const numberOfRemovedItems = removeHiddenParagraphs(data);
numberOfRemovedItems; // 2

// HTML after function execution:
//     <div class="container" id="task3">          // wrapper with id task3
//         <p class="paragraph">                   // this item should remain
//             Text should be visible
//         </p>
//     </div>

```

4. **Function "setDataAttr"**

Write the function `setDataAttr` to set a new attribute to an HTML element based on the content of the element.

```js
function setDataAttr(data) {
    // your code...
}
```
    1. The function should set the attribute `data-type="container"` when the current element has a nested or child element.
    2. The function should set the attribute `data-type="text"` when the current element has NO nested or child element.

**An example of using the function:**

```js
// HTML after function execution:
//     <div class="container" id="task4">
//         <h3>                                             // should add data-type="text"                             
//             This HTML element should have data-type text
//         </h3>
//         <section>                                        // should add data-type="container"
//             This HTML element should have data-type container      
//             <p class="paragraph">                        // should add data-type="text"  
//                 This article should have data-type text
//             </p>
//         </section>
//     </div>

setDataAttr();

// Initial HTML:
//     <div class="container" id="task4">
//         <h3 data-type="text">                             // attribute data-type="text" added                             
//             This HTML element should have data-type text
//         </h3>
//         <section data-type="container">                   // attribute data-type="container" added  
//             This HTML element should have data-type container      
//             <p class="paragraph" data-type="text">        // attribute data-type="text" added    
//                 This article should have data-type text
//             </p>
//         </section>
//     </div>
```
