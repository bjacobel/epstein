import React from 'react';

import PassengerSelect from './PassengerSelect';
import ErrorBoundary from '../../components/ErrorBoundary';
import { adminConsole } from './style.css';

export default () => (
  <ErrorBoundary>
    <div className={adminConsole}>
      <PassengerSelect />
    </div>
  </ErrorBoundary>
);
