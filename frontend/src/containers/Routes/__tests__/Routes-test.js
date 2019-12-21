import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import Routes from '../Routes';
import Flight from '../../Flight';
import Passenger from '../../Passenger';
import Analytics from '../../../utils/Analytics';

jest.mock('containers/Home');
jest.mock('containers/Flight', () => () => null);
jest.mock('containers/Passenger', () => () => null);
jest.mock('containers/NotFound');
jest.mock('utils/Analytics');

const setPath = value => {
  global.history.pushState({}, value, value);
};

describe('Router', () => {
  let RoutedRoutes;
  beforeEach(() => {
    RoutedRoutes = () => (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
  });

  it('matches snapshot', () => {
    expect(shallow(<Routes />)).toMatchSnapshot();
  });

  describe('Routing config', () => {
    it('has a home route', () => {
      setPath('/');
      const routes = mount(<RoutedRoutes />);
      expect(routes.find('Home').length).toBe(1);
    });

    it('routes flights/:id to the Flight component', () => {
      setPath('/flight/125');
      const routes = mount(<RoutedRoutes />);
      expect(routes.find(Flight).length).toBe(1);
      expect(routes.find(Flight).props()).toEqual(
        expect.objectContaining({
          match: expect.objectContaining({
            params: {
              id: '125',
            },
          }),
        }),
      );
    });

    it('routes passenger/:slug to the Passenger component', () => {
      setPath('/passenger/bill-clinton');
      const routes = mount(<RoutedRoutes />);
      expect(routes.find(Passenger).length).toBe(1);
      expect(routes.find(Passenger).props()).toEqual(
        expect.objectContaining({
          match: expect.objectContaining({
            params: {
              slug: 'bill-clinton',
            },
          }),
        }),
      );
    });

    it('has a fallthrough 404', () => {
      setPath('/asdfasaddf');
      const routes = mount(<RoutedRoutes />);
      expect(routes.find('NotFound').length).toBe(1);
    });
  });

  describe('Analytics functionality', () => {
    beforeEach(() => {
      // reset call count before each test
      Analytics.prototype.pageview.mockClear();
    });

    it('inits the analytics class', () => {
      mount(<RoutedRoutes />);
      expect(Analytics).toHaveBeenCalled();
    });

    it('calls the analytics pageview fn when you navigate to a new route', () => {
      mount(<RoutedRoutes />);
      setPath('/child/1');
      expect(Analytics.prototype.pageview).toHaveBeenCalledTimes(1);
    });

    it('supplies GA to routed components via props', () => {
      const routes = mount(<RoutedRoutes />);
      expect(routes.find('Route').props()).toEqual(
        expect.objectContaining({
          ga: {},
        }),
      );
    });
  });
});
