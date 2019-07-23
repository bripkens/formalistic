"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxSeverityOfMessages = getMaxSeverityOfMessages;
exports.getMaxSeverity = getMaxSeverity;
exports.numbers = void 0;
var numbers = {
  ok: 0,
  info: 1,
  warning: 2,
  error: 3
};
exports.numbers = numbers;
var labels = {
  0: 'ok',
  1: 'info',
  2: 'warning',
  3: 'error'
};

function getMaxSeverityOfMessages(messages) {
  var maxSeverity = numbers.ok;

  for (var i = 0, len = messages.length; i < len; i++) {
    var message = messages[i];
    var severity = numbers[message.severity];

    if (severity > maxSeverity) {
      maxSeverity = severity;
    }
  }

  return labels[maxSeverity];
}

function getMaxSeverity(a, b) {
  return labels[Math.max(numbers[a], numbers[b])];
}