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
      expect(form.get('email')).toEqual(field);
    });

    it('must overwrite fields', () => {
      const field = createField({value: 'tom@example.com'});
      const changedField = field.setValue('marry@example.com');
      form = createMapForm()
        .put('email', field);
      const changedForm = form.put('email', changedField);
      expect(form.get('email')).toEqual(field);
      expect(changedForm.get('email')).toEqual(changedField);
      expect(changedForm).not.toEqual(form);
    });

    it('must be a noop when put would set the same field again', () => {
      const field = createField({value: 'tom@example.com'});
      form = createMapForm()
        .put('email', field);
      const changedForm = form.put('email', field);
      expect(changedForm).toEqual(form);
    });

    it('must remove items', () => {
      const field = createField({value: 'tom@example.com'});
      form = createMapForm()
        .put('email', field)
        .remove('email');
      expect(form.get('email')).toEqual(undefined);
    });

    it('must not do anything when trying to remove an item which does not exist', () => {
      const field = createField({value: 'tom@example.com'});
      form = createMapForm()
        .put('email', field);
      const changed = form.remove('nope');
      expect(changed).toEqual(form);
    });
  });

  describe('reduce', () => {
    it('must result in seed when form is empty', () => {
      const seed = 42;
      expect(createMapForm().reduce((acc) => acc, seed)).toEqual(seed);
    });

    it('must result in accumulated value', () => {
      const form = createMapForm()
        .put('email', createField({value: 'joh@doe.com'}))
        .put('password', createField({value: 'password'}));

      const accumulated = form.reduce((acc) => acc + 1, 40);

      expect(accumulated).toEqual(42);
    });

    it('must be equal to toJS when accumulating to object', () => {
      const form = createMapForm()
        .put('email', createField({value: 'joh@doe.com'}))
        .put('password', createField({value: 'password'}));

      const obj = form.reduce((acc, cur, key) => {
        acc[key] = cur.value;
        return acc;
      }, {});

      expect(obj).toEqual(form.toJS());
    });

    it('must equal Object.keys() when accumulating only keys', () => {
      const form = createMapForm()
        .put('email', createField({value: 'joh@doe.com'}))
        .put('password', createField({value: 'password'}));

      const obj = form.reduce((acc, cur, key) => {
        return acc.concat(key);
      }, []);

      expect(obj).toEqual(Object.keys(form.toJS()));
    });
  });

  describe('containsKey', () => {
    it('must return false when key is not in form', () => {
      expect(createMapForm().containsKey('abc')).toEqual(false);
    });

    it ('must return true when key is in the form', () => {
      const form = createMapForm()
        .put('email', createField({value: 'abc@example.com'}));

      expect(form.containsKey('email')).toEqual(true);
    });
  });

  describe('toJS', () => {
    it('must result in an empty object when there are no items', () => {
      expect(createMapForm().toJS()).toEqual({});
    });

    it('must recursively call toJS', () => {
      const form = createMapForm()
        .put('email', createField({value: 'tom@example.com'}))
        .put('password', createField({value: 'abc'}));
      expect(form.toJS()).toEqual({
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
      expect(form).not.toEqual(changedForm);
      expect(changedForm.get('email').value).toEqual('jennifer@example.com');
    });

    it('must support deep updates', () => {
      const form = createMapForm()
        .put('contactInfo', createMapForm()
          .put('email', createField({value: 'tom@example.com'})));
      const changedForm = form.updateIn(['contactInfo', 'email'], field => field.setValue('jennifer@example.com'));
      expect(form).not.toEqual(changedForm);
      expect(changedForm.get('contactInfo').get('email').value).toEqual('jennifer@example.com');
    });

    it('must support updates on root level with empty paths', () => {
      const form = createMapForm()
        .put('email', createField({value: 'tom@example.com'}));
      const changedForm = form.updateIn([], f => f.setTouched(true));
      expect(form).not.toEqual(changedForm);
      expect(form.touched).toEqual(false);
      expect(changedForm.touched).toEqual(true);
    });

    it('must throw on missing sub paths', () => {
      const form = createMapForm()
        .put('email', createField({value: 'tom@example.com'}));
      expect(() => form.updateIn(['contactInfo', 'email'], field => field.setValue('jennifer@example.com')))
        .toThrow(/No item to update at path "contactInfo"/);
    });
  });

  describe('getIn', () => {
    it('must support get value', () => {
      const field = createField({value: 'tom@example.com'});
      const form = createMapForm()
        .put('email', field);
      expect(form.getIn(['email'])).toEqual(field);
    });

    it('must support deep get value', () => {
      const field = createField({value: 'tom@example.com'});
      const form = createMapForm()
        .put('contactInfo', createMapForm()
          .put('email', field));
      expect(form.getIn(['contactInfo', 'email'])).toEqual(field);
    });

    it('must support get on root level with empty paths', () => {
      const form = createMapForm()
        .put('contactInfo', createMapForm()
          .put('email', createField({value: 'tom@example.com'})));
      expect(form.getIn([])).toEqual(form);
    });

    it('must throw on missing sub paths', () => {
      const field = createField({value: 'tom@example.com'});
      const form = createMapForm()
        .put('email', field);
      expect(() => form.getIn(['contactInfo', 'email'])).toThrow(/No item found at path "contactInfo"/);
    });
  });

  describe('touched', () => {
    it('must assume that the form is initially pristine', () => {
      form = createMapForm();
      expect(form.touched).toEqual(false);
    });

    it('must support explicit touched status changes', () => {
      form = createMapForm({touched: 'yes'});
      expect(form.touched).toEqual(true);
    });

    it('must support switching between touched/pristine state', () => {
      form = createMapForm({touched: 'yes'})
        .setTouched(false);
      expect(form.touched).toEqual(false);
    });

    it('must touch recursively', () => {
      form = createMapForm()
        .put('email', createField())
        .setTouched(true, {recurse: true});

      expect(form.touched).toEqual(true);
      expect(form.get('email').touched).toEqual(true);
    });
  });

  describe('validation', () => {
    it('must be valid initially', () => {
      form = createMapForm();
      expect(form.valid).toEqual(true);
      expect(form.maxSeverity).toEqual('ok');
    });

    it('must have valid hierarchy when there is no hierarchy', () => {
      form = createMapForm();
      expect(form.hierarchyValid).toEqual(true);
      expect(form.maxSeverityOfHierarchy).toEqual('ok');
    });

    it('must detect invalid state of children', () => {
      form = createMapForm()
        .put('name', createField({value: '', validator: notBlank}));
      expect(form.hierarchyValid).toEqual(false);
      expect(form.maxSeverityOfHierarchy).toEqual('error');
      expect(form.valid).toEqual(true);
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

      expect(form.valid).toEqual(false);
      expect(form.maxSeverity).toEqual('error');
      expect(form.hierarchyValid).toEqual(false);
      expect(form.maxSeverityOfHierarchy).toEqual('error');
    });
  });

  describe('getAllMessagesInHierarchy', () => {
    it('must determine all messages', () => {
      const form = createMapForm({
        validator() {
          return [{
            severity: 'error',
            message: 'Always invalid'
          }];
        }
      })
        .put('invalidEmail', createField({value: '', validator: notBlank}))
        .put('alwaysValidSomething', createField({value: 'Something', validator: notBlank}))
        .put('invalidName', createField({value: '', validator: notBlank}));

      expect(form.getAllMessagesInHierarchy()).toEqual([
        {
          'severity': 'error',
          'message': 'Always invalid',
          'path': '$'
        },
        {
          'severity': 'error',
          'message': 'The value must not be blank.',
          'path': '$.invalidEmail'
        },
        {
          'severity': 'error',
          'message': 'The value must not be blank.',
          'path': '$.invalidName'
        }
      ]);
    });

    it('must not list errors when nothing is wrong', () => {
      const form = createMapForm()
        .put('alwaysValidSomething', createField({value: 'Something', validator: notBlank}));

      expect(form.getAllMessagesInHierarchy()).toEqual([]);
    });
  });
});
