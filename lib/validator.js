"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alwaysValid = alwaysValid;
var noValidationErrors = exports.noValidationErrors = Object.freeze ? Object.freeze([]) : [];

function alwaysValid() {
  return noValidationErrors;
}