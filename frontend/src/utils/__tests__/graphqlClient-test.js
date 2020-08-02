import { ApolloLink, ApolloClient, InMemoryCache, gql, Observable } from '@apollo/client';
import { onError } from 'apollo-link-error';

import { errorLink, GraphQLError } from '../graphqlClient';
import MockLink from '../testing/MockLink';
import logErr from '../errors';

jest.mock('../errors');

const query = gql`
  query testQuery {
    test
  }
`;

// eslint-disable-next-line consistent-return
const errorSwallower = onError(({ response }) => {
  if (!response) return Observable.of({});
  response.errors = undefined;
});

describe('graphQL client', () => {
  describe('error link', () => {
    let client, link;
    beforeEach(() => {
      logErr.mockReset();
      link = new MockLink();
      client = new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([errorSwallower, errorLink, link]),
      });
    });

    it('does not trigger any logs for a sucessful query', async () => {
      const queryHandler = jest.fn().mockResolvedValue({ data: { test: true } });
      link.setRequestHandler(query, queryHandler);
      await client.query({ query });
      expect(logErr).not.toHaveBeenCalled();
    });

    it('ignores NotFoundErrors', async () => {
      const queryHandler = jest
        .fn()
        .mockResolvedValue({ data: {}, errors: [{ errorType: 'NotFound' }] });
      link.setRequestHandler(query, queryHandler);
      await client.query({ query });
      expect(logErr).not.toHaveBeenCalled();
    });

    it('logs GraphQLErrors', async () => {
      const queryHandler = jest.fn().mockResolvedValue({
        data: {},
        errors: [
          {
            errorType: 'GraphQLError',
            message: "Variable 'query' has coerced Null value for NonNull type 'String!'",
          },
        ],
      });
      link.setRequestHandler(query, queryHandler);
      await client.query({ query });
      expect(logErr).toHaveBeenCalledWith(
        expect.any(GraphQLError),
        {
          errorType: 'GraphQLError',
          query: undefined,
          response: { data: {}, errors: undefined },
        },
        { operationName: 'testQuery', source: 'graphql' },
      );
    });

    it('logs network errors to sentry', async () => {
      const queryHandler = jest.fn().mockRejectedValue({
        status: 500,
      });
      link.setRequestHandler(query, queryHandler);
      await client.query({ query });
      expect(logErr).toHaveBeenCalledWith({ status: 500 }, undefined, {
        operationName: 'testQuery',
        source: 'apollo-link-http',
      });
    });
  });
});
