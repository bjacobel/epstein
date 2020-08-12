import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import { mount } from 'enzyme';

import Search, { SEARCH_REMARKS_AND_VERIFIEDS } from '../Search';
import SearchBox from '../../../components/SearchBox';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';
import PaginatedBrowser from '../../../components/PaginatedBrowser';

jest.mock('react-router-dom');
jest.mock('../../../components/MetaTags');
jest.mock('../../../components/SearchBox', () => jest.fn(() => null));
jest.mock('../../../components/Mini/MiniFlight', () => jest.fn(() => null));
jest.mock('../../../components/Mini/MiniPassenger', () => jest.fn(() => null));

const searchData = jest.fn().mockResolvedValue({
  data: {
    countFlightSearchResults: 3,
    searchRemarksForFlights: {
      edges: [{ id: 1 }, { id: 2 }, { id: 3 }],
      pageInfo: {
        count: 3,
        hasNext: false,
      },
    },
    searchVerifiedPassengers: [
      {
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
    ],
  },
});

describe('search container', () => {
  let client, link;
  let queryHandler;

  beforeEach(() => {
    link = new MockLink();
    client = new ApolloClient({
      cache: new InMemoryCache({
        addTypename: false,
      }),
      link,
    });

    queryHandler = jest.fn().mockResolvedValue({});
    link.setRequestHandler(SEARCH_REMARKS_AND_VERIFIEDS, queryHandler);
  });

  describe('immediate search', () => {
    it('triggers a search if routed with a param', async () => {
      useParams.mockReturnValueOnce({ query: 'searchTerm' });

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(queryHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('delayed search', () => {
    it('does not search if no params', async () => {
      useParams.mockReturnValueOnce({});

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(queryHandler).not.toHaveBeenCalled();
    });

    it('triggers a search if onClick prop of searchBox is run', async () => {
      SearchBox.mockImplementationOnce(({ onClick }) => {
        onClick('something');
        return null;
      });

      useParams.mockReturnValueOnce({});

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(queryHandler).toHaveBeenCalledTimes(1);
    });

    it("won't search if there's nothing in the search field", async () => {
      SearchBox.mockImplementationOnce(({ onClick }) => {
        onClick(); // with undefined - no good
        return null;
      });

      useParams.mockReturnValueOnce({});

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(queryHandler).toHaveBeenCalledTimes(0);
    });

    it('pushes new route when search is done', async () => {
      useParams.mockReturnValueOnce({});
      const push = jest.fn();
      useHistory.mockReturnValueOnce({ push });

      SearchBox.mockImplementationOnce(({ onClick }) => (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div onClick={() => onClick('searchQuery')} />
      ));

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(queryHandler).not.toHaveBeenCalled();

      wrapper.find(SearchBox).simulate('click');
      await updateWrapper(wrapper);

      expect(queryHandler).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith({
        pathname: '/search/searchQuery',
      });
    });
  });

  it('updates pathname after search', async () => {
    const push = jest.fn();
    useHistory.mockReturnValueOnce({ push });
    useParams.mockReturnValueOnce({});
    SearchBox.mockImplementationOnce(({ onClick }) => {
      onClick('newSearchTerm');
      return null;
    });

    const wrapper = mount(
      <ApolloProvider client={client}>
        <Search />
      </ApolloProvider>,
    );

    await updateWrapper(wrapper);

    expect(push).toHaveBeenCalledWith({
      pathname: '/search/newSearchTerm',
    });
  });

  it('runs query', async () => {
    link.clearRequestHandlers();
    link.setRequestHandler(SEARCH_REMARKS_AND_VERIFIEDS, searchData);
    useParams.mockReturnValue({ query: 'searchTerm' });

    const wrapper = mount(
      <ApolloProvider client={client}>
        <Search />
      </ApolloProvider>,
    );

    await updateWrapper(wrapper);

    expect(wrapper.find(PaginatedBrowser).prop('ids')).toEqual([1, 2, 3]);
  });
});
