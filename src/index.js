import {notBlank, compose, alwaysValid} from './validator';
import createListFormFn from './ListForm';
import createMapFormFn from './MapForm';
import createFieldFn from './Field';

export const createField = createFieldFn;
export const createMapForm = createMapFormFn;
export const createListForm = createListFormFn;

export const notBlankValidator = notBlank;
export const alwaysValidValidator = alwaysValid;
export const composeValidators = compose;
