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
      expect(form.size).to.equal(1);
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

  describe('move', () => {
    beforeEach(() => {
      form = createListForm()
        .push(createField({value: 'a'}))
        .push(createField({value: 'b'}))
        .push(createField({value: 'c'}));
    });

    it('must not fail when moving the first item down', () => {
      form = form.moveDown(0);
      expect(form.toJS()).to.deep.equal(['a', 'b', 'c']);
    });

    it('must not fail when moving the last item up', () => {
      form = form.moveUp(2);
      expect(form.toJS()).to.deep.equal(['a', 'b', 'c']);
    });

    it('must throw when trying to move an item which is not in the list', () => {
      expect(() => form.moveUp(-1)).to.throw(/Index out of bounds: -1/);
      expect(() => form.moveUp(3)).to.throw(/Index out of bounds: 3/);
    });

    it('must move items around', () => {
      form = form.moveUp(0);
      expect(form.toJS()).to.deep.equal(['b', 'a', 'c']);

      form = form.moveDown(2);
      expect(form.toJS()).to.deep.equal(['b', 'c', 'a']);

      form = form.moveDown(1);
      expect(form.toJS()).to.deep.equal(['c', 'b', 'a']);
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

  describe('map', () => {
    it('must pass the item and the index to the mapper function', () => {
      const item0 = createField({value: 'tom@example.com'});
      const item1 = createField({value: 'Tom'});
      form = createListForm()
        .push(item0)
        .push(item1);
      const mapper = (item, i) => {
        if (i === 0) {
          expect(item).to.equal(item0);
        } else if (i === 1) {
          expect(item).to.equal(item1);
        } else {
          throw new Error('Unknown index ' + i);
        }

        return item.value;
      };

      const result = form.map(mapper);
      expect(result).to.deep.equal([item0.value, item1.value]);
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
