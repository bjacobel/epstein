import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import Passenger, { PASSENGER, range } from '../Passenger';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';

jest.mock('../../../components/MetaTags');

const passengerData = {
  data: {
    passenger: {
      id: 1,
      slug: 'bill-clinton',
      name: 'Bill Clinton',
      biography: 'prez',
      wikipedia_link: 'wikipedia dot com',
      image: 'jpeg',
      flightCount: 26,
      histogram: [
        { month: '2002-02-01', count: 2 },
        { month: '2002-03-01', count: 4 },
      ],
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

  describe('range', () => {
    it('omits the first year if the range is all the same year', () => {
      expect(
        range([
          { month: '2002-02-01', count: 1 },
          { month: '2002-04-01', count: 1 },
        ]),
      ).toMatchInlineSnapshot(`"between February and April 2002"`);
    });

    it('omits the second date if there was only one flight month', () => {
      expect(range([{ month: '2002-02-01', count: 1 }])).toMatchInlineSnapshot(
        `"in February 2002"`,
      );
    });

    it('formats both dates if there is a real range', () => {
      expect(
        range([
          { month: '2002-02-01', count: 1 },
          { month: '2002-04-01', count: 1 },
          { month: '2002-08-01', count: 1 },
          { month: '2003-01-01', count: 1 },
          { month: '2003-02-01', count: 1 },
        ]),
      ).toMatchInlineSnapshot(`"between February 2002 and February 2003"`);
    });
  });
});
