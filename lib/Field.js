'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createField;

var _validator = require('./validator');

var _severity = require('./severity');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createField(opts) {
  return new Field(opts);
}

var Field = function () {
  function Field(opts) {
    _classCallCheck(this, Field);

    this._value = opts.value;
    this._validator = opts.validator || _validator.alwaysValid;
    this._messages = this._validator(this._value) || _validator.noValidationErrors;
    this._maxSeverity = (0, _severity.getMaxSeverity)(this._messages);
    this._valid = this._maxSeverity !== 'error';
    this._dirty = !!opts.dirty;
  }

  _createClass(Field, [{
    key: 'setValue',
    value: function setValue(value) {
      return new Field({
        value: value,
        validator: this._validator,
        dirty: true
      });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this._value;
    }
  }, {
    key: 'isDirty',
    value: function isDirty() {
      return this._dirty;
    }
  }, {
    key: 'isPristine',
    value: function isPristine() {
      return !this.isDirty();
    }
  }, {
    key: 'markPristine',
    value: function markPristine() {
      return new Field({
        value: this._value,
        validator: this._validator,
        dirty: false
      });
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      return this._valid;
    }
  }, {
    key: 'toJS',
    value: function toJS() {
      return this._value;
    }
  }, {
    key: 'map',
    value: function map(mapper) {
      return mapper(this);
    }
  }]);

  return Field;
}();