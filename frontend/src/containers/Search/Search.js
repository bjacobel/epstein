import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import MetaTags from '../../components/MetaTags';
import PaginatedBrowser from '../../components/PaginatedBrowser';
import MiniFlight from '../../components/Mini/MiniFlight';
import Loading from '../../components/Loading';
import SearchBox from '../../components/SearchBox';
import { FLIGHT_LIMIT } from '../../constants';

export const SEARCH = gql`
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
  const { data, loading, error, refetch, fetchMore } = useQuery(SEARCH, {
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

  if (loading) return <Loading text />;
  if (error) throw error;

  return (
    <>
      <MetaTags title={query ? `Search Results: '${query}'` : 'Search'} />
      <SearchBox initialValue={query} onClick={doSearch} />
      {data && (
        <PaginatedBrowser
          browserComponent={MiniFlight}
          ids={data.searchRemarksForFlights.edges.map(x => x.id)}
          totalAvailable={data.countFlightSearchResults}
          pageSize={FLIGHT_LIMIT}
          fetchMore={() =>
            fetchMore({
              variables: { offset: data.searchRemarksForFlights.edges.length + 1 },
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
  );
};
