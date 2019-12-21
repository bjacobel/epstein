import React from 'react';
import { useQuery, gql } from '@apollo/client';

import Details from '../../components/Details';
import PaginatedBrowser from '../../components/PaginatedBrowser';
import Loading from '../../components/Loading';
import MiniFlight from '../../components/Mini/MiniFlight';
import { link } from '../../stylesheets/shared.css';
import MetaTags from '../../components/MetaTags';

const FLIGHT_LIMIT = 10;

export const PASSENGER = gql`
  query Passenger($slug: String!, $offset: Int, $limit: Int!) {
    passenger(slug: $slug) {
      id
      name
      slug
      biography
      wikipedia_link
      image
      flightCount
      flights(offset: $offset, limit: $limit) {
        edges {
          id
        }
        pageInfo {
          count
          hasNext
        }
      }
    }
  }
`;

const range = histogram => {
  if (!histogram) return '';

  const months = Object.keys(histogram);
  const [firstDate] = months[0];
  const [lastDate] = months[months.length - 1];

  if (firstDate === lastDate) {
    return `in ${firstDate}`;
  } else {
    return `between ${firstDate} and ${lastDate}`;
  }
};

const historyText = ({ passenger }) => {
  return `Appears in the Epstein flight logs at least ${
    passenger.flightCount
  } times ${range(passenger.histogram)}`;
};

export default ({ match }) => {
  const { slug } = match.params;
  const { loading, error, data, fetchMore } = useQuery(PASSENGER, {
    variables: { slug, limit: FLIGHT_LIMIT },
  });

  if (loading) return <Loading text />;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <MetaTags
        title={data.passenger.name}
        uri={`passenger/${data.passenger.slug}`}
        description={`${data.passenger.name} ${historyText(data).replace(
          /(^[A-Z])/,
          cap => cap.toLowerCase(),
        )}`}
      />
      <Details>
        <span>name</span>
        <span>{data.passenger.name}</span>
        <span>bio</span>
        <div>
          <span>{data.passenger.biography}</span>
          <br />
          <a className={link} href={data.passenger.wikipedia_link}>
            <span>See more on Wikipedia →</span>
          </a>
        </div>
        <span>history</span>
        <div>{historyText(data)}</div>
        {data.passenger.image ? (
          <>
            <span>image</span>
            <img src={data.passenger.image} alt="" />
          </>
        ) : null}
        <span>flights</span>
        <PaginatedBrowser
          browserComponent={MiniFlight}
          ids={data.passenger.flights.edges.map(x => x.id)}
          totalAvailable={data.passenger.flightCount}
          pageSize={FLIGHT_LIMIT}
          fetchMore={() =>
            fetchMore({
              variables: { offset: data.passenger.flights.edges.length + 1 },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                  passenger: {
                    ...prev.passenger,
                    flights: {
                      ...fetchMoreResult.passenger.flights,
                      pageInfo: {
                        ...fetchMoreResult.passenger.flights.pageInfo,
                        count:
                          prev.passenger.flights.pageInfo.count +
                          fetchMoreResult.passenger.flights.pageInfo.count,
                      },
                      edges: [
                        ...prev.passenger.flights.edges,
                        ...fetchMoreResult.passenger.flights.edges,
                      ],
                    },
                  },
                };
              },
            })
          } // eslint-disable-line
        />
      </Details>
    </>
  );
};
