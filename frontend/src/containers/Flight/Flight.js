import React, { Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

import Details from '../../components/Details';
import Loading from '../../components/Loading';
import MetaTags from '../../components/MetaTags';
import { link } from '../../stylesheets/shared.css';

const FLIGHT = gql`
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
        name
        iata_code
        latitude_deg
        longitude_deg
      }
      destination {
        name
        iata_code
        latitude_deg
        longitude_deg
      }
    }
  }
`;

const formatKm = m =>
  `${new Intl.NumberFormat().format(Number.parseFloat(m / 1000).toPrecision(4))} km`;

export default ({ match }) => {
  const { id } = match.params;
  const { loading, error, data } = useQuery(FLIGHT, { variables: { id } });

  if (loading) return <Loading text />;
  if (error) return <p>Error :(</p>;

  const isoDate = parseISO(data.flight.date);

  const SuspenseMap = React.lazy(() => import('../../components/Map'));

  return (
    <>
      <MetaTags
        title={`${data.flight.source.iata_code} to ${
          data.flight.destination.iata_code
        } on ${format(isoDate, 'd/M/yy')}`}
        description={''}
        image={''}
        uri={`flight/${data.flight.id}`}
      />
      <Details>
        <span>date</span>
        <span>{format(isoDate, 'MMM d, y')}</span>
        <span>source</span>
        <span>{data.flight.source.name}</span>
        <span>destination</span>
        <span>{data.flight.destination.name}</span>
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
