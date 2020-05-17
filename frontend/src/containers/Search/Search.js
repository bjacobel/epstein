import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import MetaTags from '../../components/MetaTags';
import PaginatedBrowser from '../../components/PaginatedBrowser';
import MiniFlight from '../../components/Mini/MiniFlight';
import Loading from '../../components/Loading';
import SearchBox from '../../components/SearchBox';
import { FLIGHT_LIMIT } from '../../constants';
import { container, remarkResultsHeader, searchControl } from './style.css';

export const SEARCH_REMARKS = gql`
  query Search($query: String!, $offset: Int, $limit: Int!) {
    countFlightSearchResults(query: $query)
    searchRemarksForFlights(query: $query, offset: $offset, limit: $limit) {
      edges {
        id
      }
      pageInfo {
        count
        hasNext
      }
    }
  }
`;

export default () => {
  const { query } = useParams() || {};
  const history = useHistory();

  // if query is defined, instantly kick off search - else wait for doSearch
  const {
    data: remarksData,
    loading: remarksLoading,
    error: remarksError,
    refetch,
    fetchMore,
  } = useQuery(SEARCH_REMARKS, {
    skip: !query || query.length < 1,
    variables: { query, limit: FLIGHT_LIMIT },
  });

  const doSearch = searchQuery => {
    refetch();

    // Update URL with search query
    history.push({
      pathname: `/search/${searchQuery}`,
    });
  };

  if (remarksLoading) return <Loading text />;
  if (remarksError) throw remarksError;

  return (
    <div className={container}>
      <MetaTags title={query ? `Search Results: '${query}'` : 'Search'} />
      <div className={searchControl}>
        <SearchBox initialValue={query} onClick={doSearch} />
      </div>
      {remarksData && (
        <>
          <p className={remarkResultsHeader}>
            <span>{remarksData.countFlightSearchResults}</span>
            <span> matches for &#8220;</span>
            <span>{query}</span>
            <span>&#8221; found in the raw flight logs</span>
          </p>
          {remarksData.countFlightSearchResults > 0 && (
            <PaginatedBrowser
              browserComponent={MiniFlight}
              ids={remarksData.searchRemarksForFlights.edges.map(x => x.id)}
              totalAvailable={remarksData.countFlightSearchResults}
              pageSize={FLIGHT_LIMIT}
              fetchMore={() =>
                fetchMore({
                  variables: {
                    offset: remarksData.searchRemarksForFlights.edges.length + 1,
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                      countFlightSearchResults: prev.countFlightSearchResults,
                      searchRemarksForFlights: {
                        ...prev.searchRemarksForFlights,
                        pageInfo: {
                          ...fetchMoreResult.searchRemarksForFlights.pageInfo,
                          count:
                            prev.searchRemarksForFlights.pageInfo.count +
                            fetchMoreResult.searchRemarksForFlights.pageInfo.count,
                        },
                        edges: [
                          ...prev.searchRemarksForFlights.edges,
                          ...fetchMoreResult.searchRemarksForFlights.edges,
                        ],
                      },
                    };
                  },
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
};
