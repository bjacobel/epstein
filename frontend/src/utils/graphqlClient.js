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

class GraphQLError extends ExtendableError {}

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(err =>
      logErr(new GraphQLError(err.message), {
        errorType: err.errorType,
        query: err.path && err.path.length ? err.path.join('.') : undefined,
        source: 'graphql',
        response,
      }),
    );
  }
  if (networkError) logErr(networkError, { source: 'apollo-link-http', response });
});

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
