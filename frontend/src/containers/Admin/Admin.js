import React from 'react';
import { ApolloProvider } from '@apollo/client';

import { AdminClient } from '../../utils/graphqlClient';
import PassengerAdmin from './PassengerAdmin';
import ErrorBoundary from '../../components/ErrorBoundary';

export default () => (
  <ApolloProvider client={AdminClient}>
    <ErrorBoundary>
      <PassengerAdmin />
    </ErrorBoundary>
  </ApolloProvider>
);
