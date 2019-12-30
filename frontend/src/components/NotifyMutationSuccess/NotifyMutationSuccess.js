import React from 'react';

import { mutationSuccess, notification } from './style.css';

export default ({ data }) => (
  <div className={mutationSuccess}>
    <h4 className={notification}>mutation success</h4>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);
