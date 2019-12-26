import React from 'react';
import { useMutation, gql } from '@apollo/client';

import { AdminClient } from '../../utils/graphqlClient';
import Loading from '../../components/Loading';

const CREATE_OR_UPDATE_PASSENGER = gql`
  mutation($slug: String!) {
    createOrUpdatePassenger(slug: $slug) {
      id
    }
  }
`;

export default () => {
  const slug = 'bill-clinton';
  const [createOrUpdatePassenger, { loading, error, data }] = useMutation(
    CREATE_OR_UPDATE_PASSENGER,
    {
      variables: { slug },
      client: AdminClient,
    },
  );

  if (loading) return <Loading />;
  if (error) throw error;

  return (
    <>
      <button type="submit" onClick={createOrUpdatePassenger}>
        create or update passenger
      </button>
      {data && <pre>{data}</pre>}
    </>
  );
};
