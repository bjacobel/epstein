import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import Loading from '../Loading';
import ErrorBoundary from '../ErrorBoundary';
import logError from '../../utils/errors';
import { box, link, row, leftJustifyRow, greyName } from './mini.css';
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
        edges {
          ... on VerifiedPassenger {
            name
            slug
          }
          ... on LiteralPassenger {
            literal
          }
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
  if (error) {
    logError(error);
    return null;
  }

  const verifiedPassengers = data.flight.passengers.edges.filter(x => x.slug);
  const literalPassengers = data.flight.passengers.edges.filter(x => x.literal);

  return (
    <ErrorBoundary>
      <div className={box}>
        <Link to={`/flight/${data.flight.id}`} className={link}>
          <div className={row}>
            <span>{format(parseISO(data.flight.date), 'MMM d, y')}</span>
            <span>
              <span className={mono}>{data.flight.source.iata_code}</span>
              <span> to </span>
              <span className={mono}>{data.flight.destination.iata_code}</span>
            </span>
          </div>
          <div className={leftJustifyRow}>
            {verifiedPassengers.map(({ slug, name }, i, arr) => (
              <span key={slug}>
                {`${name}${i < arr.length - 1 || literalPassengers.length ? ', ' : ''}`}
              </span>
            ))}
            {literalPassengers.map(({ literal }, i, arr) => (
              <span className={greyName} key={literal}>
                {`${literal}${i < arr.length - 1 ? ', ' : ''}`}
              </span>
            ))}
          </div>
        </Link>
      </div>
    </ErrorBoundary>
  );
};
