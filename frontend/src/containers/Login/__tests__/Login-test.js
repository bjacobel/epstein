import React from 'react';
import { shallow, mount } from 'enzyme';
import { Redirect, useLocation, useHistory } from 'react-router-dom';

import Login from '../Login';
import { setJwtToken, hasValidJwtToken } from '../../../utils/auth';
import { COGNITO_LOGIN_FORM } from '../../../constants';

jest.mock('../../../utils/auth');
jest.mock('react-router-dom');

describe('login container', () => {
  beforeEach(() => {
    useHistory.mockReturnValue({ replace: jest.fn() });
    hasValidJwtToken.mockReturnValue(false);
  });

  describe('when a hash is set via redirect', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        hash: '#access_token=access_token&expires_in=3600',
      });
    });

    it("shows error if there's a hash but no access_token or expires_in", () => {
      useLocation.mockReturnValueOnce({ hash: '#foo=bar' });
      expect(shallow(<Login />)).toMatchInlineSnapshot(`
        <span>
          Error: Redirect uri should include an access_token
        </span>
      `);
    });

    it('calls setJwtToken with the access_token and expires_in', () => {
      mount(<Login />);
      expect(setJwtToken).lastCalledWith('access_token', '3600');
    });

    it('wipes out the hash after reading it', () => {
      const replace = jest.fn();
      useHistory.mockReturnValue({ replace });
      mount(<Login />);
      expect(replace).toHaveBeenCalledWith(expect.objectContaining({ hash: undefined }));
    });
  });

  describe('when no hash and a valid token', () => {
    beforeEach(() => {
      hasValidJwtToken.mockReturnValueOnce(true);
    });

    it('renders a redirect to the admin page', () => {
      const wrapper = shallow(<Login />);
      expect(wrapper.type()).toEqual(Redirect);
      expect(wrapper.prop('to')).toEqual('/admin');
    });
  });

  describe('when no hash and no token', () => {
    it('renders a link to the hosted login page', () => {
      const wrapper = shallow(<Login />);
      expect(wrapper.type()).toEqual('a');
      expect(wrapper.prop('href')).toEqual(COGNITO_LOGIN_FORM);
    });
  });
});
