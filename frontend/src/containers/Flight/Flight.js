import React, { Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import Details from '../../components/Details';
import Loading from '../../components/Loading';
import MetaTags from '../../components/MetaTags';
import { passengers, noslug, explainLiteral } from './style.css';
import { link } from '../../stylesheets/shared.css';

export const FLIGHT = gql`
  fragment airfield on Airfield {
    name
    iata_code
    latitude_deg
    longitude_deg
    municipality
    iso_country
  }
  query Flight($id: Int!) {
    flight(id: $id) {
      id
      distance
      date
      page
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
      aircraft {
        id
        model
        tailsign
      }
      source {
        ...airfield
      }
      destination {
        ...airfield
      }
    }
  }
`;

const formatKm = m =>
  `${new Intl.NumberFormat().format(Number.parseFloat(m / 1000).toPrecision(4))} km`;

/* eslint-disable camelcase */
const Airfield = ({ data, error, type }) => {
  try {
    const { name, municipality, iso_country } = data.flight[type];
    return <span>{`${name} (${municipality}, ${iso_country})`}</span>;
  } catch (e) {
    return (
      <span>
        {
          error.graphQLErrors.find(
            err => err.path[0] === 'flight' && err.path[1] === type,
          ).errorInfo.query
        }
        <span> (unknown airport)</span>
      </span>
    );
  }
};
/* eslint-enable camelcase */

export const airfieldHandler = (data, error, type) => {
  try {
    return data.flight[type].iata_code;
  } catch (e) {
    return error.graphQLErrors.find(
      err => err.path[0] === 'flight' && err.path[1] === type,
    ).errorInfo.query;
  }
};

export const describePassengers = plist => {
  const notablePassengers = plist.filter(x => x.name).map(x => x.name);
  const listablePassengers = notablePassengers.slice(0, notablePassengers.length - 1);
  const listedPassengers = listablePassengers.join(', ');
  const lastPassenger = notablePassengers[notablePassengers.length - 1];

  return `${plist.length} passengers were listed on the manifest${
    notablePassengers.length
      ? `, including ${listedPassengers}${
          listedPassengers.length ? ' and ' : ''
        }${lastPassenger}`
      : ''
  }`;
};

export default ({ match }) => {
  const { id } = match.params;
  const { loading, data, error } = useQuery(FLIGHT, {
    variables: { id },
    errorPolicy: 'all', // this request is prone to nonfatal NotFoundErrors
  });

  if (loading) return <Loading text />;

  const isoDate = parseISO(data.flight.date);

  const SuspenseMap = React.lazy(() =>
    import(/* webpackChunkName: "map" */ '../../components/Map'),
  );

  return (
    <>
      <MetaTags
        title={`${airfieldHandler(data, error, 'source')} to ${airfieldHandler(
          data,
          error,
          'destination',
        )} on ${format(isoDate, 'M/d/yy')}`}
        description={describePassengers(data.flight.passengers.edges)}
        uri={`flight/${data.flight.id}`}
      />
      <Details>
        <span>date</span>
        <span>{format(isoDate, 'MMM d, y')}</span>
        <span>source</span>
        <Airfield data={data} error={error} type="source" />
        <span>destination</span>
        <Airfield data={data} error={error} type="destination" />
        {data.flight.source && data.flight.destination && (
          <>
            <span>distance</span>
            <span>{formatKm(data.flight.distance)}</span>
            <span>map</span>
            <div>
              <Suspense fallback={<Loading />}>
                <SuspenseMap source={data.flight.source} dest={data.flight.destination} />
              </Suspense>
            </div>
          </>
        )}
        <span>source</span>
        <span>
          <a
            className={link}
            href={data.flight.page}
            target="_blank"
            rel="noopener noreferrer"
          >
            original PDF document
          </a>
        </span>
        <span>passengers</span>
        <div className={passengers}>
          <ul>
            {data.flight.passengers.edges
              .filter(x => x.slug)
              .map(({ slug, name }) => (
                <li key={slug}>
                  <Link className={link} to={`/passenger/${slug}`}>
                    {name}
                  </Link>
                </li>
              ))}
            {!!data.flight.passengers.edges.filter(x => !x.slug).length && (
              <>
                <hr />
                <span className={explainLiteral}>
                  <span>As well as the following, who </span>
                  <HashLink
                    className={link}
                    to="/about#why-are-some-entries-not-linked-to-an-identified-passenger"
                  >
                    have not been linked to an identified passenger
                  </HashLink>
                  :
                </span>
                {data.flight.passengers.edges
                  .filter(x => !x.slug)
                  .map(({ literal }) => (
                    <li key={literal} className={noslug}>
                      <span>{`“${literal}”`}</span>
                    </li>
                  ))}
              </>
            )}
          </ul>
        </div>
        <span>aircraft</span>
        <div>
          <span>{data.flight.aircraft.model}</span>
          <br />
          <span>
            <span>tailsign </span>
            <Link className={link} to={`/aircraft/${data.flight.aircraft.id}`}>
              {data.flight.aircraft.tailsign}
            </Link>
          </span>
        </div>
      </Details>
    </>
  );
};
