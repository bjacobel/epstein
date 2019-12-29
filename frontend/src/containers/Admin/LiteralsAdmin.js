import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

import { AdminClient } from '../../utils/graphqlClient';
import Loading from '../../components/Loading';
import { form, submit } from './style.css';

const UPDATE_LITERALS = gql``;

export default () => {
  const [literals, setLiterals] = useState([]);
  const [updateLiterals, { loading, error, data }] = useMutation(UPDATE_LITERALS, {
    variables: { literals },
    client: AdminClient,
  });

  const handleFormSubmit = event => {
    updateLiterals();
    event.preventDefault();
  };

  if (loading) return <Loading />;
  if (error) throw error;

  return (
    <>
      <form className={form} onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="literals"
          onChange={ev => setLiterals([...literals, ev.target.value])}
        />
        <input className={submit} type="submit" value="update associated literals" />
      </form>
      {data && (
        <div>
          <span>mutation complete</span>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </>
  );
};
