import React from 'react';
import { shallow } from 'enzyme';

import Main from 'components/Main';

describe('main component', () => {
  describe('un-Connected component', () => {
    it('matches snapshot', () => {
      expect(shallow(<Main />)).toMatchSnapshot();
    });
  });
});
