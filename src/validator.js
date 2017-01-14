export const noValidationErrors = Object.freeze ? Object.freeze([]) : [];

export function alwaysValid() {
  return noValidationErrors;
}
