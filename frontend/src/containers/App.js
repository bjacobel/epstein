import React from 'react';

import Routes from './Routes';
import Header from '../components/Header';
import { appWrap } from '../stylesheets/app.css';

export default () => (
  <div className={appWrap}>
    <Header />
    <Routes />
  </div>
);
