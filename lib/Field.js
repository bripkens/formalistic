'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createField;

var _util = require('./util');

var _validator = require('./validator');

var _severity = require('./severity');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createField(opts) {
  return new Field(opts || _util.emptyObject);
}

var Field = function () {
  function Field(opts) {
    _classCallCheck(this, Field);

    // value handling
    this.value = opts.value;
    if ('pristineValue' in opts) {
      this.pristineValue = opts.pristineValue;
    } else {
      this.pristineValue = this.value;
    }

    // dirty state
    this.isEqual = opts.isEqual || _util.isStrictReferenceEqual;
    this.changed = !this.isEqual(this.value, this.pristineValue);
    this.touched = 'touched' in opts ? Boolean(opts.touched) : false;

    // validation
    this.validator = opts.validator || _validator.alwaysValid;
    this.messages = (0, _util.freeze)(this.validator(this.value) || _validator.noValidationErrors);
    this.maxSeverity = (0, _severity.getMaxSeverity)(this.messages);
    this.valid = this.maxSeverity !== 'error';

    (0, _util.freeze)(this);
  }

  _createClass(Field, [{
    key: 'setValue',
    value: function setValue(value) {
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
  }, {
    key: 'setTouched',
    value: function setTouched(touched) {
      return new Field({
        value: this.value,
        pristineValue: this.pristineValue,
        isEqual: this.isEqual,
        touched: touched,
        validator: this.validator
      });
    }
  }, {
    key: 'toJS',
    value: function toJS() {
      return this.value;
    }
  }, {
    key: 'map',
    value: function map(mapper) {
      return mapper(this);
    }
  }]);

  return Field;
}();