import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';
import MiniPassenger, { PASSENGER } from '../MiniPassenger';

const data = {
  passenger: {
    id: 1,
    slug: 'bill-clinton',
    name: 'Bill Clinton',
    biography: 'prez',
    flightCount: 26,
    histogram: [
      { month: '2002-02-01', count: 2 },
      { month: '2002-03-01', count: 4 },
    ],
  },
};

describe('MiniPassenger', () => {
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

  it('matches snapshot', async () => {
    const queryHandler = jest.fn().mockResolvedValue({ data });
    link.setRequestHandler(PASSENGER, queryHandler);

    const wrapper = mount(
      <ApolloProvider client={client}>
        <MiniPassenger slug="bill-clinton" />
      </ApolloProvider>,
    );
    await updateWrapper(wrapper);

    expect(wrapper.find(MiniPassenger)).toMatchSnapshot();
  });
});
