# formalistic &nbsp; [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Downloads][downloads-image]][npm-url]

Model your form as an immutable data tree with validators and an explicit dirty/pristine state.

**[Installation](#installation) |**
**[Usage](#usage) |**
**[Changelog](CHANGELOG.md) |**
**[Example Projects](examples)**

---

Handling form state can be a pain. For this very reason, very many form libraries exist. Often times, these libraries are specific to one framework or the other, e.g. redux forms or Angular's form controllers. Other times, they constrain design choices by enforcing certain state management systems or custom components. This doesn't need to be the case.

With formalistic, you can model the conceptual idea of the form. Now, this sounds way more fancy than it actually is. Try to think about it this way: Look at the fields, how they are validated and how they structured and related. Remove the overhead of frameworks and components and model this with plain JavaScript. Turns out, when doing it this way, they are often pretty simple to reason about!

## Installation

```
npm install --save formalistic
```

## Usage
Formalistic is about modeling forms using plain JavaScript. The following example shows how this can be done for a simple login form.

```javascript
import {createField, createMapForm, notBlankValidator} from 'formalized';

const emailField = createField({
  value: '',
  validator(value) {
    if (isEmail(value)) {
      return null;
    }

    return [{
      severity: 'error',
      message: 'Please provide a valid email address.'
    }];
  }
});

const passwordField = createField({
  value: '',
  validator: notBlankValidator
});

const form = createMapForm()
    .put('email', emailField)
    .put('password', passwordField)
```

Forms are immutable and all interaction with forms, e.g. setting values on fields, will recreate the form. For instance, to update the value of the email field:

```javascript
const updatedForm = form.updateIn(['email'], field =>
  field.setValue('tom.mason@example.com')
);
```

More details are available in the [example apps](examples).

## Why yet another library?
There is an unfortunately large amount of form libraries. I wasn't satisfied with the options available and I found that many of those made too many assumptions or imposed unnecessarily large restrictions. Here are a few bullet points which have driven the design of formalistic.

 - Do not dictate a framework, library or state management system.
 - Be interoperable and allow extensions for easier use with certain libraries.
 - Support different UX patterns, e.g. mark fields as dirty on change or mark fields as dirty on focus.
 - Support cross field validation.
 - Support efficient change detection for view and/or model diffing systems.

[npm-url]: https://npmjs.org/package/formalistic
[npm-image]: http://img.shields.io/npm/v/formalistic.svg

[downloads-image]: http://img.shields.io/npm/dm/formalistic.svg

[travis-url]: https://travis-ci.org/bripkens/formalistic
[travis-image]: http://img.shields.io/travis/bripkens/formalistic.svg

[coveralls-url]: https://coveralls.io/r/bripkens/formalistic
[coveralls-image]: http://img.shields.io/coveralls/bripkens/formalistic/master.svg
