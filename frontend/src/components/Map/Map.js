import React from 'react';
import { latLngBounds, LatLng } from 'leaflet';
import { Map, TileLayer, LayerGroup, AttributionControl } from 'react-leaflet';
import Curve from 'react-leaflet-curve/src/Curve';
import { GreatCircle } from 'arc';
import 'leaflet/dist/leaflet.css';

import { MAP_TILES, MAP_ATTRIBUTION } from '../../constants';
import ErrorBoundary from '../ErrorBoundary';
import { mapContainer } from './style.css';

const latLngToXY = ([lat, lng]) => ({
  x: lng,
  y: lat,
});

export default ({ source, dest }) => {
  const leafletSource = new LatLng(...source);
  const leafletDest = new LatLng(...dest);
  const gc = new GreatCircle(latLngToXY(source), latLngToXY(dest));
  const arc = gc.Arc(3);
  const control = arc.geometries[0].coords.map(([y, x]) => [x, y])[1];
  const bounds = latLngBounds(leafletSource, leafletDest);

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
          <Curve
            option={{ color: 'black', dashArray: 5 }}
            positions={['M', source, 'Q', control, dest]}
          />
        </LayerGroup>
      </Map>
    </ErrorBoundary>
  );
};
