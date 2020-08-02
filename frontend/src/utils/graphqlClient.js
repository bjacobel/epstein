import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { onError } from 'apollo-link-error';
import ExtendableError from 'extendable-error';

import { getJwtToken, hasValidJwtToken } from './auth';
import logErr from './errors';
import { BACKEND_URL, BACKEND_UNCACHED_URL, SHOW_DEV_TOOLS } from '../constants';

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  useGETForQueries: true,
});

export class GraphQLError extends ExtendableError {}

export const errorLink = onError(
  ({ operation, graphQLErrors, networkError, response }) => {
    (graphQLErrors || []).forEach(err => {
      // Ignore NotFoundError
      if (err.errorType === 'NotFound') {
        response.errors = undefined;
      } else {
        logErr(
          new GraphQLError(err.message),
          {
            errorType: err.errorType,
            query: err.path && err.path.length ? err.path.join('.') : undefined,
            response,
          },
          {
            operationName: operation.operationName,
            source: 'graphql',
          },
        );
      }
    });
    if (networkError) {
      logErr(networkError, undefined, {
        operationName: operation.operationName,
        source: 'apollo-link-http',
      });
    }
  },
);

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, httpLink]),
  connectToDevTools: SHOW_DEV_TOOLS && !hasValidJwtToken(),
});

const authedFetch = (uri, options) => {
  return fetch(uri, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: getJwtToken(),
    },
  });
};

export const AdminClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    errorLink,
    new HttpLink({
      uri: BACKEND_UNCACHED_URL,
      fetch: authedFetch,
    }),
  ]),
  connectToDevTools: SHOW_DEV_TOOLS && hasValidJwtToken(),
});
