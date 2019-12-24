import React, { Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

import Details from '../../components/Details';
import Loading from '../../components/Loading';
import MetaTags from '../../components/MetaTags';
import { passengers, noslug } from './style.css';
import { link } from '../../stylesheets/shared.css';

const FLIGHT = gql`
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
      passengers {
        edges {
          name
          slug
          literal
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
const Airfield = ({ name, municipality, iso_country }) => (
  <span>{`${name} (${municipality}, ${iso_country})`}</span>
);
/* eslint-enable camelcase */

export default ({ match }) => {
  const { id } = match.params;
  const { loading, error, data } = useQuery(FLIGHT, { variables: { id } });

  if (loading) return <Loading text />;
  if (error) return <p>Error :(</p>;

  const isoDate = parseISO(data.flight.date);

  const SuspenseMap = React.lazy(() =>
    import(/* webpackChunkName: "map" */ '../../components/Map'),
  );

  return (
    <>
      <MetaTags
        title={`${data.flight.source.iata_code} to ${
          data.flight.destination.iata_code
        } on ${format(isoDate, 'M/d/yy')}`}
        description={''}
        image={''}
        uri={`flight/${data.flight.id}`}
      />
      <Details>
        <span>date</span>
        <span>{format(isoDate, 'MMM d, y')}</span>
        <span>source</span>
        <Airfield {...data.flight.source} />
        <span>destination</span>
        <Airfield {...data.flight.destination} />
        <span>distance</span>
        <span>{formatKm(data.flight.distance)}</span>
        <span>map</span>
        <div>
          <Suspense fallback={<Loading />}>
            <SuspenseMap
              source={[data.flight.source.latitude_deg, data.flight.source.longitude_deg]}
              dest={[
                data.flight.destination.latitude_deg,
                data.flight.destination.longitude_deg,
              ]}
            />
          </Suspense>
        </div>
        <span>source</span>
        <span>
          <Link className={link} to={data.flight.page}>
            original PDF document
          </Link>
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
            {data.flight.passengers.edges
              .filter(x => !x.slug)
              .map(({ literal }) => (
                <li key={literal} className={noslug}>
                  {literal}
                </li>
              ))}
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
