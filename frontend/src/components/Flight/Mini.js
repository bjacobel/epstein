import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FLIGHT = gql`
  query flight($id: Int!) {
    flight(id: $id) {
      source {
        name
      }
      destination {
        name
      }
    }
  }
`;

export default ({ id }) => {
  const { loading, error, data } = useQuery(FLIGHT, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
