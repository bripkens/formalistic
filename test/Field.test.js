import {expect} from 'chai';
import sinon from 'sinon';

import createField from '../src/Field';

describe('Field', () => {
  let field;

  describe('value', () => {
    it('must use value provided during create initially', () => {
      field = createField({value: 'foobar'});
      expect(field.getValue()).to.equal('foobar');
    });

    it('must change value', () => {
      field = createField({value: 'foobar'})
        .setValue('blub');
      expect(field.getValue()).to.equal('blub');
    });

    it('must recreate field when changing the value', () => {
      field = createField({value: 'foobar'});
      const changed = field.setValue('blub');
      expect(field).not.to.equal(changed);
    });
  });

  describe('pristine/dirty', () => {
    it('must be pristine initially', () => {
      field = createField({value: 'foobar'});
      expect(field.isDirty()).to.equal(false);
      expect(field.isPristine()).to.equal(true);
    });

    it('must mark fields as dirty on setValue', () => {
      field = createField({value: 'foobar'})
        .setValue('blub');
      expect(field.isDirty()).to.equal(true);
      expect(field.isPristine()).to.equal(false);
    });

    it('must switch field state back to pristine', () => {
      field = createField({value: 'foobar'})
        .setValue('blub')
        .markPristine();
      expect(field.isDirty()).to.equal(false);
      expect(field.isPristine()).to.equal(true);
    });

    it('must recreate field when changing pristine state', () => {
      const dirty = createField({value: 'foobar'})
        .setValue('blub');
      const pristine = dirty.markPristine();
      expect(dirty.isDirty()).to.equal(true);
      expect(pristine.isDirty()).to.equal(false);
      expect(dirty).not.to.equal(pristine);
    });
  });

  describe('toJS', () => {
    it('must turn field to JS', () => {
      field = createField({value: 'foobar'});
      expect(field.toJS()).to.equal('foobar');
    });
  });

  describe('mapping', () => {
    it('must allow mapping of fields', () => {
      field = createField({value: 'foobar'});
      const mapper = sinon.stub();
      mapper.returns(42);

      const result = field.map(mapper);

      expect(result).to.equal(42);
      expect(mapper.callCount).to.equal(1);
      expect(mapper.getCall(0).args[0]).to.equal(field);
    });
  });

  describe('validation', () => {
    // TODO
  });
});
