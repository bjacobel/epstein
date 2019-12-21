import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import PaginatedBrowser from '../PaginatedBrowser';
import Loading from '../../Loading';
import { pageCount, hidden } from '../style.css';
import updateWrapper from '../../../utils/testing/updateWrapper';

jest.useFakeTimers();

describe('PaginatedBrowser component', () => {
  const defaultProps = {
    ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    totalAvailable: 19,
    pageSize: 10,
    browserComponent: jest.fn(),
    fetchMore: jest.fn(),
  };

  it('shows the correct number of pages', () => {
    const wrapper = shallow(<PaginatedBrowser {...defaultProps} />);
    expect(wrapper.find(`span.${pageCount}`).text()).toEqual('1 / 2');
  });

  it('disables buttons when appropriate', async () => {
    let prevButton, nextButton;
    const fetchMore = jest.fn().mockResolvedValue({});
    const wrapper = shallow(<PaginatedBrowser {...defaultProps} fetchMore={fetchMore} />);

    prevButton = wrapper.find('button[aria-label~="previous"]');
    nextButton = wrapper.find('button[aria-label~="next"]');
    expect(prevButton.prop('disabled')).toEqual(true);
    expect(nextButton.prop('disabled')).toEqual(false);

    nextButton.simulate('click');
    await updateWrapper(wrapper);

    prevButton = wrapper.find('button[aria-label~="previous"]');
    nextButton = wrapper.find('button[aria-label~="next"]');
    expect(prevButton.prop('disabled')).toEqual(false);
    expect(nextButton.prop('disabled')).toEqual(true);
  });

  it('just shows the next page if its already in props', () => {
    const fetchMore = jest.fn().mockResolvedValue({});
    const wrapper = shallow(
      <PaginatedBrowser
        {...defaultProps}
        ids={[...Array(defaultProps.totalAvailable).keys()]}
        fetchMore={fetchMore}
      />,
    );

    wrapper.find('button[aria-label~="next"]').simulate('click');

    expect(fetchMore).not.toHaveBeenCalled();
  });

  it('calls fetchMore if out of data', () => {
    const fetchMore = jest.fn().mockResolvedValue({});
    const wrapper = shallow(<PaginatedBrowser {...defaultProps} fetchMore={fetchMore} />);

    wrapper.find('button[aria-label~="next"]').simulate('click');

    expect(fetchMore).toHaveBeenCalledTimes(1);
  });

  it('shows a single spinner until all children have rendered', () => {
    const unfinishedComponent = () => null; // never calls done()
    const wrapper = mount(
      <PaginatedBrowser {...defaultProps} browserComponent={unfinishedComponent} />,
    );
    expect(
      wrapper
        .find(Loading)
        .parent()
        .prop('className'),
    ).not.toEqual(hidden);
    expect(wrapper.find('#detailsList').prop('className')).toEqual(hidden);
  });

  it('hides the spinner when _all_ children signal done', async () => {
    const slowComponent = ({ done }) => {
      setTimeout(() => {
        act(() => done());
      }, 10);
      return null;
    };
    const wrapper = mount(
      <PaginatedBrowser {...defaultProps} browserComponent={slowComponent} />,
    );

    jest.advanceTimersByTime(15);
    await updateWrapper(wrapper);

    expect(
      wrapper
        .find(Loading)
        .parent()
        .prop('className'),
    ).toEqual(hidden);
    expect(wrapper.find('#detailsList').prop('className')).not.toEqual(hidden);
  });
});
