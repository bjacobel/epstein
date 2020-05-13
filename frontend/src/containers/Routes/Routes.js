import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import NotFound from '../NotFound';
import Home from '../Home';
import Flight from '../Flight';
import Passenger from '../Passenger';
import Login from '../Login';
import Search from '../Search';
import Analytics from '../../utils/Analytics';
import Loading from '../../components/Loading';
import { hasValidJwtToken } from '../../utils/auth';

export class GARoute extends Route {
  render() {
    this.props.ga.pageview();
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...this.props} />;
  }
}

const SuspenseAdmin = React.lazy(() =>
  import(/* webpackChunkName: "admin" */ '../Admin'),
);

const SuspenseAbout = React.lazy(() =>
  import(/* webpackChunkName: "about" */ '../About'),
);

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
          <GARoute
            ga={this.ga}
            path="/about"
            exact
            render={() => (
              <Suspense fallback={<Loading />}>
                <SuspenseAbout />
              </Suspense>
            )}
          />
          <Route path="/login" exact component={Login} />
          <PrivateRoute path="/admin" exact>
            <Suspense fallback={<Loading />}>
              <SuspenseAdmin />
            </Suspense>
          </PrivateRoute>
          <GARoute ga={this.ga} path="/search/:query?" exact component={Search} />
          <GARoute ga={this.ga} component={NotFound} />
        </Switch>
      </div>
    );
  }
}
