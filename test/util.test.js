import {shallowCopyObject, shallowCopyArray, identity} from '../src/util';

describe('util', () => {
  describe('identity', () => {
    it('must return first parameter', () => {
      expect(identity('a')).toEqual('a');
    });
  });

  describe('shallowCopyObject', () => {
    it('must copy objects', () => {
      const given = {
        email: 'tom@example.com',
        meta: {
          foo: 'bar'
        }
      };

      const copy = shallowCopyObject(given);

      expect(copy).toEqual(given);
      expect(copy).not.toBe(given);
      expect(copy.meta).toEqual(given.meta);
    });
  });

  describe('shallowCopyArray', () => {
    it('must copy arrays', () => {
      const given = [{
        email: 'tom@example.com',
        meta: {
          foo: 'bar'
        }
      }];

      const copy = shallowCopyArray(given);

      expect(copy).toEqual(given);
      expect(copy).not.toBe(given);
      expect(copy[0]).toEqual(given[0]);
    });
  });
});
