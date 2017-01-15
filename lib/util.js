"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStrictReferenceEqual = isStrictReferenceEqual;
exports.shallowCopyObject = shallowCopyObject;
exports.shallowCopyArray = shallowCopyArray;
function isStrictReferenceEqual(a, b) {
  return a === b;
}

var freeze = exports.freeze = Object.freeze ? function (a) {
  return Object.freeze(a);
} : identity;

var emptyArray = exports.emptyArray = freeze([]);
var emptyObject = exports.emptyObject = freeze({});

function shallowCopyObject(obj) {
  var copy = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = obj[key];
    }
  }
  return copy;
}

function shallowCopyArray(arr) {
  var copy = Array(arr.length);
  for (var i = 0, len = arr.length; i < len; i++) {
    copy[i] = arr[i];
  }
  return copy;
}