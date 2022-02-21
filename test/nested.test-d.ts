import {
  createField,
  createListForm,
  createMapForm,
  Field,
  MapForm,
} from '../formalistic';
import {expectAssignable, expectError, expectNotAssignable, expectNotType, expectType} from "tsd";

const simpleTestForm = createMapForm({
  items: {
    mapField: createMapForm({
      items: {
        mapFieldTwo: createMapForm({
          items: {
            stringField: createField({ value: 'some string'})
          }
        })
      }
    })
  }
});

const testForm = createMapForm({
  items: {
    mapField: createMapForm({
      items: {
        stringField: createField({ value: 'some string'})
      }
    }),
    listField: createListForm({
      items: [ createField({ value: 1 })]
    }),
    listMapField: createListForm({ items: [
        createMapForm({ items: { field: createField({ value: false }) } })
      ]})
  }
});

// toJS() correctly handles nested forms
type ExpectedToJsResult = {
  mapField: {
    mapFieldTwo: {
      stringField: string
    }
  }
}
expectType<ExpectedToJsResult>(simpleTestForm.toJS());

// getIn()  allows access to fields in nested MapForms
expectType<Field<string>>(testForm.getIn([ 'mapField', 'stringField' ]));

// getIn() allows access to fields in nested ListForms
expectType<Field<number>>(testForm.getIn([ 'listField', 0]));

// getIn() allows access to fields of MapForms within nested ListForms
expectType<Field<boolean>>(testForm.getIn([ 'listMapField', 0, 'field' ]));

// getIn() prevents access to fields which are not present
expectError(testForm.getIn([ 'mapField', 'missingField']));

// updateIn() reflects changes made on the returned type
type ExpectedUpdateInResult = MapForm<{
  mapField: MapForm<{
    mapFieldTwo: MapForm<{
      stringField: Field<string>,
      numberField: Field<number>
    }>
  }>
}>
expectAssignable<ExpectedUpdateInResult>(simpleTestForm.updateIn(
  [ 'mapField', 'mapFieldTwo' ],
  (form: MapForm<{ stringField: Field<string> }>) => {
    return form.put('numberField', createField({ value: 1 }))
  }
));

// updateIn() prevents the use of invalid paths
expectError(simpleTestForm.updateIn(
  [ 'mapField', 'invalidField' ],
  (form: MapForm<{ stringField: Field<string> }>) => {
    return form.put('numberField', createField({ value: 1 }))
  }
));

// updateIn() prevents the use of updaters accept the wrong type
expectError(simpleTestForm.updateIn(
  [ 'mapField', 'mapFieldTwo' ],
  (form: MapForm<{ invalidField: Field<string> }>) => {
    return form.put('numberField', createField({ value: 1 }))
  }
));

/**
 * Limitations
 */

// getIn() cannot prevent the access of invalid ListForm elements
expectType<Field<number>>(testForm.getIn([ 'listField', 1000]));

// updateIn() cannot prevent the access of invalid ListForm elements
const f = testForm.updateIn(
  [ 'listField',  0 ],
  field => field.setValue(123)
).toJS()

expectAssignable<typeof testForm>(testForm.updateIn(
  [ 'listField',  0 ],
  field => field.setValue(123)
));

// updateIn() may mutate a ListForms value type, because the updaters signature can't infer nested value types
expectNotAssignable<typeof testForm>(testForm.updateIn(
  [ 'listMapField',  0 ],
  form => form.put('otherField', createField({ value: 2 }))
));



















