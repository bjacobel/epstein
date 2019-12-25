// injected by DefinePlugin
/* globals projectConfig */

export const SHOW_DEV_TOOLS = process.env.NODE_ENV !== 'production';
export const TRACK_ANALYTICS = process.env.NODE_ENV === 'production';
export const LOG_ERRORS = process.env.NODE_ENV === 'production';

export const RAVEN_ENDPT = projectConfig.RavenDSN;
export const GA_ID = projectConfig.GAProperty;
export const RELEASE = process.env.GITHUB_SHA;

export const BACKEND_URL = 'https://d1gs0ktl8zk671.cloudfront.net';
export const BACKEND_UNCACHED_URL =
  'https://r3ih5g7at5dfbmjbvrbfv7levu.appsync-api.us-east-2.amazonaws.com/graphql';

export const MAP_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';
export const MAP_ATTRIBUTION =
  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution/">CARTO</a>';

export const COGNITO_CLIENT_ID = '5325ed44jv6ecv1dmputjbj7km';
export const COGNITO_LOGIN_FORM = `https://epsteinbrain.auth.us-east-2.amazoncognito.com/login?${new URLSearchParams(
  {
    client_id: COGNITO_CLIENT_ID,
    response_type: 'token',
    scope: 'aws.cognito.signin.user.admin',
    redirect_uri: `${
      process.env.NODE_ENV === 'production'
        ? `https://${projectConfig.ProjectFQDomain}`
        : 'http://localhost:8080'
    }/login`,
  },
)}`;
