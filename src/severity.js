export const numbers = {
  ok: 0,
  info: 1,
  warning: 2,
  error: 3
};

const labels = {
  0: 'ok',
  1: 'info',
  2: 'warning',
  3: 'error'
};

export function getMaxSeverityOfMessages(messages) {
  let maxSeverity = numbers.ok;

  for (let i = 0, len = messages.length; i < len; i++) {
    const message = messages[i];
    const severity = numbers[message.severity];
    if (severity >  maxSeverity) {
      maxSeverity = severity;
    }
  }

  return labels[maxSeverity];
}

export function getMaxSeverity(a, b) {
  return labels[Math.max(numbers[a], numbers[b])];
}
