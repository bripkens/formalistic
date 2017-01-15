import {expect} from 'chai';

import createMapForm from '../src/MapForm';
import createField from '../src/Field';

describe('MapForm', () => {
  let form;

  describe('field handling', () => {
    it('must get and set fields', () => {
      const field = createField({value: 'tom@example.com'});
      form = createMapForm()
        .put('email', field);
      expect(form.get('email')).to.deep.equal(field);
    });

    it('must overwrite fields', () => {
      const field = createField({value: 'tom@example.com'});
      const changedField = field.setValue('marry@example.com');
      form = createMapForm()
        .put('email', field);
      const changedForm = form.put('email', changedField);
      expect(form.get('email')).to.deep.equal(field);
      expect(changedForm.get('email')).to.equal(changedField);
      expect(changedForm).not.to.equal(form);
    });

    it('must be a noop when put would set the same field again', () => {
      const field = createField({value: 'tom@example.com'});
      form = createMapForm()
        .put('email', field);
      const changedForm = form.put('email', field);
      expect(changedForm).to.equal(form);
    });

    it('must remove items', () => {
      const field = createField({value: 'tom@example.com'});
      form = createMapForm()
        .put('email', field)
        .remove('email');
      expect(form.get('email')).to.equal(undefined);
    });
  });
});
