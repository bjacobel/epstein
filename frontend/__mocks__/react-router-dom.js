import React from 'react';

const reactRouterDOM = jest.requireActual('react-router-dom');

module.exports = {
  ...reactRouterDOM,
  useLocation: jest.fn(() => ({
    pathname: '/route',
  })),
  useParams: jest.fn(),
  useHistory: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
};
