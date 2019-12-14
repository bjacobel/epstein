import React from 'react';
import { useQuery, gql } from '@apollo/client';

const PASSENGER = gql`
  query Passenger($slug: String!) {
    passenger(slug: $slug) {
      id
      name
      biography
      wikipedia_link
      image
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
