'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notBlankError = exports.noValidationErrors = undefined;
exports.alwaysValid = alwaysValid;
exports.notBlank = notBlank;
exports.compose = compose;

var _util = require('./util');

var noValidationErrors = exports.noValidationErrors = _util.emptyArray;

function alwaysValid() {
  return noValidationErrors;
}

var notBlankError = exports.notBlankError = (0, _util.freeze)([(0, _util.freeze)({
  severity: 'error',
  message: 'The value must not be blank.'
})]);
function notBlank(s) {
  if (!s || s.trim().length === 0) {
    return notBlankError;
  }

  return noValidationErrors;
}

function compose() {
  for (var _len = arguments.length, validators = Array(_len), _key = 0; _key < _len; _key++) {
    validators[_key] = arguments[_key];
  }

  return (0, _util.freeze)(function (v) {
    return validators.reduce(function (result, validator) {
      return result.concat(validator(v) || []);
    }, []);
  });
}