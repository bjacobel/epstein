export const STORED_TOKEN_NAME = 'cognito_jwt_token';
export const STORED_TOKEN_EXPIRY = `${STORED_TOKEN_NAME}_expiry`;

export const setJwtToken = (val, expiry) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORED_TOKEN_NAME, val);
    window.localStorage.setItem(
      STORED_TOKEN_EXPIRY,
      Math.floor(Date.now() / 1000) + parseInt(expiry, 10),
    );
  }
};

export const hasValidJwtToken = () => {
  return (
    typeof window !== 'undefined' &&
    !!window.localStorage.getItem(STORED_TOKEN_NAME) &&
    !!window.localStorage.getItem(STORED_TOKEN_EXPIRY) &&
    parseInt(window.localStorage.getItem(STORED_TOKEN_EXPIRY), 10) >
      Math.floor(Date.now() / 1000)
  );
};

export const getJwtToken = () => {
  if (typeof window === 'undefined') throw new Error('Logging in during BTR? Bah!');
  if (!hasValidJwtToken()) throw new Error('token is missing or not valid');
  return window.localStorage.getItem(STORED_TOKEN_NAME);
};
