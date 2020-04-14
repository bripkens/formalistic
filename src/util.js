export function identity(a) {
  return a;
}

export function isStrictReferenceEqual(a, b) {
  return a === b;
}

export const freeze = Object.freeze ? a => Object.freeze(a) : identity;

export const emptyArray = freeze([]);
export const emptyObject = freeze({});

export function shallowCopyObject(obj) {
  const copy = {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = obj[key];
    }
  }
  return copy;
}

export function shallowCopyArray(arr) {
  const copy = Array(arr.length);
  for (let i = 0, len = arr.length; i < len; i++) {
    copy[i] = arr[i];
  }
  return copy;
}

export function createMessagesWithJsonPath(messages, jsonPath) {
  return messages.map(message => {
    const messageCopy = shallowCopyObject(message);
    messageCopy.path = jsonPath;
    return messageCopy;
  });
}
