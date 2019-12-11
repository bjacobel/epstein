import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';

import Routes from './components/Routes';
import { setup as sentrySetup } from './utils/errors';
import client from './utils/graphqlClient';

sentrySetup();

const rootEl = document.getElementById('main');
const render = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>,
    rootEl,
  );
};

if (module.hot) {
  module.hot.accept('./components/Routes', () => {
    render();
  });
}

render();
