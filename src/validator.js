import {freeze} from './util';

export const noValidationErrors = freeze([]);

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
