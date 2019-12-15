import React from 'react';
import { shallow } from 'enzyme';

import Home from 'components/Home';

describe('home component', () => {
  it('matches snapshot', () => {
    expect(shallow(<Home />)).toMatchSnapshot();
  });
});
