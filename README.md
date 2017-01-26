# formalistic &nbsp; [![Build Status](https://travis-ci.org/bripkens/formalistic.svg?branch=master)](https://travis-ci.org/bripkens/formalistic) [![Coverage Status](https://img.shields.io/coveralls/bripkens/formalistic.svg)](https://coveralls.io/r/bripkens/formalistic?branch=master) [![npm version](https://badge.fury.io/js/formalistic.svg)](https://badge.fury.io/js/formalistic)

Model your form as an immutable data tree with validators and an explicit dirty/pristine state.

**[Installation](#installation) |**
**[Usage](#usage) |**
**[Changelog](CHANGELOG.md)**

---

Handling form state can be a pain. For this very reason, very many form libraries exist. Often times, these libraries are specific to one framework or the other, e.g. redux forms or Angular's form controllers. Other times, they constrain design choices by enforcing certain state management systems or custom components. This doesn't need to be the case.

With formalistic, you can model the conceptual idea of the form. Now, this sounds way more fancy than it actually is. Try to think about it this way: Look at the fields, how they are validated and how they structured and related. Remove the overhead of frameworks and components and model this with plain JavaScript. Turns out, when doing it this way, they are often pretty simple to reason about!

## Installation

```
npm install --save formalistic
```

## Usage
TODO, check out `test/MapForm.test.js` for now.


## Why yet another library?
There is an unfortunately large amount of form libraries. I wasn't satisfied with the options available and I found that many of those made too many assumptions or imposed unnecessarily large restrictions. Here are a few bullet points which have driven the design of formalistic.

 - Do not dictate a framework, library or state management system.
 - Be interoperable and allow extensions for easier use with certain libraries.
 - Support different UX patterns, e.g. mark fields as dirty on change or mark fields as dirty on focus.
 - Support cross field validation.
 - Support efficient change detection for view and/or model diffing systems.
