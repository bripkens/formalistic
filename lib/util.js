"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = identity;
exports.isStrictReferenceEqual = isStrictReferenceEqual;
exports.shallowCopyObject = shallowCopyObject;
exports.shallowCopyArray = shallowCopyArray;
exports.createMessagesWithJsonPath = createMessagesWithJsonPath;
exports.emptyObject = exports.emptyArray = exports.freeze = void 0;

function identity(a) {
  return a;
}

function isStrictReferenceEqual(a, b) {
  return a === b;
}

var freeze = Object.freeze ? function (a) {
  return Object.freeze(a);
} : identity;
exports.freeze = freeze;
var emptyArray = freeze([]);
exports.emptyArray = emptyArray;
var emptyObject = freeze({});
exports.emptyObject = emptyObject;

function shallowCopyObject(obj) {
  var copy = {};

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
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

function createMessagesWithJsonPath(messages, jsonPath) {
  return messages.map(function (message) {
    var messageCopy = shallowCopyObject(message);
    messageCopy.path = jsonPath;
    return messageCopy;
  });
}