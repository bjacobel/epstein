/* eslint-disable react/no-danger */

import React from 'react';

import { aboutPage } from './style.css';
import about from './about.md';

export default () => (
  <article className={aboutPage} dangerouslySetInnerHTML={{ __html: about }} />
);
