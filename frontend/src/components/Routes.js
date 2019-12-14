import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NotFound from './NotFound';
import Main from './Main';
import Flight from './Flight';
import Passenger from './Passenger';
import Analytics from '../utils/Analytics';

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
      <>
        <BrowserRouter>
          <div>
            <Switch>
              <GARoute ga={this.ga} path="/" exact component={Main} />
              <GARoute ga={this.ga} path="/flight/:id" exact component={Flight} />
              <GARoute ga={this.ga} path="/passenger/:slug" exact component={Passenger} />
              <GARoute ga={this.ga} component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </>
    );
  }
}
