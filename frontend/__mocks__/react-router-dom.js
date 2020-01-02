import React from 'react';

const reactRouterDOM = jest.requireActual('react-router-dom');

module.exports = {
  ...reactRouterDOM,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
};
