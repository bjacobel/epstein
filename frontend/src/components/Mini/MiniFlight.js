import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import Loading from '../Loading';
import { box, link, row } from './mini.css';
import { robotoMono as mono } from '../../stylesheets/shared.css';

const FLIGHT = gql`
  query flight($id: Int!) {
    flight(id: $id) {
      id
      date
      source {
        iata_code
      }
      destination {
        iata_code
      }
      passengers {
        pageInfo {
          count
        }
      }
    }
  }
`;

export default ({ id, done }) => {
  const { loading, error, data } = useQuery(FLIGHT, {
    variables: { id },
    onCompleted: done,
    onError: done,
  });

  if (loading) return done ? null : <Loading />;
  if (error) return <p>Error :(</p>;

  return (
    <div className={box}>
      <Link to={`/flight/${data.flight.id}`} className={link}>
        <div className={row}>
          <span>{format(parseISO(data.flight.date), 'MMM d, y')}</span>
          <span>{`${data.flight.passengers.pageInfo.count} passengers`}</span>
        </div>
        <div className={row}>
          <span>
            <span className={mono}>{data.flight.source.iata_code}</span>
            <span> to </span>
            <span className={mono}>{data.flight.destination.iata_code}</span>
          </span>
        </div>
      </Link>
    </div>
  );
};
