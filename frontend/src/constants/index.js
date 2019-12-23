// injected by DefinePlugin
/* globals projectConfig */

export const SHOW_DEV_TOOLS = process.env.NODE_ENV !== 'production';
export const TRACK_ANALYTICS = process.env.NODE_ENV === 'production';
export const LOG_ERRORS = process.env.NODE_ENV === 'production';

export const RAVEN_ENDPT = projectConfig.RavenDSN;
export const GA_ID = projectConfig.GAProperty;
export const RELEASE = process.env.GITHUB_SHA;

export const BACKEND_URL = 'https://d1gs0ktl8zk671.cloudfront.net';

export const MAP_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';
export const MAP_ATTRIBUTION =
  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution/">CARTO</a>';
