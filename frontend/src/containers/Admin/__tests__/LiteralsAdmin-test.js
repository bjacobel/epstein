import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { mount } from 'enzyme';

import LiteralsAdmin, { UPDATE_LITERALS } from '../LiteralsAdmin';
import MockLink from '../../../utils/testing/MockLink';
import updateWrapper from '../../../utils/testing/updateWrapper';

const mutationResponse = {
  data: {
    updateLiterals: {
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
      passenger = { id: 1, literals: [] };
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
      wrapper
        .find('input[name="newLiteral"]')
        .simulate('change', { target: { form: { newLiteral: { value: 'billy c' } } } });
      wrapper.find('form').simulate('submit');

      await updateWrapper(wrapper);

      expect(mutationHandler).toHaveBeenCalledWith(
        expect.objectContaining({ literals: ['billy c'] }),
      );
    });
  });

  describe('when rendered with existing literals', () => {
    let passenger;
    beforeEach(() => {
      passenger = { id: 1, literals: ['a', 'b', 'c'] };
    });

    it('matches snapshot', () => {
      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      expect(wrapper.children()).toMatchSnapshot();
    });

    it('calls the mutation with four literals after filling the field', async () => {
      const mutationHandler = jest.fn().mockResolvedValue(mutationResponse);
      link.setRequestHandler(UPDATE_LITERALS, mutationHandler);

      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      wrapper
        .find('input[name="newLiteral"]')
        .simulate('change', { target: { form: { newLiteral: { value: 'billy c' } } } });
      wrapper.find('form').simulate('submit');

      await updateWrapper(wrapper);

      expect(mutationHandler).toHaveBeenCalledWith(
        expect.objectContaining({ literals: ['a', 'b', 'c', 'billy c'] }),
      );
    });

    it('allows you to delete an existing literal', async () => {
      const mutationHandler = jest.fn().mockResolvedValue(mutationResponse);
      link.setRequestHandler(UPDATE_LITERALS, mutationHandler);

      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      wrapper.find('input[name="newLiteral"]').simulate('change', {
        target: { form: { literals: [{ value: 'a' }, { value: '' }, { value: 'c' }] } },
      });
      wrapper.find('form').simulate('submit');

      await updateWrapper(wrapper);

      expect(mutationHandler).toHaveBeenCalledWith(
        expect.objectContaining({ literals: ['a', 'c'] }),
      );
    });

    it('allows you to delete an existing literal and add a new one', async () => {
      const mutationHandler = jest.fn().mockResolvedValue(mutationResponse);
      link.setRequestHandler(UPDATE_LITERALS, mutationHandler);

      const wrapper = mount(
        <LiteralsAdmin clientForTests={client} passenger={passenger} />,
      );
      wrapper.find('input[name="newLiteral"]').simulate('change', {
        target: { form: { literals: [{ value: 'a' }, { value: '' }, { value: 'c' }] } },
      });
      wrapper
        .find('input[name="newLiteral"]')
        .simulate('change', { target: { form: { newLiteral: { value: 'billy c' } } } });
      wrapper.find('form').simulate('submit');

      await updateWrapper(wrapper);

      expect(mutationHandler).toHaveBeenCalledWith(
        expect.objectContaining({ literals: ['a', 'c', 'billy c'] }),
      );
    });
  });
});
