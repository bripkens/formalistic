import {freeze, emptyArray} from './util';

export const noValidationErrors = emptyArray;

export function alwaysValid() {
  return noValidationErrors;
}


export const notBlankError = freeze([
  freeze({
    severity: 'error',
    message: 'The value must not be blank.'
  })
]);
export function notBlank(s) {
  if (!s || s.trim().length === 0) {
    return notBlankError;
  }

  return noValidationErrors;
}
