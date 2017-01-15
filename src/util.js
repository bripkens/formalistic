export function strictReferenceEqual(a, b) {
  return a === b;
}

export const freeze = Object.freeze ? a => Object.freeze(a) : identity;
