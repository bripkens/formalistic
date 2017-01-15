import {expect} from 'chai';

import {getMaxSeverity} from '../src/severity';

describe('severity', () => {
  describe('getMaxSeverity', () => {
    it('must find the maximum severity', () => {
      expect(getMaxSeverity('ok', 'info')).to.equal('info');
      expect(getMaxSeverity('warning', 'info')).to.equal('warning');
      expect(getMaxSeverity('warning', 'error')).to.equal('error');
      expect(getMaxSeverity('ok', 'error')).to.equal('error');
    });
  });
});
