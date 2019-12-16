import React, { useState } from 'react';
import classNames from 'classnames';

import Mini from './Mini';
import Loading from '../Loading';
import { hidden } from '../../stylesheets/shared.css';

export default ({ ids }) => {
  const [doneMap, setDone] = useState(
    ids.reduce((prev, curr) => ({ ...prev, [curr]: false }), {}),
  );
  const allDone = Object.values(doneMap).every(x => !!x);

  return (
    <>
      <div className={classNames({ [hidden]: allDone })}>
        <Loading />
      </div>
      <div className={classNames({ [hidden]: !allDone })}>
        {ids.map(id => (
          <Mini id={id} key={id} done={() => setDone(id)} />
        ))}
      </div>
    </>
  );
};
