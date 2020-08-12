import React from 'react';
import { shallow } from 'enzyme';

import ErrorComponent from '../ErrorComponent';

describe('error rendering component', () => {
  describe('in dev mode', () => {
    it('matches snapshot without an error', () => {
      expect(shallow(<ErrorComponent />)).toMatchSnapshot();
    });

    it('matches snapshot with an error', () => {
      expect(
        shallow(<ErrorComponent error={new Error('idk lol')} />)
          .find('pre')
          .text(),
      ).not.toBeUndefined();
    });
  });

  describe('in prod mode', () => {
    it('does not print stack even with an error', () => {
      jest.resetModules();
      jest.doMock('../../../constants', () => ({
        SHOW_DEV_TOOLS: false,
      }));
      // eslint-disable-next-line global-require
      const ScopedErrorComponent = require('../ErrorComponent').default;

      expect(
        shallow(<ScopedErrorComponent error={new Error('idk lol')} />).find('pre').length,
      ).toEqual(0);
    });
  });
});
