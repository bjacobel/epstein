import React from 'react';

import { SHOW_DEV_TOOLS } from '../../constants';
import { errorHeader } from './style.css';

export default ({ error }) => {
  return (
    <>
      <h3 className={errorHeader}>Something went wrong.</h3>
      {SHOW_DEV_TOOLS && error && error.stack && <pre>{error.stack}</pre>}
    </>
  );
};
