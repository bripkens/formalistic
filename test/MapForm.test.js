import {expect} from 'chai';
import sinon from 'sinon';

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

    it('must not do anything when trying to remove an item which does not exist', () => {
      const field = createField({value: 'tom@example.com'});
      form = createMapForm()
        .put('email', field);
      const changed = form.remove('nope');
      expect(changed).to.equal(form);
    });
  });

  describe('toJS', () => {
    it('must result in an empty object when there are no items', () => {
      expect(createMapForm().toJS()).to.deep.equal({});
    });

    it('must recursively call toJS', () => {
      const form = createMapForm()
        .put('email', createField({value: 'tom@example.com'}))
        .put('password', createField({value: 'abc'}));
      expect(form.toJS()).to.deep.equal({
        email: 'tom@example.com',
        password: 'abc'
      });
    });
  });

  describe('map', () => {
    it('must allow mapping of forms', () => {
      const form = createMapForm()
        .put('email', createField({value: 'tom@example.com'}))
      const mapper = sinon.stub();
      mapper.returns(42);

      const result = form.map(mapper);

      expect(result).to.equal(42);
      expect(mapper.callCount).to.equal(1);
      expect(mapper.getCall(0).args[0]).to.equal(form);
    });
  });
});
