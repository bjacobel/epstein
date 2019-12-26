import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

import { AdminClient } from '../../utils/graphqlClient';
import Loading from '../../components/Loading';
import { form, submit } from './style.css';

const CREATE_OR_UPDATE_PASSENGER = gql`
  mutation(
    $slug: String!
    $name: String
    $biography: String
    $wikipedia_link: AWSURL
    $image: AWSURL
  ) {
    createOrUpdatePassenger(
      slug: $slug
      name: $name
      biography: $biography
      wikipedia_link: $wikipedia_link
      image: $image
    ) {
      slug
      name
      biography
      wikipedia_link
      image
    }
  }
`;

export default (props = {}) => {
  const { mode } = props;
  const fields = ['slug', 'name', 'biography', 'wikipedia_link', 'image'];
  const [fieldData, setFieldData] = useState(
    Object.entries(props).filter(([k]) =>
      fields.includes(k).reduce((prev, [k, v]) => ({ ...prev, [k]: v }), {}),
    ),
  );

  const [
    createOrUpdatePassenger,
    { loading: mutationLoading, error: mutationError, data: mutationResult },
  ] = useMutation(CREATE_OR_UPDATE_PASSENGER, {
    variables: { ...fields },
    client: AdminClient,
  });

  if (mutationLoading) return <Loading />;
  if (mutationError) throw mutationError;

  return (
    <>
      <form className={form} onSubmit={createOrUpdatePassenger}>
        {fields.map(field => (
          <label htmlFor={field} key={field}>
            <span>{field}</span>
            <input
              type="text"
              name={field}
              value={fieldData[field]}
              onChange={ev =>
                setFieldData({ ...fieldData, [ev.target.name]: ev.target.value })
              }
            />
          </label>
        ))}
        <input className={submit} type="submit" value={`${mode} passenger`} />
      </form>
      {mutationResult && (
        <div>
          <span>mutation complete</span>
          <pre>JSON.stringify(mutationResult, null, 2)</pre>
        </div>
      )}
    </>
  );
};
