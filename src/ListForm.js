import {freeze, emptyArray, emptyObject, shallowCopyArray} from './util';
import {getMaxSeverityOfMessages, getMaxSeverity} from './severity';
import {alwaysValid, noValidationErrors} from './validator';

export default function createListForm(opts) {
  return new ListForm(opts || emptyObject);
}

class ListForm {
  constructor(opts) {
    this.items = freeze(opts.items || emptyArray);
    this.size = this.items.length;
    this.touched = 'touched' in opts ? Boolean(opts.touched) : false;

    // validation
    this.validator = opts.validator || alwaysValid;
    this.messages = freeze(this.validator(this.items) || noValidationErrors);
    this.maxSeverity = getMaxSeverityOfMessages(this.messages);
    this.valid = this.maxSeverity !== 'error';

    this.maxSeverityOfHierarchy = this.maxSeverity;
    this.hierarchyTouched = this.touched;
    for (let i = 0, len = this.items.length; i < len; i++) {
      const item = this.items[i];
      this.maxSeverityOfHierarchy = getMaxSeverity(this.maxSeverityOfHierarchy, item.maxSeverityOfHierarchy);
      this.hierarchyTouched = this.hierarchyTouched || item.hierarchyTouched;
    }
    this.hierarchyValid = this.maxSeverityOfHierarchy !== 'error';

    freeze(this);
  }

  push(item) {
    return this.set(this.items.length, item);
  }

  unshift(item) {
    const items = shallowCopyArray(this.items);
    items.unshift(item);

    return new ListForm({
      items,
      touched: this.touched,
      validator: this.validator
    });
  }

  insert(index, item) {
    const items = shallowCopyArray(this.items);
    index = Math.min(items.length, Math.max(0, index));
    items.splice(index, 0, item);

    return new ListForm({
      items,
      touched: this.touched,
      validator: this.validator
    });
  }

  set(index, item) {
    const items = shallowCopyArray(this.items);
    if (items[index] === item) {
      return this;
    }

    items[index] = item;
    return new ListForm({
      items,
      touched: this.touched,
      validator: this.validator
    });
  }

  get(index) {
    return this.items[index];
  }

  remove(index) {
    const items = shallowCopyArray(this.items);
    items.splice(index, 1);
    return new ListForm({
      items,
      touched: this.touched,
      validator: this.validator
    });
  }

  updateIn(path, fn, i=0) {
    if (path.length === 0) {
      return fn(this);
    }

    const key = path[i];
    const item = this.get(key);

    if (!item) {
      throw new Error(`No item to update at path "${path.slice(0, i + 1).join('.')}"`);
    }

    if (path.length - 1 === i) {
      return this.set(key, fn(item));
    }

    return this.set(key, item.updateIn(path, fn, i + 1));
  }

  moveUp(i) {
    return this._move(i, i + 1);
  }

  moveDown(i) {
    return this._move(i, i - 1);
  }

  _move(oldPosition, newPosition) {
    if (oldPosition < 0 || oldPosition >= this.items.length) {
      throw new Error('Index out of bounds: ' + oldPosition);
    }

    newPosition = Math.min(Math.max(0, newPosition), this.items.length - 1);
    if (oldPosition === newPosition) {
      return this;
    }

    const items = shallowCopyArray(this.items);
    items[newPosition] = this.items[oldPosition];
    items[oldPosition] = this.items[newPosition];
    return new ListForm({
      items,
      touched: this.touched,
      validator: this.validator
    });
  }

  setTouched(touched, opts) {
    if (!opts || !opts.recurse) {
      return new ListForm({
        items: this.items,
        touched,
        validator: this.validator
      });
    }

    const items = [];
    for (let i = 0, len = this.items.length; i < len; i++) {
      items[i] = this.items[i].setTouched(touched, opts);
    }

    return new ListForm({
      items,
      touched,
      validator: this.validator
    });
  }

  map(mapper) {
    const result = [];

    for (let i = 0, len = this.items.length; i < len; i++) {
      result[i] = mapper(this.items[i], i);
    }

    return result;
  }

  toJS() {
    return this.map(toJSMapper);
  }
}

function toJSMapper(item) {
  return item.toJS();
}
