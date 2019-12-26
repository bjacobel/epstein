import React from 'react';

import PassengerAdmin from './PassengerAdmin';
import ErrorBoundary from '../../components/ErrorBoundary';

export default () => (
  <ErrorBoundary>
    <PassengerAdmin />
  </ErrorBoundary>
);
