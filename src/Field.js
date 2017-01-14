import {alwaysValid, noValidationErrors} from './validator';
import {getMaxSeverity} from './severity';

export default function createField(opts) {
  return new Field(opts);
}

class Field {
  constructor(opts) {
    this._value = opts.value;
    this._validator = opts.validator || alwaysValid;
    this._messages = this._validator(this._value) || noValidationErrors;
    this._maxSeverity = getMaxSeverity(this._messages);
    this._valid = this._maxSeverity !== 'error';
    this._dirty = !!opts.dirty;
  }

  setValue(value) {
    return new Field({
      value: value,
      validator: this._validator,
      dirty: true
    });
  }

  getValue() {
    return this._value;
  }

  isDirty() {
    return this._dirty;
  }

  isPristine() {
    return !this.isDirty();
  }

  markPristine() {
    return new Field({
      value: this._value,
      validator: this._validator,
      dirty: false
    });
  }

  isValid() {
    return this._valid;
  }

  toJS() {
    return this._value;
  }

  map(mapper) {
    return mapper(this);
  }
}
