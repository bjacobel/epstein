import React from 'react';
import { Redirect } from 'react-router-dom';

import { setJwtToken, hasValidJwtToken } from '../../utils/auth';
import { COGNITO_LOGIN_FORM } from '../../constants';
import { loginLink } from './style.css';

export default ({ history }) => {
  // if a hash is set, we're finishing an auth redirect. store it in cookies and clear it
  if (window.location.hash && window.location.hash.length) {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (!hash.has('access_token')) {
      return <span>Error: Redirect uri should include an access_token</span>;
    }
    const token = hash.get('access_token');
    const expiry = hash.get('expires_in');
    setJwtToken(token, expiry);
    history.replace({
      ...window.location,
      hash: undefined,
      href: `${window.location.origin}${window.location.pathname}`,
    });
  }

  // if a cookie is set and it passes validation, we're authorized. redirect to the admin console
  if (hasValidJwtToken()) {
    return <Redirect to="/admin" />;
  }

  // if no valid cookie, we need to do a login, so redirect to the cognito hosted ui
  return (
    <a className={loginLink} href={COGNITO_LOGIN_FORM}>
      Login to the admin console
    </a>
  );
};
