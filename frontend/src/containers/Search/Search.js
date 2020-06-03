import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import { HashLink } from 'react-router-hash-link';

import MetaTags from '../../components/MetaTags';
import PaginatedBrowser from '../../components/PaginatedBrowser';
import MiniFlight from '../../components/Mini/MiniFlight';
import Loading from '../../components/Loading';
import SearchBox from '../../components/SearchBox';
import { FLIGHT_LIMIT } from '../../constants';
import { container, remarkResultsHeader, searchControl } from './style.css';
import { link } from '../../stylesheets/shared.css';

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

export const SEARCH_VERIFIEDS = gql`
  query Search($query: String!) {
    searchVerifiedPassengers(query: $query) {
      id
    }
  }
`;

export default () => {
  const { query: urlEncodedQuery } = useParams() || {};
  const query = urlEncodedQuery ? decodeURIComponent(urlEncodedQuery) : undefined;
  const history = useHistory();

  // if query is defined, instantly kick off search - else wait for doSearch
  const [
    executeRemarksQuery,
    { data: remarksData, loading: remarksLoading, error: remarksError, fetchMore },
  ] = useLazyQuery(SEARCH_REMARKS, {
    variables: { query, limit: FLIGHT_LIMIT },
  });
  const [
    executeVerifiedsQuery,
    { data: verifiedsData, loading: verifiedsLoading, error: verifiedsError },
  ] = useLazyQuery(SEARCH_VERIFIEDS, {
    variables: { query },
  });

  useEffect(() => {
    if (query) {
      executeRemarksQuery();
      executeVerifiedsQuery();
    }
  }, [query]);

  const doSearch = searchQuery => {
    executeRemarksQuery();
    executeVerifiedsQuery();

    // Update URL with search query
    history.push({
      pathname: `/search/${searchQuery}`,
    });
  };

  if (remarksLoading || verifiedsLoading) return <Loading text />;
  if (remarksError) throw remarksError;
  if (verifiedsError) throw verifiedsError;

  return (
    <div className={container}>
      <MetaTags title={query ? `Search Results: '${query}'` : 'Search'} />
      <div className={searchControl}>
        <SearchBox initialValue={query} onClick={doSearch} />
      </div>
      {verifiedsData && <pre>{JSON.stringify(verifiedsData, null, 2)}</pre>}
      {remarksData && (
        <>
          <p className={remarkResultsHeader}>
            <span>{remarksData.countFlightSearchResults}</span>
            <span> matches for &#8220;</span>
            <span>{query}</span>
            <span>&#8221; found in the </span>
            <span>
              <HashLink
                to="/about#why-are-some-entries-not-linked-to-an-identified-passenger"
                className={link}
              >
                raw flight logs
              </HashLink>
            </span>
          </p>
          {remarksData.countFlightSearchResults > 0 && (
            <PaginatedBrowser
              browserComponent={MiniFlight}
              passProps={{ fullManifest: true }}
              ids={remarksData.searchRemarksForFlights.edges.map(x => x.id)}
              totalAvailable={remarksData.countFlightSearchResults}
              pageSize={FLIGHT_LIMIT}
              fetchMore={() =>
                fetchMore({
                  variables: {
                    offset: remarksData.searchRemarksForFlights.edges.length,
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
