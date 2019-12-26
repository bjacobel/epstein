import {
  setJwtToken,
  hasValidJwtToken,
  getJwtToken,
  STORED_TOKEN_NAME,
  STORED_TOKEN_EXPIRY,
} from '../auth';

describe('jwt localstorage utils', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
      },
    });
    Object.defineProperty(Date, 'now', {
      writable: true,
      value: jest.fn().mockReturnValueOnce(1000000),
    });
  });

  describe('get', () => {
    it('returns the jwt token if present', () => {
      window.localStorage.getItem = jest.fn(name => {
        if (name === STORED_TOKEN_NAME) return 'bar';
        if (name === STORED_TOKEN_EXPIRY) return '1001';
        return undefined;
      });
      expect(getJwtToken(STORED_TOKEN_NAME)).toEqual('bar');
    });

    it('throws if the token is missing', () => {
      window.localStorage.getItem = jest.fn(() => undefined);
      expect(() => getJwtToken(STORED_TOKEN_NAME)).toThrowError();
    });

    it('throws if the token is expired', () => {
      window.localStorage.getItem = jest.fn(name => {
        if (name === STORED_TOKEN_NAME) return 'bar';
        if (name === STORED_TOKEN_EXPIRY) return '999';
        return undefined;
      });
      expect(() => getJwtToken(STORED_TOKEN_NAME)).toThrowError();
    });
  });

  describe('has', () => {
    it('is false if the token is missing', () => {
      window.localStorage.getItem = jest.fn(() => undefined);
      expect(hasValidJwtToken(STORED_TOKEN_NAME)).toBeFalsy();
    });

    it('is false if the token is expired', () => {
      window.localStorage.getItem = jest.fn(name => {
        if (name === STORED_TOKEN_NAME) return 'bar';
        if (name === STORED_TOKEN_EXPIRY) return '999';
        return undefined;
      });
      expect(hasValidJwtToken(STORED_TOKEN_NAME)).toBeFalsy();
    });

    it('is true if the expiry is good and the key exists', () => {
      window.localStorage.getItem = jest.fn(name => {
        if (name === STORED_TOKEN_NAME) return 'bar';
        if (name === STORED_TOKEN_EXPIRY) return '1001';
        return undefined;
      });
      expect(hasValidJwtToken(STORED_TOKEN_NAME)).toBeTruthy();
    });
  });

  describe('set', () => {
    it('sets the key with the specified value and expiry', () => {
      setJwtToken('foo', '3600');
      expect(window.localStorage.setItem.mock.calls).toEqual([
        [STORED_TOKEN_NAME, 'foo'],
        [STORED_TOKEN_EXPIRY, 4600],
      ]);
    });
  });
});
