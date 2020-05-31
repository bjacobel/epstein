import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';
import MiniFlight, { FLIGHT } from '../MiniFlight';

const data = {
  flight: {
    id: 206,
    date: '2003-04-06',
    source: {
      iata_code: 'GRU',
    },
    destination: {
      iata_code: 'LBG',
    },
    passengers: {
      pageInfo: {
        count: 5,
      },
    },
  },
};

const fullPassengers = {
  edges: [
    {
      name: 'Jeffrey Epstein',
      slug: 'jeffrey-epstein',
      __typename: 'VerifiedPassenger',
    },
    {
      name: 'Ghislane Maxwell',
      slug: 'ghislane-maxwell',
      __typename: 'VerifiedPassenger',
    },
    {
      name: 'Sean Koo',
      slug: 'sean-koo',
      __typename: 'VerifiedPassenger',
    },
    {
      name: 'Jean-Luc Brunel',
      slug: 'jean-luc-brunel',
      __typename: 'VerifiedPassenger',
    },
    {
      literal: 'MAGALE BLACHOU',
      __typename: 'LiteralPassenger',
    },
  ],
};

const errors = [
  {
    path: ['flight', 'destination'],
    data: {
      iata_code: null,
    },
    errorType: 'NotFound',
    errorInfo: {
      query: 'GVAL',
    },
    locations: [
      {
        line: 8,
        column: 5,
        sourceName: null,
      },
    ],
    message: "Couldn't find Airfield with IATA, GPS or ident code GVAL",
  },
];

describe('MiniFlight viewer', () => {
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

  describe('standard mode', () => {
    beforeEach(() => {
      const queryHandler = jest.fn(() => Promise.resolve({ data }));
      link.setRequestHandler(FLIGHT, queryHandler);
    });

    it('matches snapshot', async () => {
      const wrapper = mount(
        <ApolloProvider client={client}>
          <MiniFlight id={205} />
        </ApolloProvider>,
      );
      await updateWrapper(wrapper);
      expect(wrapper.find(MiniFlight)).toMatchSnapshot();
    });
  });

  describe('search results mode', () => {
    beforeEach(() => {
      const enrichedData = { ...data };
      Object.assign(enrichedData.flight.passengers, fullPassengers);
      const queryHandler = jest.fn(() => Promise.resolve({ data: enrichedData }));
      link.setRequestHandler(FLIGHT, queryHandler);
    });

    it('matches snapshot', async () => {
      const wrapper = mount(
        <ApolloProvider client={client}>
          <MiniFlight id={205} fullManifest />
        </ApolloProvider>,
      );
      await updateWrapper(wrapper);
      expect(wrapper.find(MiniFlight)).toMatchSnapshot();
    });
  });

  describe('when destination airport code is not found', () => {
    beforeEach(() => {
      const errData = { ...data };
      errData.flight.destination = null;
      const queryHandler = jest.fn(() => Promise.resolve({ data: errData, errors }));
      link.setRequestHandler(FLIGHT, queryHandler);
    });

    it('renders fallback for that location', async () => {
      const wrapper = mount(
        <ApolloProvider client={client}>
          <MiniFlight id={205} />
        </ApolloProvider>,
      );
      await updateWrapper(wrapper);
      expect(
        wrapper
          .find('.row')
          .at(1)
          .text(),
      ).toEqual('GRU to GVAL');
    });
  });
});
