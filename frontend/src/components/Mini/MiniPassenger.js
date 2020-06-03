import React from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import classNames from 'classnames';

import ErrorBoundary from '../ErrorBoundary';
import Loading from '../Loading';
import { box, link, row, name, passengerBox } from './mini.css';
import { historyText } from '../../containers/Passenger';

export const PASSENGER = gql`
  query Passenger($slug: String!) {
    passenger(slug: $slug) {
      id
      name
      slug
      biography
      flightCount
      histogram {
        count
        month
      }
    }
  }
`;

export default ({ slug }) => {
  const { loading, error, data } = useQuery(PASSENGER, {
    variables: { slug },
  });

  if (loading) return <Loading />;
  if (error) throw error;

  return (
    <ErrorBoundary>
      <div className={classNames(box, passengerBox)}>
        <Link to={`/passenger/${data.passenger.slug}`} className={link}>
          <div className={classNames(row, name)}>{data.passenger.name}</div>
          <div className={row}>{data.passenger.biography}</div>
          <div className={row}>{historyText(data)}</div>
        </Link>
      </div>
    </ErrorBoundary>
  );
};
