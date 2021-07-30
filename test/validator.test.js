import {compose, notBlank, notBlankError} from '../src/validator';

const onlyEvenLengthStringsError = [{
  severity: 'warning',
  message: 'Uneven length string required'
}];
const onlyEvenLengthStrings = s => s.length !== 0 && s.length % 2 === 0 ? null : onlyEvenLengthStringsError;

describe('validator', () => {
  describe('compose', () => {
    it('must return not fail when no validator is given', () => {
      expect(compose()('abc')).toEqual([]);
    });

    it('must return result of a single validator', () => {
      expect(compose(notBlank)('')).toEqual(notBlankError);
      expect(compose(notBlank)('abc')).toEqual([]);
    });

    it('must compose multiple validators', () => {
      expect(compose(notBlank, onlyEvenLengthStrings)('')).toEqual(notBlankError.concat(onlyEvenLengthStringsError));
      expect(compose(notBlank, onlyEvenLengthStrings)('abc')).toEqual(onlyEvenLengthStringsError);
      expect(compose(notBlank, onlyEvenLengthStrings)('abcd')).toEqual([]);
    });
  });
});
