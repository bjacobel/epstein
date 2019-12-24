import React from 'react';
import { Map, TileLayer, LayerGroup, Polyline } from 'react-leaflet';
import { latLngBounds, LatLng } from 'leaflet';
import { GreatCircle } from 'arc';
import 'leaflet/dist/leaflet.css';

import { MAP_TILES, MAP_ATTRIBUTION } from '../../constants';
import { mapContainer } from './style.css';

const latLngToXY = ([lat, lng]) => ({
  x: lng,
  y: lat,
});

export default ({ source, dest }) => {
  const leafletSource = new LatLng(...source);
  const leafletDest = new LatLng(...dest);
  const gc = new GreatCircle(latLngToXY(source), latLngToXY(dest));
  const curve = gc.Arc(100);
  const points = curve.geometries[0].coords.map(([y, x]) => new LatLng(x, y));
  const bounds = latLngBounds(leafletSource, leafletDest);

  return (
    <Map
      className={mapContainer}
      bounds={bounds}
      boundsOptions={{ padding: [10, 10] }}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
    >
      <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_TILES} />
      <LayerGroup>
        <Polyline color="black" interactive={false} positions={points} />
      </LayerGroup>
    </Map>
  );
};
