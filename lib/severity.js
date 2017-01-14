'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxSeverity = getMaxSeverity;
var numbers = exports.numbers = {
  ok: 0,
  info: 1,
  warning: 2,
  error: 3
};

var labels = {
  0: 'ok',
  1: 'info',
  2: 'warning',
  3: 'error'
};

function getMaxSeverity(messages) {
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