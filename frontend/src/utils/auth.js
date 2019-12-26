export const STORED_TOKEN_NAME = 'cognito_jwt_token';
export const STORED_TOKEN_EXPIRY = `${STORED_TOKEN_NAME}_expiry`;

export const setJwtToken = (val, expiry) => {
  window.localStorage.setItem(STORED_TOKEN_NAME, val);
  window.localStorage.setItem(
    STORED_TOKEN_EXPIRY,
    Math.floor(Date.now() / 1000) + parseInt(expiry, 10),
  );
};

export const hasValidJwtToken = () => {
  return (
    !!window.localStorage.getItem(STORED_TOKEN_NAME) &&
    !!window.localStorage.getItem(STORED_TOKEN_EXPIRY) &&
    parseInt(window.localStorage.getItem(STORED_TOKEN_EXPIRY), 10) >
      Math.floor(Date.now() / 1000)
  );
};

export const getJwtToken = () => {
  if (!hasValidJwtToken()) throw new Error('token is missing or not valid');
  return window.localStorage.getItem(STORED_TOKEN_NAME);
};
