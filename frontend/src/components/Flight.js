import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FLIGHT = gql`
  query Flight($id: Int!) {
    flight(id: $id) {
      id
      aircraft {
        model
        tailsign
      }
      source {
        name
        gps_code
      }
      destination {
        name
        gps_code
      }
    }
  }
`;

export default ({ match }) => {
  const { id } = match.params;
  const { loading, error, data } = useQuery(FLIGHT, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
