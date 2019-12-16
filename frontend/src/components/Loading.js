import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { spinWrap, spinner, spinText, active } from '../stylesheets/spinner.css';

export default ({ text }) => {
  const [timeoutMet, meetTimeout] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      meetTimeout(true);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={spinWrap}>
      <div className={spinner} />
      {text && (
        <span className={classNames(spinText, { [active]: timeoutMet })}>
          Hang tight!
        </span>
      )}
    </div>
  );
};
