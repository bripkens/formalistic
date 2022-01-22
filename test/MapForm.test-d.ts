import {createMapForm, createField, Field, MapForm} from '../formalistic';
import {expectAssignable, expectError, expectType} from 'tsd';


const testForm = createMapForm({
  items: {
    booleanField: createField({ value: false }),
    numberField: createField({ value: 0.1 }),
  }
});

// createMapForm() correctly infers form type from initial shape
type ExpectedCreateResult = MapForm<{
  booleanField: Field<boolean>,
  numberField: Field<number>
}>;
expectType<ExpectedCreateResult>(testForm);

// put() mutates the returned forms type to include the added field
type ExpectedPutResult = MapForm<{
  booleanField: Field<boolean>,
  numberField: Field<number>,
  newField: Field<string>
}>;
expectAssignable<ExpectedPutResult>(testForm.put('newField', createField({ value: 'somestring' })));

// put() overwrites the type of a map field, if one with a different type is assigned
type ExpectedOverwritingPutResult = MapForm<{
  booleanField: Field<boolean>,
  numberField: Field<string[]>
}>;
expectAssignable<ExpectedOverwritingPutResult>(testForm.put('numberField', createField({ value: [ '1', '2' ] })));

// get() on existing map fields returns the respective item type
expectType<Field<boolean>>(testForm.get('booleanField'));

// get() can't access non-exsisting map fields
expectError(testForm.get('missingField'));

// remove() mutates the returned forms type to not include the removed field
type ExpectedRemoveResult = MapForm<{
  numberField: Field<number>;
}>
expectAssignable<ExpectedRemoveResult>(testForm.remove('booleanField'));

// remove() does not allow to remove not existing fields
expectError(testForm.remove('missingField'));

// reduce() correctly provides possible key and field types
expectType<number>(testForm.reduce((acc: number, current: Field<number> | Field<boolean>, key: 'numberField' | 'booleanField') => {
  return acc + 1;
}, 0));

// containsKey() accepts possible field names
expectType<boolean>(testForm.containsKey('numberField'));

// containsKey() does not accept impossible field names
expectError(testForm.containsKey('missingField'));

// toJS() correctly returns a plain object representation of the forms contents
type ExpectedToJsResult = { booleanField: boolean, numberField: number };
expectType<ExpectedToJsResult>(testForm.toJS());
