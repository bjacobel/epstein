import React from 'react';

import Mini from './Mini';

export default ({ ids }) => (
  <>
    {ids.map(id => (
      <Mini id={id} key={id} />
    ))}
  </>
);
