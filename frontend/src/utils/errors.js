import { init, captureException, configureScope } from '@sentry/browser';

import { LOG_ERRORS, RAVEN_ENDPT, RELEASE, IGNORED_ERRORS } from '../constants';

export const setup = () => {
  if (LOG_ERRORS) {
    /* eslint-disable no-underscore-dangle */
    if (typeof window !== 'undefined' && !window.__SENTRY_READY__) {
      init({ dsn: RAVEN_ENDPT, release: RELEASE, ignoreErrors: IGNORED_ERRORS });
      window.__SENTRY_READY__ = true;
    }
    /* eslint-enable no-underscore-dangle */
  }
};

export default (ex, context) => {
  if (LOG_ERRORS) {
    setup(); // memoized, it is fine to call this on every log

    if (context) {
      configureScope(scope => scope.setExtra('context', context));
    }

    captureException(ex);
  }

  return (
    typeof window !== 'undefined' && window.console && console.error && console.error(ex)
  );
};
