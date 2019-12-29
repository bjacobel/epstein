import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

import { AdminClient } from '../../utils/graphqlClient';
import Loading from '../../components/Loading';
import { form, submit } from './style.css';

const UPDATE_LITERALS = gql`
  mutation($id: Int!, $literals: [String]!) {
    updateLiterals(id: $id, literals: $literals) {
      slug
      literals
    }
  }
`;

export default ({ passenger }) => {
  const [literals, setLiterals] = useState(passenger.literals);
  const [updateLiterals, { loading, error, data }] = useMutation(UPDATE_LITERALS, {
    variables: { literals, id: passenger.id },
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
      <form
        className={form}
        onChange={ev => {
          setLiterals([...ev.target.form.literals].map(l => l.value));
        }}
        onSubmit={handleFormSubmit}
      >
        {literals.map(literal => (
          <input type="text" key={literal} name="literals" value={literal} />
        ))}
        <input type="text" name="literals" />
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
