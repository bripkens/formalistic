"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createListForm;

var _util = require("./util");

var _severity = require("./severity");

var _validator = require("./validator");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function createListForm(opts) {
  return new ListForm(opts || _util.emptyObject);
}

var ListForm =
/*#__PURE__*/
function () {
  function ListForm(opts) {
    _classCallCheck(this, ListForm);

    this.items = (0, _util.freeze)(opts.items || _util.emptyArray);
    this.size = this.items.length;
    this.touched = 'touched' in opts ? Boolean(opts.touched) : false; // validation

    this.validator = opts.validator || _validator.alwaysValid;
    this.messages = (0, _util.freeze)(this.validator(this.items) || _validator.noValidationErrors);
    this.maxSeverity = (0, _severity.getMaxSeverityOfMessages)(this.messages);
    this.valid = this.maxSeverity !== 'error';
    this.maxSeverityOfHierarchy = this.maxSeverity;
    this.hierarchyTouched = this.touched;

    for (var i = 0, len = this.items.length; i < len; i++) {
      var item = this.items[i];
      this.maxSeverityOfHierarchy = (0, _severity.getMaxSeverity)(this.maxSeverityOfHierarchy, item.maxSeverityOfHierarchy);
      this.hierarchyTouched = this.hierarchyTouched || item.hierarchyTouched;
    }

    this.hierarchyValid = this.maxSeverityOfHierarchy !== 'error';
    (0, _util.freeze)(this);
  }

  _createClass(ListForm, [{
    key: "push",
    value: function push(item) {
      return this.set(this.items.length, item);
    }
  }, {
    key: "unshift",
    value: function unshift(item) {
      var items = (0, _util.shallowCopyArray)(this.items);
      items.unshift(item);
      return new ListForm({
        items: items,
        touched: this.touched,
        validator: this.validator
      });
    }
  }, {
    key: "insert",
    value: function insert(index, item) {
      var items = (0, _util.shallowCopyArray)(this.items);
      index = Math.min(items.length, Math.max(0, index));
      items.splice(index, 0, item);
      return new ListForm({
        items: items,
        touched: this.touched,
        validator: this.validator
      });
    }
  }, {
    key: "set",
    value: function set(index, item) {
      var items = (0, _util.shallowCopyArray)(this.items);

      if (items[index] === item) {
        return this;
      }

      items[index] = item;
      return new ListForm({
        items: items,
        touched: this.touched,
        validator: this.validator
      });
    }
  }, {
    key: "get",
    value: function get(index) {
      return this.items[index];
    }
  }, {
    key: "remove",
    value: function remove(index) {
      var items = (0, _util.shallowCopyArray)(this.items);
      items.splice(index, 1);
      return new ListForm({
        items: items,
        touched: this.touched,
        validator: this.validator
      });
    }
  }, {
    key: "updateIn",
    value: function updateIn(path, fn) {
      var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var key = path[i];
      var item = this.get(key);

      if (!item) {
        throw new Error("No item to update at path \"".concat(path.slice(0, i + 1).join('.'), "\""));
      }

      if (path.length - 1 === i) {
        return this.set(key, fn(item));
      }

      return this.set(key, item.updateIn(path, fn, i + 1));
    }
  }, {
    key: "moveUp",
    value: function moveUp(i) {
      return this._move(i, i + 1);
    }
  }, {
    key: "moveDown",
    value: function moveDown(i) {
      return this._move(i, i - 1);
    }
  }, {
    key: "_move",
    value: function _move(oldPosition, newPosition) {
      if (oldPosition < 0 || oldPosition >= this.items.length) {
        throw new Error('Index out of bounds: ' + oldPosition);
      }

      newPosition = Math.min(Math.max(0, newPosition), this.items.length - 1);

      if (oldPosition === newPosition) {
        return this;
      }

      var items = (0, _util.shallowCopyArray)(this.items);
      items[newPosition] = this.items[oldPosition];
      items[oldPosition] = this.items[newPosition];
      return new ListForm({
        items: items,
        touched: this.touched,
        validator: this.validator
      });
    }
  }, {
    key: "setTouched",
    value: function setTouched(touched, opts) {
      if (!opts || !opts.recurse) {
        return new ListForm({
          items: this.items,
          touched: touched,
          validator: this.validator
        });
      }

      var items = [];

      for (var i = 0, len = this.items.length; i < len; i++) {
        items[i] = this.items[i].setTouched(touched, opts);
      }

      return new ListForm({
        items: items,
        touched: touched,
        validator: this.validator
      });
    }
  }, {
    key: "map",
    value: function map(mapper) {
      var result = [];

      for (var i = 0, len = this.items.length; i < len; i++) {
        result[i] = mapper(this.items[i], i);
      }

      return result;
    }
  }, {
    key: "toJS",
    value: function toJS() {
      return this.map(toJSMapper);
    }
  }]);

  return ListForm;
}();

function toJSMapper(item) {
  return item.toJS();
}