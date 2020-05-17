import React from 'react';
import { Helmet } from 'react-helmet';

export default ({ title, description, image, uri }) => (
  <Helmet>
    <title>{`${title} | epstein.flights`}</title>
    <link rel="canonical" href={`https://epstein.flights/${uri}`} />
    <meta name="description" content={description || projectConfig.description} />
    <meta property="og:title" content={`${title} in the Epstein flight logs`} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
    <meta property="og:url" content={`https://epstein.flights/${uri}`} />
    <meta property="og:site_name" content="epstein.flights" />
    <meta name="twitter:card" content="summary" />
  </Helmet>
);
