import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

import App from './containers/App';
import { setup as sentrySetup } from './utils/errors';
import client from './utils/graphqlClient';

sentrySetup();

const rootEl = document.getElementById('main');
const render = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>,
    rootEl,
  );
};

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render();
  });
}

render();
