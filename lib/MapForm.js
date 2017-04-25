'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createMapForm;

var _severity = require('./severity');

var _util = require('./util');

var _validator = require('./validator');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createMapForm(opts) {
  return new MapForm(opts || _util.emptyObject);
}

var MapForm = function () {
  function MapForm(opts) {
    _classCallCheck(this, MapForm);

    this.items = (0, _util.freeze)(opts.items || _util.emptyObject);
    this.touched = 'touched' in opts ? Boolean(opts.touched) : false;

    // validation
    this.validator = opts.validator || _validator.alwaysValid;
    this.messages = (0, _util.freeze)(this.validator(this.items) || _validator.noValidationErrors);
    this.maxSeverity = (0, _severity.getMaxSeverityOfMessages)(this.messages);
    this.valid = this.maxSeverity !== 'error';

    this.maxSeverityOfHierarchy = this.maxSeverity;
    this.hierarchyTouched = this.touched;
    for (var key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        var item = this.items[key];
        this.maxSeverityOfHierarchy = (0, _severity.getMaxSeverity)(this.maxSeverityOfHierarchy, item.maxSeverityOfHierarchy);
        this.hierarchyTouched = this.hierarchyTouched || item.hierarchyTouched;
      }
    }
    this.hierarchyValid = this.maxSeverityOfHierarchy !== 'error';

    (0, _util.freeze)(this);
  }

  _createClass(MapForm, [{
    key: 'put',
    value: function put(key, item) {
      if (this.items[key] === item) {
        return this;
      }
      var items = (0, _util.shallowCopyObject)(this.items);
      items[key] = item;
      return new MapForm({
        items: items,
        touched: this.touched,
        validator: this.validator
      });
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.items[key];
    }
  }, {
    key: 'remove',
    value: function remove(key) {
      if (key in this.items) {
        var items = (0, _util.shallowCopyObject)(this.items);
        delete items[key];
        return new MapForm({
          items: items,
          touched: this.touched,
          validator: this.validator
        });
      }
      return this;
    }
  }, {
    key: 'updateIn',
    value: function updateIn(path, fn) {
      var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var key = path[i];
      var item = this.get(key);

      if (!item) {
        throw new Error('No item to update at path "' + path.slice(0, i + 1).join('.') + '"');
      }

      if (path.length - 1 === i) {
        return this.put(key, fn(item));
      }

      return this.put(key, item.updateIn(path, fn, i + 1));
    }
  }, {
    key: 'containsKey',
    value: function containsKey(key) {
      return this.items.hasOwnProperty(key);
    }
  }, {
    key: 'setTouched',
    value: function setTouched(touched, opts) {
      if (!opts || !opts.recurse) {
        return new MapForm({
          items: this.items,
          touched: touched,
          validator: this.validator
        });
      }

      var items = {};
      for (var key in this.items) {
        if (this.items.hasOwnProperty(key)) {
          items[key] = this.items[key].setTouched(touched, opts);
        }
      }

      return new MapForm({
        items: items,
        touched: touched,
        validator: this.validator
      });
    }
  }, {
    key: 'reduce',
    value: function reduce(reducer, seed) {
      var acc = seed;
      for (var key in this.items) {
        if (this.items.hasOwnProperty(key)) {
          acc = reducer(acc, this.items[key], key);
        }
      }
      return acc;
    }
  }, {
    key: 'toJS',
    value: function toJS() {
      var result = {};

      for (var key in this.items) {
        if (this.items.hasOwnProperty(key)) {
          result[key] = this.items[key].toJS();
        }
      }

      return result;
    }
  }]);

  return MapForm;
}();