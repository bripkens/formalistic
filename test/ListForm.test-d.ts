import {expectError, expectType} from 'tsd';
import {createField, createListForm, Field, ListForm} from '../formalistic';

const testForm = createListForm({ items: [ createField({ value: 'somestring' }) ] });

// createListFrom correctly infers item type from initial list content
expectType<ListForm<Field<string>[]>>(testForm);

// push() accepts items of the forms value type
expectType<typeof testForm>(testForm.push(createField({ value: 'someotherstring' })));

// push() does not accept items that don't match the forms value type
expectError(testForm.push(createField({ value: 1 })));

// insert() accepts items of the forms value type
expectType<typeof  testForm>(testForm.insert(3, createField({ value: 'someotherstring' })));

// insert() does not accept items that don't match the forms value type
expectError(testForm.insert(3, createField({ value: 1 })));

// set() accepts items of the forms value type
expectType<typeof  testForm>(testForm.set(3, createField({ value: 'someotherstring' })));

// set() does not accept items that don't match the forms value type
expectError(testForm.set(3, createField({ value: 1 })));

// unshift() accepts items of the forms value type
expectType<typeof testForm>(testForm.unshift(createField({ value: 'someotherstring' })));

// unshift() does not accept items that don't match the forms value type
expectError(testForm.unshift(createField({ value: 1 })));

// remove() accepts numeric index values and maintains the forms type
expectType<typeof testForm>(testForm.remove(0));

// get() accepts numeric index values and returns the forms value type or undefined
expectType<Field<string> | undefined>(testForm.get(11));

// map() provides the forms value type to the mapper and returns an array of the mappers return type
expectType<string[]>(testForm.map((value: Field<string>) => value.value));

// reduce() correctly provides the field type
expectType<number>(testForm.reduce((acc: number, current: Field<string> , index: number) => {
  return acc + 1;
}, 0));

// moveUp() accepts a numeric index and maintains the forms type
expectType<typeof testForm>(testForm.moveUp(1));

// moveDown() accepts a numeric index and maintains the forms type
expectType<typeof testForm>(testForm.moveDown(1));

// toJS() correctly returns a plain object representation of the forms contents
expectType<string[]>(testForm.toJS());
