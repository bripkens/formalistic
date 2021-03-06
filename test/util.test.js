import {expect} from 'chai';

import {shallowCopyObject, shallowCopyArray, identity} from '../src/util';

describe('util', () => {
  describe('identity', () => {
    it('must return first parameter', () => {
      expect(identity('a')).to.equal('a');
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

      expect(copy).to.deep.equal(given);
      expect(copy).not.to.equal(given);
      expect(copy.meta).to.equal(given.meta);
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

      expect(copy).to.deep.equal(given);
      expect(copy).not.to.equal(given);
      expect(copy[0]).to.equal(given[0]);
    });
  });
});
