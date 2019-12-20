const apollo = jest.requireActual('@apollo/client');
const { MockLink } = require('mock-apollo-client/dist/mockLink');

module.exports = () => {
  const mockLink = new MockLink();
  const client = new apollo.ApolloClient({
    cache: new apollo.InMemoryCache({
      addTypename: false,
    }),
    link: mockLink,
  });

  client.setRequestHandler = mockLink.setRequestHandler.bind(mockLink);

  return client;
};
