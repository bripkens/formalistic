import {freeze} from './util';

export const noValidationErrors = freeze([]);

export function alwaysValid() {
  return noValidationErrors;
}
