import {notBlank, notBlankError} from '../src/validator';
import createField from '../src/Field';

describe('Field', () => {
  let field;

  it('must support field creation without options', () => {
    field = createField();
    expect(field.value).toEqual(undefined);
  });

  describe('value', () => {
    it('must use value provided during initial create', () => {
      field = createField({value: 'foobar'});
      expect(field.value).toEqual('foobar');
    });

    it('must change value', () => {
      field = createField({value: 'foobar'})
        .setValue('blub');
      expect(field.value).toEqual('blub');
    });

    it('must recreate field when changing the value', () => {
      field = createField({value: 'foobar'});
      const changed = field.setValue('blub');
      expect(field).not.toEqual(changed);
    });

    it('must not create new field instance when value has not changed', () => {
      field = createField({value: 'foobar'});
      const changed = field.setValue(field.value);
      expect(field).toEqual(changed);
    });

    it('must respect isEqual function for the identification of equal values in setValue', () => {
      field = createField({value: '5', isEqual: (a, b) => a == b});
      const changed = field.setValue(5);
      expect(field).toEqual(changed);
    });
  });

  describe('touched', () => {
    it('must assume that the value is initially pristine', () => {
      field = createField({value: '5'});
      expect(field.touched).toEqual(false);
    });

    it('must support explicit touched status changes', () => {
      field = createField({value: '5', touched: 'yes'});
      expect(field.touched).toEqual(true);
    });

    it('must support switching between touched/pristine state', () => {
      field = createField({value: '5', touched: 'yes'})
        .setTouched(false);
      expect(field.touched).toEqual(false);
    });
  });

  describe('toJS', () => {
    it('must turn field to JS', () => {
      field = createField({value: 'foobar'});
      expect(field.toJS()).toEqual('foobar');
    });
  });

  describe('map', () => {
    it('must allow mapping of fields', () => {
      field = createField({value: 'foobar'});
      const mapper = jest.fn();
      mapper.mockReturnValue(42);

      const result = field.map(mapper);

      expect(result).toEqual(42);
      expect(mapper).toHaveBeenCalledTimes(1);
      expect(mapper).toHaveBeenCalledWith(field);
    });
  });

  describe('validation', () => {
    it('must be valid by default', () => {
      field = createField({value: 'foobar'});
      expect(field.messages).toEqual([]);
      expect(field.valid).toEqual(true);
      expect(field.maxSeverity).toEqual('ok');
    });

    it('must support custom validators', () => {
      field = createField({value: 'foobar', validator: notBlank});
      expect(field.messages).toEqual([]);
      expect(field.valid).toEqual(true);
      expect(field.maxSeverity).toEqual('ok');
    });

    it('must list validation errors', () => {
      field = createField({value: 'foobar', validator: notBlank})
        .setValue('  \n  ');
      expect(field.messages).toEqual(notBlankError);
      expect(field.valid).toEqual(false);
      expect(field.maxSeverity).toEqual('error');
    });

    it('must switch back to valid state', () => {
      field = createField({value: 'foobar', validator: notBlank})
        .setValue('  \n  ')
        .setValue('blub');
      expect(field.messages).toEqual([]);
      expect(field.valid).toEqual(true);
      expect(field.maxSeverity).toEqual('ok');
    });

    it('must support validators that return a falsy value', () => {
      field = createField({value: 'foobar', validator: () => null});
      expect(field.messages).toEqual([]);
      expect(field.valid).toEqual(true);
      expect(field.maxSeverity).toEqual('ok');
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
      expect(field.messages).toEqual(messages);
      expect(field.valid).toEqual(true);
      expect(field.maxSeverity).toEqual('warning');
    });
  });

  describe('updateIn', () => {
    it('must throw as updateIn is not supported on fields', () => {
      field = createField({value: 'foobar'});
      expect(() => field.updateIn(['foo', 'bar'], () => {}))
        .toThrow(/Fields have no children and therefore do not support updateIn at path "foo"/);
    });

    it('must support updateIn when path is empty', () => {
      field = createField({value: 'foobar'});
      const updated = field.updateIn([], f => f.setValue('changed'));
      expect(updated.value).toEqual('changed');
    });
  });
});
