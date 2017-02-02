import {expect} from 'chai';

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

    expect(updatedForm).not.to.equal(form);
    expect(updatedForm.toJS()).to.deep.equal({
      person: ['jennifer@example.com', 'Jennifer']
    });
  });
});
