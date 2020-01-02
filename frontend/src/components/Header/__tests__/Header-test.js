import React from 'react';
import { mount } from 'enzyme';

import Header, { MenuButton } from '../Header';

describe('header component', () => {
  it('matches snapshot', () => {
    const wrapper = mount(<Header />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches snapshot when tapped', () => {
    const wrapper = mount(<Header />);
    wrapper.find(MenuButton).simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
