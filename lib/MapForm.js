'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createMapForm;

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createMapForm(opts) {
  return new MapForm(opts || _util.emptyObject);
}

var MapForm = function () {
  function MapForm(opts) {
    _classCallCheck(this, MapForm);

    this.items = (0, _util.freeze)(opts.items || _util.emptyObject);
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
        items: items
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
          items: items
        });
      }
      return this;
    }
  }]);

  return MapForm;
}();