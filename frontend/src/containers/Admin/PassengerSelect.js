import React, { useState } from 'react';
import { gql } from '@apollo/client';

import Loading from '../../components/Loading';
import PassengerAdmin from './PassengerAdmin';
import { form, submit } from './style.css';

const PASSENGERS = gql`
  query {
    passengers {
      slug
    }
  }
`;

export default () => {
  const [createFormSelected, selectCreateForm] = useState(false);
  const [passenger, setPassenger] = useState();

  if (createFormSelected) {
    return <PassengerAdmin mode="create" />;
  }

  return <span>select a passenger</span>;
};
