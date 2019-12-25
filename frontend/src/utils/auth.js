const storedTokenName = 'cognito_jwt_token';
const storedTokenExpiry = `${storedTokenName}_expiry`;

export const setJwtToken = (val, expiry) => {
  window.localStorage.setItem(storedTokenName, val);
  window.localStorage.setItem(
    storedTokenExpiry,
    Math.floor(Date.now() / 1000) + parseInt(expiry, 10),
  );
};

export const hasValidJwtToken = () => {
  return (
    !!window.localStorage.getItem(storedTokenName) &&
    !!window.localStorage.getItem(storedTokenExpiry) &&
    parseInt(window.localStorage.getItem(storedTokenExpiry), 10) >
      Math.floor(Date.now() / 1000)
  );
};

export const getJwtToken = () => {
  if (!hasValidJwtToken()) throw new Error('token is missing or not valid');
  return window.localStorage.getItem(storedTokenName);
};
