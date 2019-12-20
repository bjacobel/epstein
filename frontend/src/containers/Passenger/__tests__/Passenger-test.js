import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { mount } from 'enzyme';

import Passenger, { PASSENGER } from '../Passenger';
import createMockClient from '../../../utils/createMockClient';
import updateWrapper from '../../../utils/updateWrapper';

const passengerData = {
  passenger: {
    id: 1,
  },
};

describe('passenger details container', () => {
  let client;
  let queryHandler;

  beforeEach(() => {
    queryHandler = jest.fn().mockResolvedValue(passengerData);
    client = createMockClient(PASSENGER, queryHandler);
  });

  fit('queries by slug from params', async () => {
    const wrapper = mount(
      <ApolloProvider client={client}>
        <Passenger match={{ params: { slug: 'bill-clinton' } }} />
      </ApolloProvider>,
    );
    await updateWrapper(wrapper);

    console.log(client.link.requestHandlers);

    expect(queryHandler).lastCalledWith({ variables: {} });
  });

  it('renders spinner before gql loads', async () => {
    queryHandler = jest.fn(() => new Promise());
    client = createMockClient(PASSENGER, queryHandler);

    console.log(client.link.requestHandlers);

    const wrapper = mount(
      <ApolloProvider client={client}>
        <Passenger match={{ params: { slug: 'bill-clinton' } }} />
      </ApolloProvider>,
    );

    await updateWrapper(wrapper);

    expect(wrapper.find(Passenger)).toMatchSnapshot();
  });

  it('matches snapshot', async () => {
    const wrapper = mount(
      <ApolloProvider client={client}>
        <Passenger match={{ params: { slug: 'bill-clinton' } }} />
      </ApolloProvider>,
    );

    await updateWrapper(wrapper);

    expect(wrapper.find(Passenger)).toMatchSnapshot();
  });

  describe('pagination', () => {});
});
