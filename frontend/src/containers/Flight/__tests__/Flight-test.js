import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import Flight, { describePassengers, airfieldHandler, FLIGHT } from '../Flight';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';

jest.mock('../../../components/MetaTags');
jest.mock('react-router-dom');
jest.mock('../../../components/Map', () => () => 'Map goes here');
jest.mock('../../../components/ErrorBoundary/ErrorComponent');

const airfieldData = {
  name: 'Luton',
  iata_code: 'LTN',
  latitude_deg: 100.01,
  longitude_deg: 50.05,
  municipality: 'London',
  iso_country: 'GB',
  __typename: 'Airfield',
};

const flightData = {
  data: {
    flight: {
      id: 100,
      distance: 937482.837,
      date: '2002-09-01',
      page: 'https://files.epstein.flights/page-09.png',
      passengers: {
        edges: [
          {
            __typename: 'VerifiedPassenger',
            name: 'Bill Clinton',
            slug: 'bill-clinton',
          },
          {
            __typename: 'LiteralPassenger',
            literal: 'ABC',
          },
        ],
      },
      aircraft: {
        id: 'uuid',
        model: 'G-1159B',
        tailsign: 'N909JE',
      },
      source: {
        ...airfieldData,
      },
      destination: {
        ...airfieldData,
      },
    },
  },
};

const errorData = [
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

const networkError = [
  { graphQLErrors: [], networkError: {}, message: 'Network error: Failed to fetch' },
];

describe('Flight page container', () => {
  describe('describePassengers function', () => {
    it('displays correctly when no passengers are canonical', () => {
      expect(
        describePassengers([{ literal: 'A' }, { literal: 'B' }]),
      ).toMatchInlineSnapshot(`"2 passengers were listed on the manifest"`);
    });

    it('displays correctly when one passenger is canonical', () => {
      expect(
        describePassengers([{ literal: 'A' }, { name: 'Mr. B' }]),
      ).toMatchInlineSnapshot(
        `"2 passengers were listed on the manifest, including Mr. B"`,
      );
    });

    it('displays correctly when two passengers are canonical', () => {
      expect(
        describePassengers([
          { literal: 'A' },
          { literal: 'B', name: 'Mr. B' },
          { literal: 'C', name: 'Mrs. C' },
        ]),
      ).toMatchInlineSnapshot(
        `"3 passengers were listed on the manifest, including Mr. B and Mrs. C"`,
      );
    });

    it('displays correctly when three passengers are canonical', () => {
      expect(
        describePassengers([
          { literal: 'A' },
          { literal: 'B', name: 'Mr. B' },
          { literal: 'C', name: 'Mrs. C' },
          { literal: 'D', name: 'Dr. D' },
        ]),
      ).toMatchInlineSnapshot(
        `"4 passengers were listed on the manifest, including Mr. B, Mrs. C and Dr. D"`,
      );
    });
  });

  describe('airfieldHandler', () => {
    it('handles a RDS error gracefully', () => {
      expect(() =>
        airfieldHandler(undefined, { graphQLErrors: [{ message: 'RDSHttp:{}' }] }),
      ).not.toThrow();
    });
  });

  describe('details rendering', () => {
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

    it('renders spinner while query is loading', async () => {
      const queryHandler = jest.fn(() => new Promise(() => {}));
      link.setRequestHandler(FLIGHT, queryHandler);

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Flight match={{ params: { id: 65 } }} />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(wrapper.find(Flight)).toMatchSnapshot();
    });

    it('does not error when a NotFound error occurs during airfield fetch', async () => {
      const flightDataWithError = {
        data: {
          flight: { ...flightData.data.flight, destination: null },
        },
        errors: errorData,
      };
      const queryHandler = jest.fn().mockResolvedValue(flightDataWithError);
      link.setRequestHandler(FLIGHT, queryHandler);

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Flight match={{ params: { id: 65 } }} />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      const text = wrapper.find(Flight).text();
      expect(text).not.toMatch('distance');
      expect(text).toMatch('GVAL (unknown airport)');
    });

    it('does not error when a non-nullable error occurs during airfield fetch', async () => {
      const flightDataWithError = {
        data: {
          flight: { ...flightData.data.flight, source: null },
        },
        errors: [
          {
            path: ['flight', 'source', 'municipality'],
            locations: null,
            message:
              "Cannot return null for non-nullable type: 'String' within parent 'Airfield' (/flight/source/municipality)",
          },
        ],
      };
      const queryHandler = jest.fn().mockResolvedValue(flightDataWithError);
      link.setRequestHandler(FLIGHT, queryHandler);

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Flight match={{ params: { id: 67 } }} />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(wrapper.find(Flight).text()).toMatch('??? (unknown airport)');
    });

    describe('passengers listing', () => {
      it('matches snapshot', async () => {
        const queryHandler = jest.fn().mockResolvedValue(flightData);
        link.setRequestHandler(FLIGHT, queryHandler);

        const wrapper = mount(
          <ApolloProvider client={client}>
            <Flight match={{ params: { id: 65 } }} />
          </ApolloProvider>,
        );

        await updateWrapper(wrapper);

        expect(wrapper.find(Flight).find('.passengers')).toMatchSnapshot();
      });

      it('separates LiteralPassengers and VerifiedPassengers', async () => {
        const queryHandler = jest.fn().mockResolvedValue(flightData);
        link.setRequestHandler(FLIGHT, queryHandler);

        const wrapper = mount(
          <ApolloProvider client={client}>
            <Flight match={{ params: { id: 65 } }} />
          </ApolloProvider>,
        );

        await updateWrapper(wrapper);
        const passList = wrapper.find('.passengers > ul > li');

        expect(passList).toMatchInlineSnapshot(`
          Array [
            <li
              key="bill-clinton"
            >
              <Link
                className="link"
                to="/passenger/bill-clinton"
              >
                <a
                  href="/passenger/bill-clinton"
                >
                  Bill Clinton
                </a>
              </Link>
            </li>,
            <li
              className="noslug"
              key="ABC"
            >
              <span>
                “ABC”
              </span>
            </li>,
          ]
        `);
      });

      it("doesn't show literal explanation if they don't exist", async () => {
        const flightWithOnlyVerified = {
          data: {
            flight: {
              ...flightData.data.flight,
              passengers: {
                edges: flightData.data.flight.passengers.edges.filter(
                  // eslint-disable-next-line no-underscore-dangle
                  x => x.__typename === 'VerifiedPassenger',
                ),
              },
            },
          },
        };

        const queryHandler = jest.fn().mockResolvedValue(flightWithOnlyVerified);
        link.setRequestHandler(FLIGHT, queryHandler);

        const wrapper = mount(
          <ApolloProvider client={client}>
            <Flight match={{ params: { id: 65 } }} />
          </ApolloProvider>,
        );

        await updateWrapper(wrapper);
        const passList = wrapper.find('.passengers');

        expect(passList.text()).not.toMatch('not been linked to an identified passenger');
      });
    });

    describe('when encountering network error', () => {
      it('does not error out the component', async () => {
        const queryHandler = jest.fn(() =>
          Promise.resolve({ data: {}, errors: networkError }),
        );
        link.setRequestHandler(FLIGHT, queryHandler);
        const wrapper = mount(
          <ApolloProvider client={client}>
            <Flight match={{ params: { id: 205 } }} />
          </ApolloProvider>,
        );
        await updateWrapper(wrapper);
        expect(wrapper.find(Flight)).toMatchSnapshot();
      });
    });
  });
});
