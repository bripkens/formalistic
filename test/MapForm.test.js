import {expect} from 'chai';

import createMapForm from '../src/MapForm';
import {notBlank} from '../src/validator';
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

  describe('reduce', () => {
    it('must result in seed when form is empty', () => {
      const seed = 42;
      expect(createMapForm().reduce((acc) => acc, seed)).to.equal(seed);
    });

    it('must result in accumulated value', () => {
      const form = createMapForm()
        .put('email', createField({value: 'joh@doe.com'}))
        .put('password', createField({value: 'password'}));

      const accumulated = form.reduce((acc) => acc + 1, 40);

      expect(accumulated).to.equal(42);
    });

    it('must be equal to toJS when accumulating to object', () => {
      const form = createMapForm()
        .put('email', createField({value: 'joh@doe.com'}))
        .put('password', createField({value: 'password'}));

      const obj = form.reduce((acc, cur, key) => {
        acc[key] = cur.value;
        return acc;
      }, {});

      expect(obj).to.deep.equal(form.toJS());
    });

    it('must equal Object.keys() when accumulating only keys', () => {
      const form = createMapForm()
        .put('email', createField({value: 'joh@doe.com'}))
        .put('password', createField({value: 'password'}));

      const obj = form.reduce((acc, cur, key) => {
        return acc.concat(key);
      }, []);

      expect(obj).to.deep.equal(Object.keys(form.toJS()));
    });
  });

  describe('containsKey', () => {
    it('must return false when key is not in form', () => {
      expect(createMapForm().containsKey('abc')).to.equal(false);
    });

    it ('must return true when key is in the form', () => {
      const form = createMapForm()
        .put('email', createField({value: 'abc@example.com'}));

      expect(form.containsKey('email')).to.equal(true);
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
        .put('email', createField({value: 'tom@example.com'}));
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

    it('must touch recursively', () => {
      form = createMapForm()
        .put('email', createField())
        .setTouched(true, {recurse: true});

      expect(form.touched).to.equal(true);
      expect(form.get('email').touched).to.equal(true);
    });
  });

  describe('validation', () => {
    it('must be valid initially', () => {
      form = createMapForm();
      expect(form.valid).to.equal(true);
      expect(form.maxSeverity).to.equal('ok');
    });

    it('must have valid hierarchy when there is no hierarchy', () => {
      form = createMapForm();
      expect(form.hierarchyValid).to.equal(true);
      expect(form.maxSeverityOfHierarchy).to.equal('ok');
    });

    it('must detect invalid state of children', () => {
      form = createMapForm()
        .put('name', createField({value: '', validator: notBlank}));
      expect(form.hierarchyValid).to.equal(false);
      expect(form.maxSeverityOfHierarchy).to.equal('error');
      expect(form.valid).to.equal(true);
    });

    it('must identify errors on the form itself', () => {
      form = createMapForm({
        validator() {
          return [{
            severity: 'error',
            message: 'Always invalid'
          }];
        }
      })
        .put('name', createField());

      expect(form.valid).to.equal(false);
      expect(form.maxSeverity).to.equal('error');
      expect(form.hierarchyValid).to.equal(false);
      expect(form.maxSeverityOfHierarchy).to.equal('error');
    });
  });
});
