/* globals htmlWebpackPlugin */

import React from 'react';

export default (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <meta name="description" content={htmlWebpackPlugin.options.description} />
      <title>{htmlWebpackPlugin.options.title}</title>
    </head>
    <body>
      <div id="main">{'{{prerender}}'}</div>
    </body>
  </html>
);
