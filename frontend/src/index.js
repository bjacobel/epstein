import React from 'react';
import { render, hydrate } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

import App from './containers/App';
import { setup as sentrySetup } from './utils/errors';
import client from './utils/graphqlClient';

sentrySetup();

const rootEl = document.getElementById('main');
const renderInDOM = () => {
  // handle case where initial markup was build-time rendered
  const renderFn = rootEl.hasChildNodes() ? hydrate : render;
  renderFn(
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
    renderInDOM();
  });
}

renderInDOM();
