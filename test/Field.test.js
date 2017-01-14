import {expect} from 'chai';

import createField from '../src/Field';

describe('Field', () => {
  let field;

  it('must be pristine initially', () => {
    field = createField({value: 'foobar'});
    expect(field.isDirty()).to.equal(false);
    expect(field.isPristine()).to.equal(true);
  });
});
