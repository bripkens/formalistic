import {getMaxSeverity} from '../src/severity';

describe('severity', () => {
  describe('getMaxSeverity', () => {
    it('must find the maximum severity', () => {
      expect(getMaxSeverity('ok', 'info')).toEqual('info');
      expect(getMaxSeverity('warning', 'info')).toEqual('warning');
      expect(getMaxSeverity('warning', 'error')).toEqual('error');
      expect(getMaxSeverity('ok', 'error')).toEqual('error');
    });
  });
});
