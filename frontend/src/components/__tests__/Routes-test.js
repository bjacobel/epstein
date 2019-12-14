import React from 'react';
import { shallow, mount } from 'enzyme';

import Routes, { GARoute } from 'components/Routes';
import Flight from 'components/Flight';
import Passenger from 'components/Passenger';
import Analytics from 'utils/Analytics';

jest.mock('components/Main');
jest.mock('components/Flight', () => () => null);
jest.mock('components/Passenger', () => () => null);
jest.mock('constants/wellKnownPassengers');
jest.mock('components/NotFound');
jest.mock('utils/Analytics');

const setPath = value => {
  global.history.pushState({}, value, value);
};

describe('Router', () => {
  it('matches snapshot', () => {
    expect(shallow(<Routes />)).toMatchSnapshot();
  });

  describe('Routing config', () => {
    it('has a home route', () => {
      setPath('/');
      const routes = mount(<Routes />);
      expect(routes.find('Main').length).toBe(1);
    });

    it('routes passenger/:id to the Passenger component', () => {
      setPath('/flight/125');
      const routes = mount(<Routes />);
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

    it('routes flights/:id to the Flight component', () => {
      setPath('/passenger/40');
      const routes = mount(<Routes />);
      expect(routes.find(Passenger).length).toBe(1);
      expect(routes.find(Passenger).props()).toEqual(
        expect.objectContaining({
          match: expect.objectContaining({
            params: {
              id: '40',
            },
          }),
        }),
      );
    });

    it('has shorthand urls for well-known passengers', () => {
      const routes = shallow(<Routes />);
      expect(routes.find(GARoute).filter('[path^="/passenger/"]').length).toBe(4);
    });

    it('has a fallthrough 404', () => {
      setPath('/asdfasaddf');
      const routes = mount(<Routes />);
      expect(routes.find('NotFound').length).toBe(1);
    });
  });

  describe('Analytics functionality', () => {
    beforeEach(() => {
      // reset call count before each test
      Analytics.prototype.pageview.mockClear();
    });

    it('inits the analytics class', () => {
      mount(<Routes />);
      expect(Analytics).toHaveBeenCalled();
    });

    it('calls the analytics pageview fn when you navigate to a new route', () => {
      mount(<Routes />);
      setPath('/child/1');
      expect(Analytics.prototype.pageview).toHaveBeenCalledTimes(1);
    });

    it('supplies GA to routed components via props', () => {
      const routes = mount(<Routes />);
      expect(routes.find('Route').props()).toEqual(
        expect.objectContaining({
          ga: {},
        }),
      );
    });
  });
});
