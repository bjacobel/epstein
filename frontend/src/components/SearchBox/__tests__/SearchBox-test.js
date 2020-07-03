import React from 'react';
import { mount } from 'enzyme';

import SearchBox from '../SearchBox';
import { errorText } from '../style.css';

describe('SearchBox component', () => {
  it('calls the callback with the field value when the button is clicked', () => {
    const onClick = jest.fn();
    const wrapper = mount(<SearchBox onClick={onClick} />);
    wrapper.find('input').simulate('change', { target: { value: 'searchQuery' } });
    wrapper.find('button').simulate('click');
    expect(onClick).toHaveBeenCalledWith('searchQuery');
  });

  it('sets an error when the button is clicked with no search', () => {
    const onClick = jest.fn();
    const wrapper = mount(<SearchBox onClick={onClick} />);
    wrapper.find('input').simulate('change', { target: { value: undefined } });
    wrapper.find('button').simulate('click');
    expect(onClick).not.toHaveBeenCalled();
    expect(wrapper.find(`.${errorText}`).text()).toEqual('Search query is required.');
  });

  it('clears the error and fires if you correct it', () => {
    const onClick = jest.fn();
    const wrapper = mount(<SearchBox onClick={onClick} />);
    wrapper.find('input').simulate('change', { target: { value: undefined } });
    wrapper.find('button').simulate('click');
    expect(onClick).not.toHaveBeenCalled();
    wrapper.find('input').simulate('change', { target: { value: 'a query' } });
    wrapper.find('button').simulate('click');
    expect(onClick).toHaveBeenCalledWith('a query');
  });
});
