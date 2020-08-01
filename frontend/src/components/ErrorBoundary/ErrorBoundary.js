import React, { Component } from 'react';

import sentry from '../../utils/errors';
import Error from './Error';

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
      return <Error error={this.state.error} />;
    }

    return this.props.children;
  }
}
