import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import PassengerAdmin from '../PassengerAdmin';
import PassengerSelect, { PASSENGERS } from '../PassengerSelect';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';
import { breadcrumb } from '../style.css';

const passengersData = {
  data: {
    passengers: {
      edges: [
        {
          id: 1,
          slug: 'bill-clinton',
          name: 'Bill Clinton',
          biography: '',
          wikipedia_link: '',
          image: '',
        },
      ],
    },
  },
};

describe('PassengerSelect component', () => {
  let link, client;
  beforeEach(() => {
    link = new MockLink();
    client = new ApolloClient({
      cache: new InMemoryCache({
        addTypename: false,
      }),
      link,
    });
  });

  it('renders a dropdown with passengers from a query initially', async () => {
    const queryHandler = jest.fn().mockResolvedValue(passengersData);
    link.setRequestHandler(PASSENGERS, queryHandler);

    const wrapper = mount(<PassengerSelect clientForTests={client} />);

    await updateWrapper(wrapper);
    expect(wrapper.find(PassengerSelect).children()).toMatchSnapshot();
  });

  it('renders a blank PassengerAdmin if the "new passenger" option is picked', async () => {
    const queryHandler = jest.fn().mockResolvedValue(passengersData);
    link.setRequestHandler(PASSENGERS, queryHandler);

    const wrapper = mount(<PassengerSelect clientForTests={client} />);

    await updateWrapper(wrapper);
    wrapper
      .find(PassengerSelect)
      .find('select')
      .simulate('change', { target: { value: 'new' } });

    expect(wrapper.find(PassengerAdmin).props()).toEqual({
      mode: 'create',
    });
  });

  it('renders a populated PassengerAdmin if existing passenger picked', async () => {
    const queryHandler = jest.fn().mockResolvedValue(passengersData);
    link.setRequestHandler(PASSENGERS, queryHandler);

    const wrapper = mount(<PassengerSelect clientForTests={client} />);

    await updateWrapper(wrapper);
    wrapper
      .find(PassengerSelect)
      .find('select')
      .simulate('change', { target: { value: 'bill-clinton' } });

    expect(wrapper.find(PassengerAdmin).props()).toEqual({
      mode: 'update',
      ...passengersData.data.passengers.edges[0],
    });
  });

  it('has a go back button that erases state and renders initial UI', async () => {
    const queryHandler = jest.fn().mockResolvedValue(passengersData);
    link.setRequestHandler(PASSENGERS, queryHandler);

    const wrapper = mount(<PassengerSelect clientForTests={client} />);

    await updateWrapper(wrapper);
    wrapper
      .find(PassengerSelect)
      .find('select')
      .simulate('change', { target: { value: 'bill-clinton' } });

    wrapper.find(`button.${breadcrumb}`).simulate('click');
    expect(wrapper.find(PassengerSelect).children()).toMatchSnapshot();
  });
});
