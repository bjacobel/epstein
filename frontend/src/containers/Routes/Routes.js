import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from '../NotFound';
import Home from '../Home';
import Flight from '../Flight';
import Passenger from '../Passenger';
import Analytics from '../../utils/Analytics';

export class GARoute extends Route {
  render() {
    this.props.ga.pageview();
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...this.props} />;
  }
}

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
          <GARoute ga={this.ga} component={NotFound} />
        </Switch>
      </div>
    );
  }
}
