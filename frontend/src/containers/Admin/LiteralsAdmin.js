import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

import { AdminClient } from '../../utils/graphqlClient';
import Loading from '../../components/Loading';
import NotifyMutationSuccess from '../../components/NotifyMutationSuccess';
import { form, submit, literalsAdmin } from './style.css';

export const UPDATE_LITERALS = gql`
  mutation($slug: String!, $literals: [String]!) {
    updateLiterals(slug: $slug, literals: $literals) {
      id
      slug
      literals
    }
  }
`;

export default ({ passenger, clientForTests }) => {
  const [literals, setLiterals] = useState(passenger.literals);
  const [newLiteral, setNewLiteral] = useState('');
  const [updateLiterals, { loading, error, data }] = useMutation(UPDATE_LITERALS, {
    variables: {
      literals: [...literals, ...(newLiteral.length ? [newLiteral] : [])],
      slug: passenger.slug,
    },
    client: clientForTests || AdminClient,
  });

  const handleFormSubmit = event => {
    updateLiterals();
    event.preventDefault();
  };

  if (loading) return <Loading />;
  if (error) throw error;

  return (
    <div className={literalsAdmin}>
      <form
        className={form}
        onChange={ev => {
          if (ev.target.form.newLiteral) {
            setNewLiteral(ev.target.form.newLiteral.value);
          }
          const lits = ev.target.form.literals && [
            ...(ev.target.form.literals.length
              ? ev.target.form.literals
              : [ev.target.form.literals]),
          ];
          if (lits) {
            setLiterals(
              lits.reduce(
                (prev, l) => [...prev, ...(l.value.length ? [l.value] : [])],
                [],
              ),
            );
          }
        }}
        onSubmit={handleFormSubmit}
      >
        {passenger.literals.map((literal, i) => (
          <label htmlFor="literals" key={literal}>
            <span>{i === 0 ? 'literals' : ''}</span>
            <input type="text" name="literals" defaultValue={literal} />
          </label>
        ))}
        <label htmlFor="newLiteral">
          <span>add new</span>
          <input type="text" name="newLiteral" />
        </label>
        <input className={submit} type="submit" value="update associated literals" />
      </form>
      {data && <NotifyMutationSuccess data={data} />}
    </div>
  );
};
