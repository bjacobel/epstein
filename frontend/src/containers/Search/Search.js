import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import { HashLink } from 'react-router-hash-link';

import MetaTags from '../../components/MetaTags';
import PaginatedBrowser from '../../components/PaginatedBrowser';
import MiniFlight from '../../components/Mini/MiniFlight';
import MiniPassenger from '../../components/Mini/MiniPassenger';
import Loading from '../../components/Loading';
import SearchBox from '../../components/SearchBox';
import ErrorComponent from '../../components/ErrorBoundary/ErrorComponent';
import { FLIGHT_LIMIT } from '../../constants';
import { container, remarkResultsHeader, searchControl, verifieds } from './style.css';
import { link } from '../../stylesheets/shared.css';

export const SEARCH_REMARKS_AND_VERIFIEDS = gql`
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
    searchVerifiedPassengers(query: $query) {
      id
      name
      slug
      biography
      flightCount
      histogram {
        count
        month
      }
    }
  }
`;

export default () => {
  const { query: urlEncodedQuery } = useParams() || {};
  const query = urlEncodedQuery ? decodeURIComponent(urlEncodedQuery) : undefined;
  const history = useHistory();

  // if query is defined, instantly kick off search - else wait for doSearch
  const [executeQuery, { data, loading, error, fetchMore }] = useLazyQuery(
    SEARCH_REMARKS_AND_VERIFIEDS,
    {
      variables: { limit: FLIGHT_LIMIT },
    },
  );

  useEffect(() => {
    if (query) {
      executeQuery({ variables: { query } });
    }
  }, [query]);

  const doSearch = searchQuery => {
    if (!searchQuery || searchQuery.length < 1) return;
    executeQuery({ variables: { query: searchQuery } });

    // Update URL with search query
    history.push({
      pathname: `/search/${searchQuery}`,
    });
  };

  if (loading) return <Loading text />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <div className={container}>
      <MetaTags title={query ? `Search Results: '${query}'` : 'Search'} />
      <div className={searchControl}>
        <SearchBox initialValue={query} onClick={doSearch} />
      </div>
      {query && query.length && data && data.searchVerifiedPassengers.length ? (
        <div className={verifieds}>
          <p className={remarkResultsHeader}>Possibly matching verified passengers:</p>
          {data.searchVerifiedPassengers.map(({ slug }) => (
            <MiniPassenger key={slug} slug={slug} />
          ))}
        </div>
      ) : null}
      {query && query.length && data && (
        <>
          <p className={remarkResultsHeader}>
            <span>{data.countFlightSearchResults}</span>
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
          {data.countFlightSearchResults > 0 && (
            <PaginatedBrowser
              browserComponent={MiniFlight}
              passProps={{ fullManifest: true }}
              ids={data.searchRemarksForFlights.edges.map(x => x.id)}
              totalAvailable={data.countFlightSearchResults}
              pageSize={FLIGHT_LIMIT}
              fetchMore={() =>
                fetchMore({
                  variables: {
                    offset: data.searchRemarksForFlights.edges.length,
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
