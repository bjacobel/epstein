import { ApolloLink } from '@apollo/client';
import { removeClientSetsFromDocument } from '@apollo/client/utilities';
import { Observable } from '@apollo/client/utilities/observables/Observable';
import { print } from 'graphql/language/printer';

function requestToKey(requestQuery) {
  const query = removeClientSetsFromDocument(requestQuery);
  const queryString = query && print(query);
  const requestKey = { query: queryString };
  return JSON.stringify(requestKey);
}

function isPromise(maybePromise) {
  return maybePromise && typeof maybePromise.then === 'function';
}

export default class MockLink extends ApolloLink {
  constructor() {
    super();
    this.requestHandlers = {};
  }

  setRequestHandler(requestQuery, handler) {
    const key = requestToKey(requestQuery);

    if (this.requestHandlers[key]) {
      throw new Error(
        `Request handler already defined for query: ${print(requestQuery)}`,
      );
    }

    this.requestHandlers[key] = handler;
  }

  clearRequestHandlers() {
    this.requestHandlers = {};
  }

  request(operation) {
    const key = requestToKey(operation.query);

    const handler = this.requestHandlers[key];

    if (!handler) {
      throw new Error(`Request handler not defined for query: ${print(operation.query)}`);
    }

    let resultPromise;

    try {
      resultPromise = handler(operation.variables);
    } catch (error) {
      throw new Error(
        `Unexpected error whilst calling request handler: ${error.message}`,
      );
    }

    if (!isPromise(resultPromise)) {
      throw new Error(
        `Request handler must return a promise. Received '${typeof resultPromise}'.`,
      );
    }

    return new Observable(observer => {
      resultPromise
        .then(result => {
          observer.next(result);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
