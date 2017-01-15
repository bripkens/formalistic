import {expect} from 'chai';
import sinon from 'sinon';

import {notBlank, notBlankError} from '../src/validator';
import createField from '../src/Field';

describe('Field', () => {
  let field;

  it('must support field creation without options', () => {
    field = createField();
    expect(field.value).to.equal(undefined);
  });

  describe('value', () => {
    it('must use value provided during initial create', () => {
      field = createField({value: 'foobar'});
      expect(field.value).to.equal('foobar');
    });

    it('must change value', () => {
      field = createField({value: 'foobar'})
        .setValue('blub');
      expect(field.value).to.equal('blub');
    });

    it('must recreate field when changing the value', () => {
      field = createField({value: 'foobar'});
      const changed = field.setValue('blub');
      expect(field).not.to.equal(changed);
    });

    it('must not create new field instance when value has not changed', () => {
      field = createField({value: 'foobar'});
      const changed = field.setValue(field.value);
      expect(field).to.equal(changed);
    });

    it('must respect isEqual function for the identification of equal values in setValue', () => {
      field = createField({value: '5', isEqual: (a, b) => a == b});
      const changed = field.setValue(5);
      expect(field).to.equal(changed);
    });

    it('must support undefined as pristine value', () => {
      field = createField({value: 'foobar', pristineValue: undefined});
      expect(field.changed).to.equal(true);
    });
  });

  describe('change detection', () => {
    it('must be unchanged initially', () => {
      field = createField({value: 'foobar'});
      expect(field.changed).to.equal(false);
    });

    it('must change to changed when value changes', () => {
      field = createField({value: 'foobar'})
        .setValue('blub');
      expect(field.changed).to.equal(true);
    });

    it('must check value type using default isEqual check', () => {
      field = createField({value: '5'})
        .setValue(5);
      expect(field.changed).to.equal(true);
    });

    it('must remain unchanged when value is equal according to isEqual check', () => {
      field = createField({
          value: '5',
          isEqual: (a, b) => a == b
        })
        .setValue(5);
      expect(field.changed).to.equal(false);
    });
  });

  describe('touched', () => {
    it('must assume that the value is initially pristine', () => {
      field = createField({value: '5'});
      expect(field.touched).to.equal(false);
    });

    it('must support explicit touched status changes', () => {
      field = createField({value: '5', touched: 'yes'});
      expect(field.touched).to.equal(true);
    });

    it('must support switching between touched/pristine state', () => {
      field = createField({value: '5', touched: 'yes'})
        .setTouched(false);
      expect(field.touched).to.equal(false);
    });
  });

  describe('toJS', () => {
    it('must turn field to JS', () => {
      field = createField({value: 'foobar'});
      expect(field.toJS()).to.equal('foobar');
    });
  });

  describe('map', () => {
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
    it('must be valid by default', () => {
      field = createField({value: 'foobar'});
      expect(field.messages).to.deep.equal([]);
      expect(field.valid).to.equal(true);
      expect(field.maxSeverity).to.equal('ok');
    });

    it('must support custom validators', () => {
      field = createField({value: 'foobar', validator: notBlank});
      expect(field.messages).to.deep.equal([]);
      expect(field.valid).to.equal(true);
      expect(field.maxSeverity).to.equal('ok');
    });

    it('must list validation errors', () => {
      field = createField({value: 'foobar', validator: notBlank})
        .setValue('  \n  ');
      expect(field.messages).to.deep.equal(notBlankError);
      expect(field.valid).to.equal(false);
      expect(field.maxSeverity).to.equal('error');
    });

    it('must switch back to valid state', () => {
      field = createField({value: 'foobar', validator: notBlank})
        .setValue('  \n  ')
        .setValue('blub');
      expect(field.messages).to.deep.equal([]);
      expect(field.valid).to.equal(true);
      expect(field.maxSeverity).to.equal('ok');
    });

    it('must support validators that return a falsy value', () => {
      field = createField({value: 'foobar', validator: () => null});
      expect(field.messages).to.deep.equal([]);
      expect(field.valid).to.equal(true);
      expect(field.maxSeverity).to.equal('ok');
    });

    it('must find the message with the highest severity', () => {
      const messages = [
        {
          severity: 'warning',
          message: 'just a warning'
        },
        {
          severity: 'info',
          message: 'just an info'
        }
      ];

      field = createField({value: 'foobar', validator: () => messages});
      expect(field.messages).to.deep.equal(messages);
      expect(field.valid).to.equal(true);
      expect(field.maxSeverity).to.equal('warning');
    });
  });
});
