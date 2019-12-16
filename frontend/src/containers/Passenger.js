import React from 'react';
import { useQuery, gql } from '@apollo/client';

import Details from '../components/Details';
import FlightBrowser from '../components/Flight/Browser';
import Loading from '../components/Loading';
import { link } from '../stylesheets/link.css';

const PASSENGER = gql`
  query Passenger($slug: String!) {
    passenger(slug: $slug) {
      id
      name
      biography
      wikipedia_link
      image
      flightCount
      flights(limit: 10) {
        edges {
          id
        }
      }
    }
  }
`;

export default ({ match }) => {
  const { slug } = match.params;
  const { loading, error, data } = useQuery(PASSENGER, { variables: { slug } });

  if (loading) return <Loading text />;
  if (error) return <p>Error :(</p>;

  return (
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
      {data.passenger.image ? (
        <>
          <span>image</span>
          <img src={data.passenger.image} alt="" />
        </>
      ) : null}
      <span># of flights</span>
      <span>{data.passenger.flightCount}</span>
      <span>flights</span>
      <div>
        <FlightBrowser ids={data.passenger.flights.edges.map(x => x.id)} />
      </div>
    </Details>
  );
};
