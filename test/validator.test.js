import {expect} from 'chai';

import {compose, notBlank, notBlankError} from '../src/validator';

const onlyEvenLengthStringsError = [{
  severity: 'warning',
  message: 'Uneven length string required'
}];
const onlyEvenLengthStrings = s => s.length !== 0 && s.length % 2 === 0 ? null : onlyEvenLengthStringsError;

describe('validator', () => {
  describe('compose', () => {
    it('must return not fail when no validator is given', () => {
      expect(compose()('abc')).to.deep.equal([]);
    });

    it('must return result of a single validator', () => {
      expect(compose(notBlank)('')).to.deep.equal(notBlankError);
      expect(compose(notBlank)('abc')).to.deep.equal([]);
    });

    it('must compose multiple validators', () => {
      expect(compose(notBlank, onlyEvenLengthStrings)('')).to.deep.equal(notBlankError.concat(onlyEvenLengthStringsError));
      expect(compose(notBlank, onlyEvenLengthStrings)('abc')).to.deep.equal(onlyEvenLengthStringsError);
      expect(compose(notBlank, onlyEvenLengthStrings)('abcd')).to.deep.equal([]);
    });
  });
});
