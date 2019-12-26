import React from 'react';

import Routes from '../Routes/Routes';
import Header from '../../components/Header';
import ErrorBoundary from '../../components/ErrorBoundary';
import { appWrap } from './style.css';

export default () => (
  <div className={appWrap}>
    <Header />
    <ErrorBoundary>
      <Routes />
    </ErrorBoundary>
  </div>
);
