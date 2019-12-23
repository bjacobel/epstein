import React from 'react';
import { Map, TileLayer, Polyline, LayerGroup } from 'react-leaflet';
import { latLngBounds, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { MAP_TILES, MAP_ATTRIBUTION } from '../../constants';
import { mapContainer } from './style.css';

export default ({ source, dest }) => {
  const bounds = latLngBounds(latLng(...source), latLng(...dest));
  return (
    <Map
      className={mapContainer}
      bounds={bounds}
      boundsOptions={{ padding: [50, 50] }}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
    >
      <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_TILES} />
      <LayerGroup>
        <Polyline color="black" interactive={false} positions={[source, dest]} />
      </LayerGroup>
    </Map>
  );
};
