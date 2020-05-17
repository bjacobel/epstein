/* eslint-disable react/no-danger */

import React from 'react';

import MetaTags from '../../components/MetaTags';
import { aboutPage } from './style.css';
import about from './about.md';

export default () => (
  <>
    <MetaTags title="About" />
    <article className={aboutPage} dangerouslySetInnerHTML={{ __html: about }} />
  </>
);
