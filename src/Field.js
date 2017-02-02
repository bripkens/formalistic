import {freeze, isStrictReferenceEqual, emptyObject} from './util';
import {alwaysValid, noValidationErrors} from './validator';
import {getMaxSeverityOfMessages} from './severity';

export default function createField(opts) {
  return new Field(opts || emptyObject);
}

class Field {
  constructor(opts) {
    // value handling
    this.value = opts.value;

    // dirty state
    this.isEqual = opts.isEqual || isStrictReferenceEqual;
    this.touched = this.hierarchyTouched = 'touched' in opts ? Boolean(opts.touched) : false;

    // validation
    this.validator = opts.validator || alwaysValid;
    this.messages = freeze(this.validator(this.value) || noValidationErrors);
    this.maxSeverity = getMaxSeverityOfMessages(this.messages);
    this.valid = this.maxSeverity !== 'error';
    this.maxSeverityOfHierarchy = this.maxSeverity;
    this.hierarchyValid = this.valid;

    freeze(this);
  }

  setValue(value) {
    if (this.isEqual(value, this.value)) {
      return this;
    }

    return new Field({
      value: value,
      pristineValue: this.pristineValue,
      isEqual: this.isEqual,
      touched: this.touched,
      validator: this.validator
    });
  }

  setTouched(touched) {
    return new Field({
      value: this.value,
      pristineValue: this.pristineValue,
      isEqual: this.isEqual,
      touched: touched,
      validator: this.validator
    });
  }

  toJS() {
    return this.value;
  }

  map(mapper) {
    return mapper(this);
  }

  updateIn(path, fn, i=0) {
    throw new Error(`Fields have no children and therefore do not support updateIn at path "${path.slice(0, i + 1).join('.')}"`);
  }
}
