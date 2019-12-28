import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import PassengerAdmin from './PassengerAdmin';
import Loading from '../../components/Loading';
import { AdminClient } from '../../utils/graphqlClient';

const PASSENGERS = gql`
  query {
    passengers(includeUnverified: false) {
      edges {
        id
        slug
        name
        biography
        wikipedia_link
        image
      }
    }
  }
`;

export default () => {
  const [createFormSelected, selectCreateForm] = useState(false);
  const [passenger, setPassenger] = useState();
  const { data, loading, error } = useQuery(PASSENGERS, { client: AdminClient });

  const handleSelectChange = ({ target }) => {
    if (target.value === 'new') return selectCreateForm(true);
    return setPassenger(data.passengers.edges.find(p => p.slug === target.value));
  };

  if (loading) return <Loading />;
  if (error) throw error;

  const backButton = (
    <button
      type="button"
      onClick={() => {
        selectCreateForm(false);
        setPassenger();
      }}
    >
      Go back
    </button>
  );

  if (createFormSelected) {
    return (
      <>
        {backButton}
        <PassengerAdmin mode="create" />
      </>
    );
  }

  if (passenger) {
    return (
      <>
        {backButton}
        <PassengerAdmin mode="update" {...passenger} />
      </>
    );
  }

  return (
    <label htmlFor="pass-select">
      Select a passenger
      <select name="pass-select" onChange={handleSelectChange}>
        <option>-----</option>
        <option value="new">Create new passenger</option>
        {data.passengers.edges.map(p => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
};
