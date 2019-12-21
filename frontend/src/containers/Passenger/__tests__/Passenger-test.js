import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import Passenger, { PASSENGER } from '../Passenger';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';

const passengerData = {
  data: {
    passenger: {
      id: 1,
      name: 'Bill Clinton',
      biography: 'prez',
      wikipedia_link: 'wikipedia dot com',
      image: 'jpeg',
      flightCount: 26,
      flights: { edges: [], pageInfo: { count: 10, hasNext: true } },
    },
  },
};

describe('passenger details container', () => {
  let client, link;

  beforeEach(() => {
    link = new MockLink();
    client = new ApolloClient({
      cache: new InMemoryCache({
        addTypename: false,
      }),
      link,
    });
  });

  it('queries by slug from params', async () => {
    const queryHandler = jest.fn(() => new Promise(() => {}));
    link.setRequestHandler(PASSENGER, queryHandler);
    const slug = 'bill-clinton';
    const wrapper = mount(
      <ApolloProvider client={client}>
        <Passenger match={{ params: { slug } }} />
      </ApolloProvider>,
    );
    await updateWrapper(wrapper);

    expect(queryHandler).lastCalledWith(expect.objectContaining({ slug }));
  });

  it('renders spinner before gql loads', async () => {
    const queryHandler = jest.fn(() => new Promise(() => {}));
    link.setRequestHandler(PASSENGER, queryHandler);

    const wrapper = mount(
      <ApolloProvider client={client}>
        <Passenger match={{ params: { slug: 'bill-clinton' } }} />
      </ApolloProvider>,
    );

    await updateWrapper(wrapper);

    expect(wrapper.find(Passenger)).toMatchSnapshot();
  });

  it('matches snapshot with data resolution', async () => {
    const queryHandler = jest.fn().mockResolvedValue(passengerData);
    link.setRequestHandler(PASSENGER, queryHandler);
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
