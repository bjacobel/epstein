import React from 'react';

import { mutationSuccess } from './style.css';

export default ({ data }) => (
  <div className={mutationSuccess}>
    <h3>mutation success</h3>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);
