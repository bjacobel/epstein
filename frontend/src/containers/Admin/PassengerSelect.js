import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import PassengerAdmin from './PassengerAdmin';
import LiteralsAdmin from './LiteralsAdmin';
import Loading from '../../components/Loading';
import { AdminClient } from '../../utils/graphqlClient';
import { PASSENGERS } from './queries';
import { breadcrumb, breadcrumbs, divider, selectPass } from './style.css';

export default props => {
  const { clientForTests } = props || {};
  const [createFormSelected, selectCreateForm] = useState(false);
  const [currentPassengerSlug, setCurrentPassengerSlug] = useState();
  const { data, loading, error } = useQuery(PASSENGERS, {
    client: clientForTests || AdminClient,
  });

  let passengerData;
  if (data) {
    passengerData = data.passengers.edges.find(p => p.slug === currentPassengerSlug);
  }

  const handleSelectChange = ({ target }) => {
    if (target.value === 'new') return selectCreateForm(true);
    return setCurrentPassengerSlug(target.value);
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
          setCurrentPassengerSlug();
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
      {(createFormSelected || passengerData) &&
        crumbs(passengerData ? `Edit ${passengerData.name}` : 'Create new passenger')}
      {createFormSelected && (
        <PassengerAdmin
          mode="create"
          onCreate={slug => {
            setCurrentPassengerSlug(slug);
            selectCreateForm(false);
          }}
        />
      )}
      {passengerData && (
        <div>
          <PassengerAdmin mode="update" {...passengerData} />
          <LiteralsAdmin passenger={passengerData} />
        </div>
      )}
      {!(createFormSelected || passengerData) && (
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
