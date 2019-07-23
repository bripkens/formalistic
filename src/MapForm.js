import {getMaxSeverityOfMessages, getMaxSeverity} from './severity';
import {freeze, emptyObject, shallowCopyObject} from './util';
import {alwaysValid, noValidationErrors} from './validator';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function createMapForm(opts) {
  return new MapForm(opts || emptyObject);
}

class MapForm {
  constructor(opts) {
    this.items = freeze(opts.items || emptyObject);
    this.touched = 'touched' in opts ? Boolean(opts.touched) : false;

    // validation
    this.validator = opts.validator || alwaysValid;
    this.messages = freeze(this.validator(this.items) || noValidationErrors);
    this.maxSeverity = getMaxSeverityOfMessages(this.messages);
    this.valid = this.maxSeverity !== 'error';

    this.maxSeverityOfHierarchy = this.maxSeverity;
    this.hierarchyTouched = this.touched;
    for (let key in this.items) {
      if (hasOwnProperty.call(this.items, key)) {
        const item = this.items[key];
        this.maxSeverityOfHierarchy = getMaxSeverity(this.maxSeverityOfHierarchy, item.maxSeverityOfHierarchy);
        this.hierarchyTouched = this.hierarchyTouched || item.hierarchyTouched;
      }
    }
    this.hierarchyValid = this.maxSeverityOfHierarchy !== 'error';

    freeze(this);
  }

  put(key, item) {
    if (this.items[key] === item) {
      return this;
    }
    const items = shallowCopyObject(this.items);
    items[key] = item;
    return new MapForm({
      items,
      touched: this.touched,
      validator: this.validator
    });
  }

  get(key) {
    return this.items[key];
  }

  remove(key) {
    if (key in this.items) {
      const items = shallowCopyObject(this.items);
      delete items[key];
      return new MapForm({
        items,
        touched: this.touched,
        validator: this.validator
      });
    }
    return this;
  }

  updateIn(path, fn, i=0) {
    const key = path[i];
    const item = this.get(key);

    if (!item) {
      throw new Error(`No item to update at path "${path.slice(0, i + 1).join('.')}"`);
    }

    if (path.length - 1 === i) {
      return this.put(key, fn(item));
    }

    return this.put(key, item.updateIn(path, fn, i + 1));
  }

  containsKey(key) {
    return hasOwnProperty.call(this.items, key);
  }

  setTouched(touched, opts) {
    if (!opts || !opts.recurse) {
      return new MapForm({
        items: this.items,
        touched,
        validator: this.validator
      });
    }

    const items = {};
    for (let key in this.items) {
      if (hasOwnProperty.call(this.items, key)) {
        items[key] = this.items[key].setTouched(touched, opts);
      }
    }

    return new MapForm({
      items,
      touched,
      validator: this.validator
    });
  }

  reduce(reducer, seed) {
    let acc = seed;
    for (let key in this.items) {
      if (hasOwnProperty.call(this.items, key)) {
        acc = reducer(acc, this.items[key], key);
      }
    }
    return acc;
  }

  toJS() {
    const result = {};

    for (let key in this.items) {
      if (hasOwnProperty.call(this.items, key)) {
        result[key] = this.items[key].toJS();
      }
    }

    return result;
  }
}
