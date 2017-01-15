'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notBlankError = exports.noValidationErrors = undefined;
exports.alwaysValid = alwaysValid;
exports.notBlank = notBlank;

var _util = require('./util');

var noValidationErrors = exports.noValidationErrors = (0, _util.freeze)([]);

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