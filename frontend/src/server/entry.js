import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from '../containers/App/App';

export default params => {
  return renderToString(
    <StaticRouter location={params.url}>
      <App />
    </StaticRouter>,
  );
};
