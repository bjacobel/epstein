import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import Flight, { describePassengers, FLIGHT } from '../Flight';
import { passengers } from '../style.css';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';

jest.mock('../../../components/MetaTags', () => () => null);
jest.mock('react-router-dom');
jest.mock('../../../components/Map', () => () => 'Map goes here');

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

        expect(wrapper.find(Flight)).toMatchSnapshot();
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
        const passList = wrapper.find(`.${passengers} > ul > li`);

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
    });
  });
});
