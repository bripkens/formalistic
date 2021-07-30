import {createListForm, createMapForm, createField} from '../src';

describe('Form', () => {
  const email = createField({value: 'jennifer@example.com'});
  const name = createField({value: 'jen'});
  let form;

  it('must update deep values in a mixed list/map form situation', () => {
    form = createMapForm()
      .put(
        'person',
        createListForm()
          .push(email)
          .push(name)
      );

    const updatedForm = form
      .updateIn(['person', 1], field => field.setValue('Jennifer'));

    expect(updatedForm).not.toEqual(form);
    expect(updatedForm.toJS()).toEqual({
      person: ['jennifer@example.com', 'Jennifer']
    });
  });

  it('must get deep values in a mixed list/map form situation', () => {
    form = createMapForm()
      .put(
        'person',
        createListForm()
          .push(email)
          .push(name)
      );

    expect(form.getIn(['person', 0])).toEqual(email);
    expect(form.getIn(['person', 1])).toEqual(name);
  });
});
