import React, { Component } from 'react';

import sentry from '../../utils/errors';
import { SHOW_DEV_TOOLS } from '../../constants';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    sentry(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h3>Something went wrong.</h3>
          {SHOW_DEV_TOOLS && <pre>{this.state.error.stack}</pre>}
        </>
      );
    }

    return this.props.children;
  }
}
