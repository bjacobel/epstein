import React from 'react';
import { useQuery, gql } from '@apollo/client';

const PASSENGER = gql`
  query Passenger($id: Int!) {
    passenger(id: $id) {
      id
      canonical
      biography
      wikipedia_link
      image_link
      flights(limit: 10) {
        id
      }
    }
  }
`;

export default ({ match }) => {
  const { id } = match.params;
  const { loading, error, data } = useQuery(PASSENGER, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
