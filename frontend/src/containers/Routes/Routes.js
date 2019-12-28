import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import NotFound from '../NotFound';
import Home from '../Home';
import Flight from '../Flight';
import Passenger from '../Passenger';
import Login from '../Login';
import Admin from '../Admin';
import Analytics from '../../utils/Analytics';
import { hasValidJwtToken } from '../../utils/auth';

export class GARoute extends Route {
  render() {
    this.props.ga.pageview();
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...this.props} />;
  }
}

export const PrivateRoute = ({ children, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) =>
      hasValidJwtToken() ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location },
          }}
        />
      )
    }
  />
);

export default class Routes extends Component {
  constructor() {
    super();
    this.ga = new Analytics();
  }

  render() {
    return (
      <div>
        <Switch>
          <GARoute ga={this.ga} path="/" exact component={Home} />
          <GARoute ga={this.ga} path="/flight/:id" exact component={Flight} />
          <GARoute ga={this.ga} path="/passenger/:slug" exact component={Passenger} />
          <Route path="/login" exact component={Login} />
          <PrivateRoute path="/admin" exact>
            <Admin />
          </PrivateRoute>
          <GARoute ga={this.ga} component={NotFound} />
        </Switch>
      </div>
    );
  }
}
