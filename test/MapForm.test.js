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

  describe('updateIn', () => {
    it('must support updates of values', () => {
      const form = createMapForm()
        .put('email', createField({value: 'tom@example.com'}))
      const changedForm = form.updateIn(['email'], field => field.setValue('jennifer@example.com'));
      expect(form).not.to.equal(changedForm);
      expect(changedForm.get('email').value).to.equal('jennifer@example.com');
    });

    it('must support deep updates', () => {
      const form = createMapForm()
        .put('contactInfo', createMapForm()
          .put('email', createField({value: 'tom@example.com'})));
      const changedForm = form.updateIn(['contactInfo', 'email'], field => field.setValue('jennifer@example.com'));
      expect(form).not.to.equal(changedForm);
      expect(changedForm.get('contactInfo').get('email').value).to.equal('jennifer@example.com');
    });

    it('must throw on missing sub paths', () => {
      const form = createMapForm()
        .put('email', createField({value: 'tom@example.com'}));
      expect(() => form.updateIn(['contactInfo', 'email'], field => field.setValue('jennifer@example.com')))
        .to.throw(/No item to update at path "contactInfo"/);
    });
  });

  describe('touched', () => {
    it('must assume that the form is initially pristine', () => {
      form = createMapForm();
      expect(form.touched).to.equal(false);
    });

    it('must support explicit touched status changes', () => {
      form = createMapForm({touched: 'yes'});
      expect(form.touched).to.equal(true);
    });

    it('must support switching between touched/pristine state', () => {
      form = createMapForm({touched: 'yes'})
        .setTouched(false);
      expect(form.touched).to.equal(false);
    });
  });
});
