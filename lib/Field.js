"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createField;

var _util = require("./util");

var _validator = require("./validator");

var _severity = require("./severity");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function createField(opts) {
  return new Field(opts || _util.emptyObject);
}

var Field =
/*#__PURE__*/
function () {
  function Field(opts) {
    _classCallCheck(this, Field);

    // value handling
    this.value = opts.value; // dirty state

    this.isEqual = opts.isEqual || _util.isStrictReferenceEqual;
    this.touched = this.hierarchyTouched = 'touched' in opts ? Boolean(opts.touched) : false; // validation

    this.validator = opts.validator || _validator.alwaysValid;
    this.messages = (0, _util.freeze)(this.validator(this.value) || _validator.noValidationErrors);
    this.maxSeverity = (0, _severity.getMaxSeverityOfMessages)(this.messages);
    this.valid = this.maxSeverity !== 'error';
    this.maxSeverityOfHierarchy = this.maxSeverity;
    this.hierarchyValid = this.valid;
    (0, _util.freeze)(this);
  }

  _createClass(Field, [{
    key: "setValue",
    value: function setValue(value) {
      if (this.isEqual(value, this.value)) {
        return this;
      }

      return new Field({
        value: value,
        isEqual: this.isEqual,
        touched: this.touched,
        validator: this.validator
      });
    }
  }, {
    key: "setTouched",
    value: function setTouched(touched) {
      return new Field({
        value: this.value,
        isEqual: this.isEqual,
        touched: touched,
        validator: this.validator
      });
    }
  }, {
    key: "toJS",
    value: function toJS() {
      return this.value;
    }
  }, {
    key: "map",
    value: function map(mapper) {
      return mapper(this);
    }
  }, {
    key: "updateIn",
    value: function updateIn(path, fn) {
      var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      throw new Error("Fields have no children and therefore do not support updateIn at path \"".concat(path.slice(0, i + 1).join('.'), "\""));
    }
  }]);

  return Field;
}();