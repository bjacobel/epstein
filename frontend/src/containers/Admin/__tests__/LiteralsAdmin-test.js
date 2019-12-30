import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import LiteralsAdmin from '../LiteralsAdmin';
import { UPDATE_LITERALS } from '../queries';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';

const mutationResponse = {
  data: {
    updateLiterals: {
      id: 1,
      slug: 'bill-clinton',
      literals: [],
    },
  },
};

describe('LiteralsAdmin component', () => {
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

  describe('when rendered with no literals', () => {
    let passenger;
    beforeEach(() => {
      passenger = { slug: 'bill-clinton', literals: [] };
    });

    it('matches snapshot', () => {
      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      expect(wrapper.children()).toMatchSnapshot();
    });

    it('calls the mutation with one literal after filling the field', async () => {
      const mutationHandler = jest.fn().mockResolvedValue(mutationResponse);
      link.setRequestHandler(UPDATE_LITERALS, mutationHandler);

      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      wrapper.find('input[name="newLiteral"]').simulate('change', {
        target: { form: { newLiteral: { value: 'BILL CLINTON' } } },
      });
      wrapper.find('form').simulate('submit');

      await updateWrapper(wrapper);

      expect(mutationHandler).toHaveBeenCalledWith(
        expect.objectContaining({ literals: ['BILL CLINTON'] }),
      );
    });
  });

  describe('when rendered with existing literal', () => {
    let passenger;
    beforeEach(() => {
      passenger = { slug: 'bill-clinton', literals: ['BILL CLINTON'] };
    });

    it('matches snapshot', () => {
      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      expect(wrapper.children()).toMatchSnapshot();
    });

    it('calls the mutation with two literals after filling the field', async () => {
      const mutationHandler = jest.fn().mockResolvedValue(mutationResponse);
      link.setRequestHandler(UPDATE_LITERALS, mutationHandler);

      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      wrapper.find('input[name="newLiteral"]').simulate('change', {
        target: { form: { newLiteral: { value: 'PRESIDENT CLINTON' } } },
      });
      wrapper.find('form').simulate('submit');

      await updateWrapper(wrapper);

      expect(mutationHandler).toHaveBeenCalledWith(
        expect.objectContaining({ literals: ['BILL CLINTON', 'PRESIDENT CLINTON'] }),
      );
    });

    it('allows you to delete an existing literal', async () => {
      const mutationHandler = jest.fn().mockResolvedValue(mutationResponse);
      link.setRequestHandler(UPDATE_LITERALS, mutationHandler);

      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      wrapper.find('input[name="newLiteral"]').simulate('change', {
        target: { form: { literals: { value: '' } } },
      });
      wrapper.find('form').simulate('submit');

      await updateWrapper(wrapper);

      expect(mutationHandler).toHaveBeenCalledWith(
        expect.objectContaining({ literals: [] }),
      );
    });

    it('allows you to delete an existing literal and add a new one', async () => {
      const mutationHandler = jest.fn().mockResolvedValue(mutationResponse);
      link.setRequestHandler(UPDATE_LITERALS, mutationHandler);

      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      wrapper.find('input[name="newLiteral"]').simulate('change', {
        target: { form: { literals: { value: '' } } },
      });
      wrapper.find('input[name="newLiteral"]').simulate('change', {
        target: { form: { newLiteral: { value: 'PRESIDENT WILLIAM J. CLINTON' } } },
      });
      wrapper.find('form').simulate('submit');

      await updateWrapper(wrapper);

      expect(mutationHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          literals: ['PRESIDENT WILLIAM J. CLINTON'],
        }),
      );
    });
  });
});
