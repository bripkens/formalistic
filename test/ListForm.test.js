import {expect} from 'chai';

import createListForm from '../src/ListForm';
import {notBlank} from '../src/validator';
import createField from '../src/Field';

describe('ListForm', () => {
  let form;

  describe('push / get / set', () => {
    it('must add fields to the end of the list', () => {
      const field = createField({value: 'tom@example.com'});
      form = createListForm()
        .push(field);
      expect(form.get(0)).to.equal(field);
    });

    it('must add multiple fields', () => {
      const email = createField({value: 'tom@example.com'});
      const name = createField({value: 'Tom'});
      form = createListForm()
        .push(email)
        .push(name);
      expect(form.get(0)).to.equal(email);
      expect(form.get(1)).to.equal(name);
    });

    it('must not mutate existing form object', () => {
      const emptyForm = createListForm();
      const updatedNonEmptyForm = emptyForm.push(createField({value: 'blub'}));
      expect(updatedNonEmptyForm).not.to.equal(emptyForm);
      expect(emptyForm.get(0)).to.equal(undefined);
    });

    it('must not change the form when the field value is exactly the same', () => {
      const email = createField({value: 'tom@example.com'});
      form = createListForm().push(email);
      const updatedForm = form.set(0, email);
      expect(updatedForm).to.equal(form);
    });
  });

  describe('remove', () => {
    const field1 = createField({value: '1'});
    const field2 = createField({value: '2'});
    const field3 = createField({value: '3'});

    beforeEach(() => {
      form = createListForm()
        .push(field1)
        .push(field2)
        .push(field3);
    });

    it('must be able to remove the first field', () => {
      expect(form.remove(0).toJS()).to.deep.equal(['2', '3']);
    });

    it('must be able to remove the second field', () => {
      expect(form.remove(1).toJS()).to.deep.equal(['1', '3']);
    });

    it('must be able to remove the third field', () => {
      expect(form.remove(2).toJS()).to.deep.equal(['1', '2']);
    });

    it('must not explode when asked to remove fields which do not exist', () => {
      expect(form.remove(3).toJS()).to.deep.equal(['1', '2', '3']);
    });
  });

  describe('updateIn', () => {
    it('must fail when the path does not exist', () => {
      form = createListForm().push(createField({value: '1'}));
      expect(() => form.updateIn([1, () => true])).to.throw(/No item to update at path/);
    });

    it('must update in deeply nested list structures', () => {
      form = createListForm()
        .push(createListForm()
          .push(createField({value: 'jen'})));
      const updatedForm = form.updateIn([0, 0], field => field.setValue('Jennifer'));
      expect(updatedForm).not.to.equal(form);
      expect(updatedForm.toJS()).to.deep.equal([['Jennifer']]);
    });
  });

  describe('touched', () => {
    it('must assume that the form is initially pristine', () => {
      form = createListForm();
      expect(form.touched).to.equal(false);
    });

    it('must support explicit touched status changes', () => {
      form = createListForm({touched: 'yes'});
      expect(form.touched).to.equal(true);
    });

    it('must support switching between touched/pristine state', () => {
      form = createListForm({touched: 'yes'})
        .setTouched(false);
      expect(form.touched).to.equal(false);
    });

    it('must touch recursively', () => {
      form = createListForm()
        .push(createField())
        .setTouched(true, {recurse: true});

      expect(form.touched).to.equal(true);
      expect(form.get(0).touched).to.equal(true);
    });
  });

  describe('validation', () => {
    it('must be valid initially', () => {
      form = createListForm();
      expect(form.valid).to.equal(true);
      expect(form.maxSeverity).to.equal('ok');
    });

    it('must have valid hierarchy when there is no hierarchy', () => {
      form = createListForm();
      expect(form.hierarchyValid).to.equal(true);
      expect(form.maxSeverityOfHierarchy).to.equal('ok');
    });

    it('must detect invalid state of children', () => {
      form = createListForm()
        .push(createField({value: '', validator: notBlank}));
      expect(form.hierarchyValid).to.equal(false);
      expect(form.maxSeverityOfHierarchy).to.equal('error');
      expect(form.valid).to.equal(true);
    });

    it('must identify errors on the form itself', () => {
      form = createListForm({
        validator() {
          return [{
            severity: 'error',
            message: 'Always invalid'
          }];
        }
      })
      .push(createField());

      expect(form.valid).to.equal(false);
      expect(form.maxSeverity).to.equal('error');
      expect(form.hierarchyValid).to.equal(false);
      expect(form.maxSeverityOfHierarchy).to.equal('error');
    });
  });

  describe('toJS', () => {
    it('must JSON serialize the form', () => {
      const json = createListForm()
        .push(createField({value: 'tom@example.com'}))
        .push(createField({value: 'Tom'}))
        .toJS();
      expect(json).to.deep.equal([
        'tom@example.com',
        'Tom'
      ]);
    });
  });
});
