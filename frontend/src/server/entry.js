import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import ssrPrepass from 'react-ssr-prepass';
import nodeFetch from 'node-fetch';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

import App from '../containers/App';
import { BACKEND_URL } from '../constants';

export default async params => {
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: BACKEND_URL,
      useGETForQueries: true,
      fetch: nodeFetch,
    }),
  });

  const app = (
    <ApolloProvider client={client}>
      <StaticRouter location={params.url}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  );

  await ssrPrepass(app, (_element, instance) => {
    console.log(instance);
    if (instance !== undefined && typeof instance.fetchData === 'function') {
      return instance.fetchData();
    }
    return undefined;
  });

  const initialState = client.extract();
  return `
    ${renderToString(app)}
    <script>window.__APOLLO_STATE__ = ${JSON.stringify(initialState).replace(
      /</g,
      '\\u003c',
    )};</script>
  `;
};
