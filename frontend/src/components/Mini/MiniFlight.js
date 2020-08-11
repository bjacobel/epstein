import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import Loading from '../Loading';
import ErrorBoundary from '../ErrorBoundary';
import { airfieldHandler } from '../../containers/Flight';
import { box, link, row, leftJustifyRow, greyName } from './mini.css';
import { robotoMono as mono } from '../../stylesheets/shared.css';

export const FLIGHT = gql`
  query flight($id: Int!, $fetchPassengers: Boolean!) {
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
        edges @include(if: $fetchPassengers) {
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

export default ({ id, done, fullManifest }) => {
  const { loading, error, data } = useQuery(FLIGHT, {
    variables: { id, fetchPassengers: fullManifest || false },
    onCompleted: done,
    onError: done,
    errorPolicy: 'all', // this request is prone to nonfatal NotFoundErrors
  });

  if (loading) return done ? null : <Loading />;
  if (!data || !data.flight) return null;

  const fromTo = (
    <span>
      <span className={mono}>{airfieldHandler(data, error, 'source')}</span>
      <span> to </span>
      <span className={mono}>{airfieldHandler(data, error, 'destination')}</span>
    </span>
  );

  const passengerCount = (
    <span>{`${data.flight.passengers.pageInfo.count} passengers`}</span>
  );

  let passengerManifest;
  if (fullManifest) {
    const verifiedPassengers = data.flight.passengers.edges.filter(x => x.slug);
    const literalPassengers = data.flight.passengers.edges.filter(x => x.literal);
    passengerManifest = (
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
    );
  }

  return (
    <ErrorBoundary>
      <div className={box}>
        <Link to={`/flight/${data.flight.id}`} className={link}>
          <div className={row}>
            <span>{format(parseISO(data.flight.date), 'MMM d, y')}</span>
            {fullManifest ? fromTo : passengerCount}
          </div>
          <div className={row}>{fullManifest ? passengerManifest : fromTo}</div>
        </Link>
      </div>
    </ErrorBoundary>
  );
};
