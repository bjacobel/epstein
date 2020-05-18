import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import { mount } from 'enzyme';

import Search, { SEARCH_REMARKS } from '../Search';
import SearchBox from '../../../components/SearchBox';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';
import PaginatedBrowser from '../../../components/PaginatedBrowser';

jest.mock('react-router-dom');
jest.mock('../../../components/MetaTags');
jest.mock('../../../components/SearchBox', () => jest.fn(() => null));
jest.mock('../../../components/Mini/MidiFlight', () => jest.fn(() => null));

const searchData = {
  data: {
    countFlightSearchResults: 3,
    searchRemarksForFlights: {
      edges: [{ id: 1 }, { id: 2 }, { id: 3 }],
      pageInfo: {
        count: 3,
        hasNext: false,
      },
    },
  },
};

describe('search container', () => {
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

  describe('delayed search', () => {
    it('triggers a search if routed with a param', async () => {
      const queryHandler = jest.fn().mockResolvedValue({});
      link.setRequestHandler(SEARCH_REMARKS, queryHandler);
      useParams.mockReturnValueOnce({ query: 'searchTerm' });

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(queryHandler).toHaveBeenCalledTimes(1);
    });

    it('does not search if no params', async () => {
      const queryHandler = jest.fn().mockResolvedValue({});
      link.setRequestHandler(SEARCH_REMARKS, queryHandler);
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
        onClick();
        return null;
      });

      const queryHandler = jest.fn().mockResolvedValue({});
      link.setRequestHandler(SEARCH_REMARKS, queryHandler);
      useParams.mockReturnValueOnce({});

      const wrapper = mount(
        <ApolloProvider client={client}>
          <Search />
        </ApolloProvider>,
      );

      await updateWrapper(wrapper);

      expect(queryHandler).toHaveBeenCalledTimes(1);
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

    const queryHandler = jest.fn().mockResolvedValue({});
    link.setRequestHandler(SEARCH_REMARKS, queryHandler);

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
    const queryHandler = jest.fn().mockResolvedValue(searchData);
    link.setRequestHandler(SEARCH_REMARKS, queryHandler);
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
