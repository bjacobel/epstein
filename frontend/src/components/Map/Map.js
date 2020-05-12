import React from 'react';
import { latLngBounds, LatLng, Icon, Point } from 'leaflet';
import { Map, TileLayer, LayerGroup, AttributionControl, Marker } from 'react-leaflet';
import Curve from 'react-leaflet-curve/src/Curve';
import { GreatCircle } from 'arc';
import DefaultMarkerIcon from 'leaflet/dist/images/marker-icon.png';
import DefaultMarkerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/leaflet.css';

import { MAP_TILES, MAP_ATTRIBUTION } from '../../constants';
import ErrorBoundary from '../ErrorBoundary';
import { mapContainer } from './style.css';

const latLngToXY = ([lat, lng]) => ({
  x: lng,
  y: lat,
});

const checkForTravel = (source, dest) => source[0] !== dest[0] || source[1] !== dest[1];

const icon = new Icon({
  iconUrl: DefaultMarkerIcon,
  iconRetinaUrl: DefaultMarkerIcon2x,
  iconSize: new Point(25, 41),
});

export default ({ source, dest }) => {
  if (!source || !dest) return null;
  const didTravel = checkForTravel(source, dest);
  const leafletSource = new LatLng(...source);
  const leafletDest = new LatLng(...dest);
  const gc = new GreatCircle(latLngToXY(source), latLngToXY(dest));
  const arc = gc.Arc(3);
  const control = arc.geometries[0].coords.map(([y, x]) => [x, y])[1];
  const bounds = didTravel
    ? latLngBounds(leafletSource, leafletDest)
    : leafletSource.toBounds(1e6);

  return (
    <ErrorBoundary>
      <Map
        className={mapContainer}
        bounds={bounds}
        boundsOptions={{ padding: [10, 10] }}
        attributionControl={false}
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_TILES} />
        <LayerGroup>
          {didTravel ? (
            <Curve
              option={{ color: 'black', dashArray: 5 }}
              positions={['M', source, 'Q', control, dest]}
            />
          ) : (
            <Marker position={leafletSource} icon={icon} />
          )}
        </LayerGroup>
      </Map>
    </ErrorBoundary>
  );
};
