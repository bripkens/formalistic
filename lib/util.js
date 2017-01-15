"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strictReferenceEqual = strictReferenceEqual;
function strictReferenceEqual(a, b) {
  return a === b;
}

var freeze = exports.freeze = Object.freeze ? function (a) {
  return Object.freeze(a);
} : identity;