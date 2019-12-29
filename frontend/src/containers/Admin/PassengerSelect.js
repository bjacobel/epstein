import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import PassengerAdmin from './PassengerAdmin';
import LiteralsAdmin from './LiteralsAdmin';
import Loading from '../../components/Loading';
import { AdminClient } from '../../utils/graphqlClient';
import { breadcrumb, breadcrumbs, divider, selectPass } from './style.css';

export const PASSENGERS = gql`
  query {
    passengers(includeUnverified: false) {
      edges {
        ... on VerifiedPassenger {
          id
          slug
          name
          biography
          wikipedia_link
          image
          literals
        }
      }
    }
  }
`;

export default props => {
  const { clientForTests } = props || {};
  const [createFormSelected, selectCreateForm] = useState(false);
  const [passenger, setPassenger] = useState();
  const { data, loading, error } = useQuery(PASSENGERS, {
    client: clientForTests || AdminClient,
  });

  const handleSelectChange = ({ target }) => {
    if (target.value === 'new') return selectCreateForm(true);
    return setPassenger(data.passengers.edges.find(p => p.slug === target.value));
  };

  if (loading) return <Loading />;
  if (error) throw error;

  const crumbs = current => (
    <div className={breadcrumbs}>
      <button
        type="button"
        className={breadcrumb}
        onClick={() => {
          selectCreateForm(false);
          setPassenger();
        }}
      >
        Admin
      </button>
      <span className={divider} />
      <span className={breadcrumb}>{current}</span>
    </div>
  );

  return (
    <>
      {(createFormSelected || passenger) &&
        crumbs(passenger ? `Edit ${passenger.name}` : 'Create new passenger')}
      {createFormSelected && <PassengerAdmin mode="create" />}
      {passenger && (
        <>
          <PassengerAdmin mode="update" {...passenger} />
          <LiteralsAdmin passenger={passenger} />
        </>
      )}
      {!(createFormSelected || passenger) && (
        <label className={selectPass} htmlFor="pass-select">
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
      )}
    </>
  );
};
